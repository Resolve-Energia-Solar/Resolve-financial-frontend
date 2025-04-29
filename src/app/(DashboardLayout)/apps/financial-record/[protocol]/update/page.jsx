'use client';
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  Box,
  Stack,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  TextField,
  DialogActions,
  Autocomplete
} from '@mui/material';
import Alert from '@mui/material/Alert';
import { useRouter, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import AutoCompleteDepartment from '@/app/components/apps/financial-record/departmentInput';
import AutoCompleteCategory from '@/app/components/apps/financial-record/categoryInput';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomFieldMoney from '@/app/components/apps/invoice/components/CustomFieldMoney';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/app/components/shared/ParentCard';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AttachmentDrawer from '../../../attachment/AttachmentDrawer';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';

import useFinancialRecordForm from '@/hooks/financial_record/useFinancialRecordForm';
import { calculateDueDate } from '@/utils/calcDueDate';
import bankDetailService from '@/services/bankDetailService'
import financialRecordService from '@/services/financialRecordService';
import attachmentService from '@/services/attachmentService';
import getContentType from '@/utils/getContentType';
import { formatDate } from '@/utils/dateUtils';

export default function UpdateForm() {
  const router = useRouter();
  const { protocol } = useParams();

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: '/apps/financial-record', title: 'Contas a Receber/Pagar' },
    { to: `/apps/financial-record/${protocol}`, title: protocol },
    { title: `Editar` },
  ];

  const [recordId, setRecordId] = useState(null);
  const { formData, handleChange, formErrors, setFormErrors, success } = useFinancialRecordForm();
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [minDueDate, setMinDueDate] = useState('');
  const [contentTypeId, setContentTypeId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state.user?.user);
  const userPermissions = user?.permissions || user?.user_permissions || [];
  const [bankInstitutions, setBankInstitutions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const ctId = await getContentType('financial', 'financialrecord');
        setContentTypeId(ctId);
      } catch (error) {
        console.error('Erro ao buscar content type:', error);
      }
    })();
  }, []);

  useEffect(() => {
    if (!userPermissions.includes('financial.change_financialrecord')) {
      enqueueSnackbar('Você não tem permissão para acessar essa página!', { variant: 'error' });
      router.push('/apps/financial-record');
    } else if (user?.employee?.department?.name === 'Tecnologia' && !user?.is_staff) {
      enqueueSnackbar('Contate o suporte para correção cadastral!', { variant: 'error' });
      router.push('/apps/financial-record');
    }
  }, [userPermissions, router]);

  const populateForm = (data) => {
    Object.entries(data).forEach(([key, value]) => {
      handleChange(key, value);
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const dataList = await financialRecordService.index({
          protocol__in: protocol,
          fields: 'id',
        });
        const records = dataList.results;
        if (records && records.length > 0) {
          const record = records[0];
          setRecordId(record.id);
          const fetchedData = await financialRecordService.find(record.id, { expand: 'requester,responsible', fields: '*,requester.id,requester.complete_name,responsible.id,responsible.complete_name,requesting_department,responsible_status,payment_status,status' });
          if (fetchedData.status !== 'S' || fetchedData.payment_status !== 'P' || fetchedData.responsible_status !== 'P') {
            enqueueSnackbar('Registro não pode ser editado, pois não está pendente.', { variant: 'error' });
            router.push('/apps/financial-record/' + protocol);
            return;
          }
          populateForm(fetchedData);
        } else {
          enqueueSnackbar('Registro não encontrado.', { variant: 'error' });
          router.push('/apps/financial-record');
        }
      } catch (error) {
        console.error('Erro ao carregar os dados do registro:', error);
        enqueueSnackbar('Erro ao carregar os dados do registro.', { variant: 'error' });
        router.push('/apps/financial-record');
      } finally {
        setLoadingData(false);
      }
    })();
  }, [protocol, enqueueSnackbar, router]);

  useEffect(() => {
    fetch('https://brasilapi.com.br/api/banks/v1')
      .then(res => res.json())
      .then(data => {
        const list = data.filter(b => b.code !== null);
        setBankInstitutions(list);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (formData.value && formData.category_code) {
        const now = new Date();
        const computedDueDate = calculateDueDate({
          now,
          amount: formData.value,
          category: formData.category_code,
          department: user?.employee?.department?.id || '',
          requestTime: now,
        });
        const formattedDueDate = computedDueDate.toISOString().split('T')[0];
        if (formData.due_date !== formattedDueDate) {
          setMinDueDate(formattedDueDate);
          handleChange('due_date', formattedDueDate);
        }
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.value, formData.category_code, user?.employee?.department?.id, formData.due_date]);


  const fieldLabels = {
    client_supplier_name: 'Beneficiário (Nome/CPF/CNPJ)',
    requesting_department: 'Departamento Solicitante',
    bank_details: 'Dados Bancários',
    department_code: 'Departamento Causador',
    department_name: 'Nome do Departamento',
    category_code: 'Categoria',
    category_name: 'Nome da Categoria',
    value: 'Valor (R$)',
    notes: 'Descrição',
    payment_method: 'Forma de Pagamento',
    is_receivable: 'A pagar / A receber',
    service_date: 'Data do Serviço',
    due_date: 'Data de Vencimento',
    invoice_number: 'Número da Nota Fiscal',
  };

  const handleAddAttachment = (attachment) => {
    setAttachments((prev) => [...prev, attachment]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const missingFields = [];
    if (!formData.value) missingFields.push('Valor (R$)');
    if (!formData.due_date) missingFields.push('Data de Vencimento');
    if (!formData.service_date) missingFields.push('Data do Serviço');
    if (!formData.category_code) missingFields.push('Categoria');
    if (!formData.category_name) missingFields.push('Nome da Categoria');
    if (!formData.client_supplier_code) missingFields.push('Código do Beneficiário');
    if (!formData.client_supplier_name) missingFields.push('Nome do Beneficiário');
    if (!formData.requesting_department) missingFields.push('Departamento Solicitante');
    if (['T', 'P'].includes(formData.payment_method) && !formData.bank_details) missingFields.push('Dados Bancários');
    if (!formData.department_code) missingFields.push('Departamento Causador');

    if (missingFields.length) {
      enqueueSnackbar(
        `Por favor, preencha os seguintes campos: ${missingFields.join(', ')}`,
        { variant: 'error' }
      );
      return;
    }
    try {
      const { requester, responsible, ...dataWithoutRequesterAndResponsible } = formData;
      await financialRecordService.update(recordId, dataWithoutRequesterAndResponsible);
      await Promise.all(
        attachments.map(async (attachment) => {
          const formDataAttachment = new FormData();
          formDataAttachment.append('file', attachment.file);
          formDataAttachment.append('description', attachment.description);
          formDataAttachment.append('object_id', protocol);
          formDataAttachment.append('content_type', contentTypeId);
          formDataAttachment.append('document_type', '');
          formDataAttachment.append('document_subtype', '');
          formDataAttachment.append('status', '');
          await attachmentService.create(formDataAttachment);
        }),
      );
      router.push('/apps/financial-record/' + protocol);
      enqueueSnackbar('Registro atualizado com sucesso!', { variant: 'success' });
    } catch (error) {
      console.error('Erro ao atualizar registro ou anexos:', error);
      if (error.response && error.response.data) {
        const errors = error.response.data;
        setFormErrors(errors);
        Object.keys(errors).forEach((field) => {
          const label = fieldLabels[field] || field;
          enqueueSnackbar(`Erro no campo ${label}: ${errors[field].join(', ')}`, {
            variant: 'error',
          });
        });
      } else {
        enqueueSnackbar('Erro ao atualizar registro ou anexos: ' + error.message, {
          variant: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <PageContainer title="Carregando..." description="Aguarde...">
        <CircularProgress />
      </PageContainer>
    );
  }

  if (success) {
    router.push('/apps/financial-record');
  }

  const saleStatusMap = {
    P: ['Pendente', 'warning'],
    F: ['Finalizado', 'success'],
    EA: ['Em Andamento', 'info'],
    C: ['Cancelado', 'error'],
    D: ['Distrato', 'default'],
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <PageContainer
      title="Atualização de Contas a Receber/Pagar"
      description="Formulário para atualizar conta a receber/pagar"
    >
      <Breadcrumb items={BCrumb} />
      {success && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          A conta a receber/pagar foi atualizada com sucesso!
        </Alert>
      )}
      <ParentCard title="Atualizar Conta a Receber/Pagar">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <CustomFormLabel>Solicitante</CustomFormLabel>
            <Select variant="outlined" fullWidth value={formData.requester?.complete_name || ''} disabled>
              <MenuItem value={formData.requester?.complete_name || ''}>{formData.requester?.complete_name}</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomFormLabel>Responsável pela Aprovação</CustomFormLabel>
            <Select
              variant="outlined"
              fullWidth
              value={formData.responsible?.complete_name || ''}
              disabled
            >
              <MenuItem value={formData.responsible?.complete_name || ''}>
                {formData.responsible?.complete_name || ''}
              </MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomFormLabel htmlFor="department_code">Departamento Causador</CustomFormLabel>
            <AutoCompleteDepartment
              onChange={(department) => {
                handleChange('department_code', department?.codigo || '');
                handleChange('department_name', department?.descricao || '');
              }}
              value={formData.department_code || ''}
              error={formErrors.department_code}
              helperText={formErrors.department_code}
              disabled={false}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomFormLabel htmlFor="requesting_department">
              Departamento Solicitante
            </CustomFormLabel>
            <GenericAsyncAutocompleteInput
              label="Departamento Solicitante"
              name="requesting_department"
              value={formData.requesting_department || null}
              onChange={(e) => handleChange('requesting_department', e.target.value)}
              endpoint="/api/departments"
              queryParam="name__icontains"
              extraParams={{
                fields: ['id', 'name'],
                ordering: ['name'],
                limit: 100
              }}
              mapResponse={(data) =>
                data.results.map((d) => ({
                  label: d.name,
                  value: d.id,
                }))
              }
              fullWidth
              helperText={formErrors.requesting_department?.[0] || ''}
              error={!!formErrors.requesting_department}
            />
          </Grid>
          {/* Campo de Beneficiário exibido somente */}
          <Grid item xs={12}>
            <CustomFormLabel>Beneficiário (Nome/CPF/CNPJ)</CustomFormLabel>
            <CustomTextField
              name="client_supplier_name"
              variant="outlined"
              fullWidth
              value={formData.client_supplier_name || ''}
              disabled
            />
          </Grid>
          {formData.client_supplier_code && ['T', 'P'].includes(formData.payment_method) && (
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="bank_details">Dados Bancários</CustomFormLabel>
              <GenericAsyncAutocompleteInput
                label="Dados Bancários"
                value={formData.bank_details}
                onChange={opt => handleChange('bank_details', opt?.value || '')}
                endpoint="/api/bank-details"
                queryParam=""
                extraParams={{ client_supplier_code__in: formData.client_supplier_code }}
                mapResponse={data =>
                  (data.results || []).map(b => ({
                    label:
                      b.account_type === 'X'
                        ? `PIX (${{
                          CPF: 'CPF',
                          CNPJ: 'CNPJ',
                          EMAIL: 'E-mail',
                          PHONE: 'Celular/Telefone',
                          RANDOM: 'Aleatória'
                        }[b.pix_key_type]}): ${b.pix_key}`
                        : `${b.financial_instituition} Ag: ${b.agency_number} Conta: ${b.account_number}`,
                    value: b.id,
                  }))
                }
                freeSolo={false}
                filterOptions={opts => opts}
                error={!!formErrors.bank_details}
                helperText={formErrors.bank_details}
                renderCreateModal={({ newObjectData, setNewObjectData, onCreate, onClose, errors }) => (
                  <>
                    <FormControl fullWidth margin="dense">
                      <Autocomplete
                        options={bankInstitutions.map(b => ({
                          label: `${b.code} - ${b.name}`,
                          value: `${b.code} - ${b.name}`
                        }))}
                        value={
                          newObjectData.financial_instituition
                            ? { label: newObjectData.financial_instituition, value: newObjectData.financial_instituition }
                            : null
                        }
                        onChange={(_, opt) =>
                          setNewObjectData({ ...newObjectData, financial_instituition: opt?.value || '' })
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            label={`Instituição Financeira (${newObjectData.account_type !== 'X' ? 'Obrigatória' : 'Opcional'})`}
                            fullWidth
                            margin="dense"
                            error={!!errors.financial_instituition}
                            helperText={errors.financial_instituition?.[0]}
                          />
                        )}
                      />
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                      <InputLabel id="account-type-label">Tipo de Conta</InputLabel>
                      <Select
                        labelId="account-type-label"
                        label="Tipo de Conta"
                        value={newObjectData.account_type || 'C'}
                        onChange={e => {
                          const account_type = e.target.value;
                          setNewObjectData({
                            ...newObjectData,
                            account_type,
                            agency_number: '',
                            account_number: '',
                            pix_key_type: '',
                            pix_key: ''
                          });
                        }}
                      >
                        <MenuItem value="C">Corrente</MenuItem>
                        <MenuItem value="P">Poupança</MenuItem>
                        <MenuItem value="X">PIX</MenuItem>
                      </Select>
                    </FormControl>

                    {newObjectData.account_type !== 'X' && (
                      <>
                        <TextField
                          label="Número da Agência"
                          fullWidth
                          margin="dense"
                          value={newObjectData.agency_number || ''}
                          onChange={e => setNewObjectData({ ...newObjectData, agency_number: e.target.value })}
                          error={!!errors.agency_number}
                          helperText={errors.agency_number?.[0]}
                        />
                        <TextField
                          label="Número da Conta"
                          fullWidth
                          margin="dense"
                          value={newObjectData.account_number || ''}
                          onChange={e => setNewObjectData({ ...newObjectData, account_number: e.target.value })}
                          error={!!errors.account_number}
                          helperText={errors.account_number?.[0]}
                        />
                      </>
                    )}

                    {newObjectData.account_type === 'X' && (
                      <>
                        <FormControl fullWidth margin="dense">
                          <InputLabel id="pix-key-type-label">Tipo de Chave PIX</InputLabel>
                          <Select
                            labelId="pix-key-type-label"
                            label="Tipo de Chave PIX"
                            value={newObjectData.pix_key_type || ''}
                            onChange={e => setNewObjectData({ ...newObjectData, pix_key_type: e.target.value })}
                            error={!!errors.pix_key_type}
                            helperText={errors.pix_key_type?.[0]}
                          >
                            <MenuItem value="CPF">CPF</MenuItem>
                            <MenuItem value="CNPJ">CNPJ</MenuItem>
                            <MenuItem value="EMAIL">E-mail</MenuItem>
                            <MenuItem value="PHONE">Celular/Telefone</MenuItem>
                            <MenuItem value="RANDOM">Chave Aleatória</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          label="Chave PIX"
                          fullWidth
                          margin="dense"
                          value={newObjectData.pix_key || ''}
                          onChange={e => setNewObjectData({ ...newObjectData, pix_key: e.target.value })}
                          error={!!errors.pix_key}
                          helperText={errors.pix_key?.[0]}
                        />
                      </>
                    )}

                    <DialogActions>
                      <Button onClick={onCreate} variant="contained">Salvar</Button>
                    </DialogActions>
                  </>
                )}
                onCreateObject={newBank =>
                  bankDetailService.create({ client_supplier_code: formData.client_supplier_code, ...newBank })
                }
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <CustomFormLabel htmlFor="notes">Descrição</CustomFormLabel>
            <CustomTextField
              name="notes"
              variant="outlined"
              fullWidth
              multiline
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              error={!!formErrors.notes}
              helperText={formErrors.notes}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomFormLabel htmlFor="category_code">Categoria</CustomFormLabel>
            <AutoCompleteCategory
              onChange={(category) => {
                handleChange('category_code', category?.codigo || '');
                handleChange('category_name', category?.descricao || '');
              }}
              value={formData.category_code || ''}
              error={formErrors.category_code}
              helperText={formErrors.category_code}
              disabled={false}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomFormLabel htmlFor="value">Valor (R$)</CustomFormLabel>
            <CustomFieldMoney
              name="value"
              variant="outlined"
              fullWidth
              value={formData.value || ''}
              onChange={(value) => handleChange('value', value)}
              error={!!formErrors.value}
              helperText={formErrors.value}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomFormLabel htmlFor="payment_method">Forma de Pagamento</CustomFormLabel>
            <Select
              name="payment_method"
              variant="outlined"
              fullWidth
              value={formData.payment_method || 'P'}
              onChange={(e) => handleChange('payment_method', e.target.value)}
              error={!!formErrors.payment_method}
            >
              <MenuItem value="B">Boleto</MenuItem>
              <MenuItem value="T">Transferência Bancária</MenuItem>
              <MenuItem value="E">Dinheiro em Espécie</MenuItem>
              <MenuItem value="D">Cartão de Débito</MenuItem>
              <MenuItem value="C">Cartão de Crédito</MenuItem>
              <MenuItem value="P">Pix</MenuItem>
            </Select>
            {formErrors.payment_method && (
              <FormHelperText>{formErrors.payment_method}</FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomFormLabel htmlFor="project">Projeto</CustomFormLabel>
            <GenericAsyncAutocompleteInput
              label="Projeto"
              name="project"
              value={formData.project || null}
              onChange={(e) => handleChange('project', e.target.value)}
              endpoint="/api/projects"
              queryParam="q"
              extraParams={{
                expand: [
                  'sale',
                  'sale.customer',
                  'product',
                  'sale.homologator'
                ],
                fields: [
                  'id',
                  'project_number',
                  'address',
                  'sale.total_value',
                  'sale.contract_number',
                  'sale.customer.complete_name',
                  'product.name',
                  'product.description',
                  'sale.signature_date',
                  'sale.status',
                  'sale.homologator.complete_name',
                  'address.complete_address',
                ]
              }}
              mapResponse={(data) =>
                data.results.map((p) => ({
                  label: `${p.project_number} - ${p.sale.customer.complete_name}`,
                  value: p.id,
                  project_number: p.project_number,
                  total_value: p.sale.total_value,
                  contract_number: p.sale.contract_number,
                  customer_name: p.sale.customer.complete_name,
                  product: p.product,
                  signature_date: p.sale.signature_date,
                  status: p.sale.status,
                  homologator: p.sale.homologator,
                  address: p.address
                }))
              }
              fullWidth
              helperText={formErrors.project?.[0] || ''}
              error={!!formErrors.project}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2">
                      <strong>Projeto:</strong> {option.project_number}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Valor total:</strong> {option.total_value ? formatCurrency(option.total_value) : 'Sem valor Total'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Contrato:</strong> {option.contract_number || 'Contrato não Disponível'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Homologador:</strong> {option.homologator?.complete_name || 'Homologador não Disponível'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Data de Contrato:</strong> {formatDate(option.signature_date) || 'Data de Contrato não Disponível'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Endereço:</strong> {option.address?.complete_address || 'Endereço não Disponível'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status da Venda:</strong>{' '}
                      {option.status ? (
                        <Chip
                          label={saleStatusMap[option.status][0] || 'Status Desconhecido'}
                          size="small"
                          color={saleStatusMap[option.status][1] || 'default'}
                        />
                      ) : (
                        'Status não Disponível'
                      )}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Produto:</strong> {option.product?.name || option.product?.description || 'Produto não Disponível'}
                    </Typography>
                  </Box>
                </li>
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <CustomFormLabel htmlFor="service_date">Data do Serviço</CustomFormLabel>
            <CustomTextField
              name="service_date"
              type="date"
              variant="outlined"
              fullWidth
              value={formData.service_date || ''}
              onChange={(e) => handleChange('service_date', e.target.value)}
              error={!!formErrors.service_date}
              helperText={formErrors.service_date}
            />
          </Grid>
          <Grid item xs={6}>
            <CustomFormLabel htmlFor="due_date">Data de Vencimento</CustomFormLabel>
            <CustomTextField
              name="due_date"
              type="date"
              variant="outlined"
              fullWidth
              value={formData.due_date || ''}
              onChange={(e) => handleChange('due_date', e.target.value)}
              inputProps={{ min: minDueDate }}
              error={!!formErrors.due_date}
              helperText={formErrors.due_date}
              disabled={!(formData.value && formData.category_code)}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="invoice_number">Número da Nota Fiscal</CustomFormLabel>
            <CustomTextField
              name="invoice_number"
              variant="outlined"
              fullWidth
              value={formData.invoice_number || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 20) {
                  handleChange('invoice_number', value);
                }
              }}
              error={!!formErrors.invoice_number}
              helperText={formErrors.invoice_number}
            />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="space-between" mt={2}>
              <AttachmentDrawer
                objectId={recordId}
                attachments={attachments}
                onAddAttachment={handleAddAttachment}
                appLabel="financial"
                model="financialrecord"
              />
              <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Atualizar'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
}
