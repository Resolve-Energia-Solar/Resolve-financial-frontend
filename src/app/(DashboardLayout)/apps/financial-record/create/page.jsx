'use client';
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  Stack,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Box,
  Typography,
  Chip
} from '@mui/material';
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import AutoCompleteDepartment from '@/app/components/apps/financial-record/departmentInput';
import AutoCompleteCategory from '@/app/components/apps/financial-record/categoryInput';
import AutoCompleteBeneficiary from '@/app/components/apps/financial-record/beneficiaryInput';
import AutoCompleteDepartament from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Departament';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomFieldMoney from '@/app/components/apps/invoice/components/CustomFieldMoney';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/app/components/shared/ParentCard';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AttachmentDrawer from '../../attachment/AttachmentDrawer';

import useFinancialRecordForm from '@/hooks/financial_record/useFinancialRecordForm';
import { calculateDueDate } from '@/utils/calcDueDate';
import financialRecordService from '@/services/financialRecordService';
import attachmentService from '@/services/attachmentService';
import getContentType from '@/utils/getContentType';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';
import { formatDate } from '@/utils/dateUtils';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Criar Contas a Pagar',
  },
];

export default function CreateFinancialRecord() {
  const router = useRouter();
  const { formData, handleChange, formErrors, setFormErrors, success } = useFinancialRecordForm();
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state.user?.user);
  const userPermissions = user?.permissions || user?.user_permissions || [];
  const [minDueDate, setMinDueDate] = useState('');
  const [contentTypeId, setContentTypeId] = useState(null);

  useEffect(() => {
    async function fetchContentTypeId() {
      try {
        const id = await getContentType('financial', 'financialrecord');
        setContentTypeId(id);
      } catch (error) {
        console.error('Erro ao buscar content type:', error);
      }
    }
    fetchContentTypeId();
  }, []);

  useEffect(() => {
    if (!userPermissions.includes('financial.add_financialrecord')) {
      enqueueSnackbar('Você não tem permissão para acessar essa página!', { variant: 'error' });
      router.push('/apps/financial-record');
    } else if (user?.employee?.department?.name === 'Tecnologia' && !user?.is_staff) {
      enqueueSnackbar('Contate o suporte para correção cadastral!', { variant: 'error' });
      router.push('/apps/financial-record');
    }
  }, [userPermissions, router]);

  const fieldLabels = {
    client_supplier_code: 'Beneficiário (Nome/CPF/CNPJ)',
    client_supplier_name: 'Nome do Beneficiário',
    requesting_department: 'Departamento Solicitante',
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

  // Armazena os anexos adicionados (antes da criação)
  const handleAddAttachment = (attachment) => {
    setAttachments((prev) => [...prev, attachment]);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (formData.value && formData.category_code) {
        try {
          const now = new Date();
          const amount = formData.value;
          const department = user?.employee?.department?.id || '';
          const category = formData.category_code;
          const computedDueDate = calculateDueDate({
            now,
            amount,
            category,
            department,
            requestTime: now,
          });
          const formattedComputedDueDate = computedDueDate.toISOString().split('T')[0];

          setMinDueDate(formattedComputedDueDate);
          handleChange('due_date', formattedComputedDueDate);
        } catch (error) {
          console.error('Erro ao calcular a data de vencimento:', error);
        }
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.value, formData.category_code, user?.employee?.department?.id]);

  const handleSubmit = async () => {
    const missingFields = [];
    if (!formData.value) missingFields.push('Valor (R$)');
    if (!formData.due_date) missingFields.push('Data de Vencimento');
    if (!formData.service_date) missingFields.push('Data do Serviço');
    if (!formData.category_code) missingFields.push('Categoria');
    if (!formData.category_name) missingFields.push('Nome da Categoria');
    if (!formData.client_supplier_code) missingFields.push('Código do Beneficiário');
    if (!formData.client_supplier_name) missingFields.push('Nome do Beneficiário');
    if (!formData.department_code) missingFields.push('Departamento Causador');

    if (missingFields.length) {
      enqueueSnackbar(
        `Por favor, preencha os seguintes campos: ${missingFields.join(', ')}`,
        { variant: 'error' }
      );
      return;
    }

    setLoading(true);
    try {
      const recordResponse = await financialRecordService.update(formData);
      const recordId = recordResponse.id;
      await Promise.all(
        attachments.map(async (attachment) => {
          const formDataAttachment = new FormData();
          formDataAttachment.append('file', attachment.file);
          formDataAttachment.append('description', attachment.description);
          formDataAttachment.append('object_id', recordId);
          formDataAttachment.append('content_type_id', contentTypeId);
          formDataAttachment.append('document_type_id', '');
          formDataAttachment.append('document_subtype_id', '');
          formDataAttachment.append('status', '');
          await attachmentService.create(formDataAttachment);
        }),
      );
      router.push('/apps/financial-record');
    } catch (error) {
      console.error('Erro ao salvar registro ou anexos:', error);
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
        enqueueSnackbar('Erro ao salvar registro ou anexos: ' + error.message, {
          variant: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

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
      title="Criação de Contas a Receber/Pagar"
      description="Formulário para criar nova conta a receber/pagar"
    >
      <Breadcrumb items={BCrumb} />
      {success && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          A conta a receber/pagar foi criada com sucesso!
        </Alert>
      )}
      <ParentCard title="Nova Conta a Receber/Pagar">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <CustomFormLabel>Solicitante</CustomFormLabel>
            <Select variant="outlined" fullWidth value={user?.complete_name || ''} disabled>
              <MenuItem value={user?.complete_name || ''}>{user?.complete_name}</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomFormLabel>Responsável pela Aprovação</CustomFormLabel>
            <Select
              variant="outlined"
              fullWidth
              value={user?.employee?.user_manager?.complete_name || ''}
              disabled
            >
              <MenuItem value={user?.employee?.user_manager?.complete_name || ''}>
                {user?.employee?.user_manager?.complete_name}
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
              value={formData.department_code}
              error={formErrors.department_code}
              helperText={formErrors.department_code}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomFormLabel htmlFor="requesting_department">
              Departamento Solicitante
            </CustomFormLabel>
            <AutoCompleteDepartament
              onChange={(value) => handleChange('requesting_department', value)}
              value={formData.requesting_department || user?.employee?.department?.id}
              error={formErrors.requesting_department}
              helperText={formErrors.requesting_department}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="client_supplier_code">
              Beneficiário (Nome/CPF/CNPJ)
            </CustomFormLabel>
            <AutoCompleteBeneficiary
              name="client_supplier_code"
              value={formData.client_supplier_code}
              error={formErrors.client_supplier_code}
              helperText={formErrors.client_supplier_code}
              onChange={(beneficiary) => {
                handleChange('client_supplier_code', beneficiary?.codigo_cliente || '');
                handleChange('client_supplier_name', beneficiary?.nome_fantasia || '');
              }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="notes">Descrição</CustomFormLabel>
            <CustomTextField
              name="notes"
              variant="outlined"
              fullWidth
              multiline
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              error={!!formErrors.notes}
              helperText={formErrors.notes}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomFormLabel htmlFor="category_code">Categoria</CustomFormLabel>
            <AutoCompleteCategory
              onChange={(category) => {
                handleChange('category_code', category?.codigo || '');
                handleChange('category_name', category?.descricao || '');
              }}
              value={formData.category_code}
              error={formErrors.category_code}
              helperText={formErrors.category_code}
              disabled={false}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomFormLabel htmlFor="value">Valor (R$)</CustomFormLabel>
            <CustomFieldMoney
              name="value"
              variant="outlined"
              fullWidth
              value={formData.value}
              onChange={(value) => handleChange('value', value)}
              error={!!formErrors.value}
              helperText={formErrors.value}
              required
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
              required
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
              value={formData.service_date}
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
              value={formData.due_date}
              onChange={(e) => handleChange('due_date', e.target.value)}
              inputProps={{ min: minDueDate }}
              error={!!formErrors.due_date}
              helperText={formErrors.due_date}
              disabled={!(formData.value && formData.category_code)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="invoice_number">Número da Nota Fiscal</CustomFormLabel>
            <CustomTextField
              name="invoice_number"
              variant="outlined"
              fullWidth
              value={formData.invoice_number}
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
                objectId={null}
                attachments={attachments}
                onAddAttachment={handleAddAttachment}
                appLabel={'financial'}
                model={'financialrecord'}
              />
              <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Criar'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
}
