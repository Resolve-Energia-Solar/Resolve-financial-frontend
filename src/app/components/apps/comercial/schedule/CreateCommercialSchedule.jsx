'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Grid,
  Button,
  Stack,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
} from '@mui/material';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import useScheduleForm from '@/hooks/inspections/schedule/useScheduleForm';
import { useSelector } from 'react-redux';
import formatDate from '@/utils/formatDate';

const timeOptions = [
  { value: '08:30:00', label: '08:30' },
  { value: '10:00:00', label: '10:00' },
  { value: '13:00:00', label: '13:00' },
  { value: '14:30:00', label: '14:30' },
  { value: '16:00:00', label: '16:00' },
];

export default function CreateCommercialSchedule({ onClose, onRefresh }) {
  const router = useRouter();
  const {
    formData,
    handleChange,
    handleSave,
    loading: formLoading,
    formErrors,
    success,
  } = useScheduleForm();

  console.log('formData', formData);
  const user = useSelector((state) => state.user);
  console.log('user', user);

  const [hasSale, setHasSale] = useState(null);
  const [clientSelected, setClientSelected] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const routerPushOrClose = () => {
    if (onClose) {
      onClose();
      onRefresh && onRefresh();
    } else {
      router.push('/apps/inspections/schedule');
    }
  };

  useEffect(() => {
    if (success) {
      routerPushOrClose();
    }
  }, [success]);

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const validateChange = (field, newValue) => {
    handleChange(field, newValue);
  };

  const handleSaleToggle = (event) => {
    const value = event.target.value === 'true';
    setHasSale(value);
    handleChange('project', null);
    handleChange('products', []);      // limpa products
    handleChange('branch', null);      // limpa branch
    handleChange('address', null);
    setSelectedAddress(null);
  };

  const handleProjectChange = (option) => {
    // 1) Atualiza o projeto
    handleChange('project', option || null);

    // 2) Atualiza products com o produto do projeto
    if (option?.product) {
      handleChange('products', [
        { label: option.product.label, value: option.product.value },
      ]);
    } else {
      handleChange('products', []);
    }

    // 3) Mocka a unidade (branch) do usuário logado
    handleChange('branch', user?.user?.employee?.branch);

    // 4) Atualiza endereço como antes
    if (option && option.address) {
      handleChange('address', option.address.value);
      setSelectedAddress({
        label: option.address.label,
        value: option.address.value,
      });
    } else {
      setAlertOpen(true);
      setAlertMessage(
        'Este projeto não possui endereço associado. Por favor, selecione um endereço manualmente.'
      );
      setAlertType('warning');
      handleChange('address', null);
      setSelectedAddress(null);
    }
  };

  const saleStatusMap = {
    P: 'Pendente',
    F: 'Finalizado',
    EA: 'Em Andamento',
    C: 'Cancelado',
    D: 'Distrato',
  };

  return (
    <>
      <Grid container spacing={3}>
        {/* Cliente */}
        <Grid item xs={12}>
          <CustomFormLabel htmlFor="customer">Cliente</CustomFormLabel>
          <GenericAsyncAutocompleteInput
            label="Cliente"
            endpoint="/api/users"
            queryParam="complete_name__icontains"
            extraParams={{ fields: 'complete_name,id' }}
            value={formData.customer}
            onChange={(option) => {
              setClientSelected(option ? option.value : '');
              handleChange('customer', option || null);
            }}
            mapResponse={(data) =>
              data.results.map((item) => ({
                label: item.complete_name,
                value: item.id,
              }))
            }
            {...(formErrors.customer && {
              error: true,
              helperText: formErrors.customer,
            })}
          />
        </Grid>

        {/* Serviço */}
        <Grid item xs={12}>
          <CustomFormLabel htmlFor="service">Serviço</CustomFormLabel>
          <GenericAsyncAutocompleteInput
            label="Serviço"
            endpoint="/api/services"
            queryParam="name__icontains"
            extraParams={{ fields: 'name,id' }}
            value={formData.service}
            debounceTime={500}
            onChange={(option) => {
              validateChange('service', option || null);
            }}
            mapResponse={(data) =>
              data.results.map((item) => ({
                label: item.name,
                value: item.id,
              }))
            }
            {...(formErrors.service && {
              error: true,
              helperText: formErrors.service,
            })}
          />
        </Grid>

        {/* Data e Hora */}
        <Grid item xs={12} sm={6}>
          <FormDate
            label="Data do agendamento"
            name="schedule_date"
            value={formData.schedule_date}
            onChange={(newValue) => {
              validateChange('schedule_date', newValue);
            }}
            {...(formErrors.schedule_date && {
              error: true,
              helperText: formErrors.schedule_date,
            })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormSelect
            label="Hora do agendamento"
            options={timeOptions}
            onChange={(e) => {
              validateChange('schedule_start_time', e.target.value);
            }}
            disabled={!formData.schedule_date}
            value={formData.schedule_start_time || ''}
            {...(formErrors.schedule_start_time && {
              error: true,
              helperText: formErrors.schedule_start_time,
            })}
          />
        </Grid>

        {/* Toggle Venda */}
        <Grid item xs={12}>
          <FormControl
            component="fieldset"
            disabled={
              !(
                formData.customer &&
                formData.service &&
                formData.schedule_date &&
                formData.schedule_start_time
              )
            }
          >
            <FormLabel component="legend">
              O cliente já possui Venda?
              {!(
                formData.customer &&
                formData.service &&
                formData.schedule_date &&
                formData.schedule_start_time
              ) && (
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ ml: 1 }}
                >
                  Preencha Cliente, Serviço, Data e Hora
                </Typography>
              )}
            </FormLabel>
            <RadioGroup
              row
              value={hasSale === null ? '' : hasSale.toString()}
              onChange={handleSaleToggle}
            >
              <FormControlLabel value="true" control={<Radio />} label="Sim" />
              <FormControlLabel value="false" control={<Radio />} label="Não" />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Cliente já possui venda */}
        {hasSale === true && (
          <>
            {/* Projeto */}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="project">Projeto</CustomFormLabel>
              <GenericAsyncAutocompleteInput
                label="Projeto"
                noOptionsText="Nenhum projeto encontrado"
                endpoint="/api/projects"
                queryParam="q"
                value={formData.project}
                onChange={handleProjectChange}
                extraParams={{
                  expand: [
                    'sale.customer',
                    'sale',
                    'sale.branch',
                    'product',
                    'sale.homologator',
                    'address',
                  ],
                  fields: [
                    'id',
                    'project_number',
                    'address',
                    'sale.total_value',
                    'sale.contract_number',
                    'sale.customer.complete_name',
                    'sale.customer.id',
                    'sale.branch.id',
                    'sale.branch.name',
                    'product.id',
                    'product.name',
                    'product.description',
                    'sale.signature_date',
                    'sale.status',
                    'sale.homologator.complete_name',
                    'address.complete_address',
                    'address.id',
                  ],
                  customer: clientSelected,
                }}
                mapResponse={(data) =>
                  data.results.map((p) => ({
                    label: `${p.project_number} - ${p.sale.customer.complete_name}`,
                    value: p.id,
                    project_number: p.project_number,
                    total_value: p.sale.total_value,
                    product: {
                      label: p.product.name,
                      value: p.product.id,
                    },
                    address: {
                      label: p.address?.complete_address || '',
                      value: p.address?.id || null,
                    },
                    contract_number: p.sale.contract_number,
                    homologator: {
                      label:
                        p.sale.homologator?.complete_name ||
                        'Homologador não disponível',
                      value: p.sale.homologator?.id || null,
                    },
                    signature_date: p.sale.signature_date,
                    status: p.sale.status,
                  }))
                }
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2">
                        <strong>Projeto:</strong> {option.project_number}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Valor total:</strong>{' '}
                        {option.total_value
                          ? new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(option.total_value)
                          : 'Sem valor Total'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Produto:</strong> {option.product.label}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Endereço:</strong> {option.address.label}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Status:</strong>{' '}
                        {saleStatusMap[option.status] || 'Desconhecido'}
                      </Typography>
                    </Box>
                  </li>
                )}
                {...(formErrors.project && {
                  error: true,
                  helperText: formErrors.project,
                })}
              />
            </Grid>

            {/* Endereço */}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="address">Endereço</CustomFormLabel>
              <GenericAsyncAutocompleteInput
                label="Endereço"
                endpoint="/api/addresses"
                queryParam="street__icontains"
                extraParams={{
                  customer_id: clientSelected,
                  fields: 'street,number,city,state,id',
                }}
                disabled={!formData.project}
                value={selectedAddress || formData.address}
                onChange={(option) => {
                  handleChange('address', option || null);
                  setSelectedAddress(option);
                }}
                mapResponse={(data) =>
                  data.results.map((item) => ({
                    label: `${item.street}, ${item.number} - ${item.city}, ${item.state}`,
                    value: item.id,
                  }))
                }
                {...(formErrors.address && {
                  error: true,
                  helperText: formErrors.address,
                })}
              />
            </Grid>
          </>
        )}

        {/* Cliente não possui venda */}
        {hasSale === false && (
          <>
            {/* Produto */}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="product">Produto</CustomFormLabel>
              <GenericAsyncAutocompleteInput
                label="Produto"
                endpoint="/api/products"
                queryParam="name__icontains"
                extraParams={{ fields: 'name,id' }}
                value={formData.products}
                onChange={(option) => {
                  handleChange('products', option || null);
                }}
                mapResponse={(data) =>
                  data.results.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))
                }
                {...(formErrors.products && {
                  error: true,
                  helperText: formErrors.products,
                })}
              />
            </Grid>

            {/* Endereço */}
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="address">Endereço</CustomFormLabel>
              <GenericAsyncAutocompleteInput
                label="Endereço"
                endpoint="/api/addresses"
                queryParam="q"
                extraParams={{
                  customer_id: clientSelected,
                  fields: 'street,number,city,state,id',
                }}
                value={formData.address}
                onChange={(option) => {
                  handleChange('address', option || null);
                }}
                mapResponse={(data) =>
                  data.results.map((item) => ({
                    label: `${item.street}, ${item.number} - ${item.city}, ${item.state}`,
                    value: item.id,
                  }))
                }
                {...(formErrors.address && {
                  error: true,
                  helperText: formErrors.address,
                })}
              />
            </Grid>
          </>
        )}

        {/* Observação */}
        <Grid item xs={12}>
          <CustomFormLabel htmlFor="observation">Observação</CustomFormLabel>
          <CustomTextField
            name="observation"
            placeholder="Observação do agendamento"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={formData.observation}
            onChange={(e) => {
              handleChange('observation', e.target.value);
            }}
            {...(formErrors.observation && {
              error: true,
              helperText: formErrors.observation,
            })}
          />
        </Grid>

        {/* Botão Salvar */}
        <Grid item xs={12}>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            mt={2}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={formLoading}
              endIcon={
                formLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              Salvar
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alertType}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
