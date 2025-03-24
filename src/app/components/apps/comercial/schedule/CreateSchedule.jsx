'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Button, Stack, Tooltip, Snackbar, Alert, CircularProgress, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import useSheduleForm from '@/hooks/inspections/schedule/useScheduleForm';
import { useSelector } from 'react-redux';
import HasPermission from '@/app/components/permissions/HasPermissions';

// Função auxiliar para extrair o id (usada no payload)
const extractId = (value) => {
  return (typeof value === 'object' && value !== null && 'value' in value)
    ? value.value
    : value;
};

const timeOptions = [
  { value: '08:30:00', label: '08:30' },
  { value: '10:00:00', label: '10:00' },
  { value: '13:00:00', label: '13:00' },
  { value: '14:30:00', label: '14:30' },
  { value: '16:00:00', label: '16:00' },
];

const statusOptions = [
  { value: 'Pendente', label: 'Pendente' },
  { value: 'Confirmado', label: 'Confirmado' },
  { value: 'Cancelado', label: 'Cancelado' },
];

// OptionSelector para escolha entre Projeto ou Produto
const OptionSelector = ({ selectedOption, handleOptionChange }) => {
  console.log("OptionSelector - selectedOption:", selectedOption);
  return (
    <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
      <FormLabel component="legend">Selecione Projeto ou Produto</FormLabel>
      <RadioGroup row name="option" value={selectedOption} onChange={handleOptionChange}>
        <FormControlLabel value="project" control={<Radio />} label="Projeto" />
        <FormControlLabel value="product" control={<Radio />} label="Produto" />
      </RadioGroup>
    </FormControl>
  );
};

const CreateSchedule = ({ serviceId = null, projectId = null, customerId = null, onClosedModal = null, products = [], onRefresh = null }) => {
  const router = useRouter();
  const { formData, handleChange, handleSave, loading: formLoading, formErrors, success } = useSheduleForm();
  const userPermissions = useSelector((state) => state.user.permissions);
  console.log("CreateSchedule - formData:", formData);

  // Estados para OptionSelector e alertas
  const [selectedOption, setSelectedOption] = useState('');
  const [clientSelected, setClientSelected] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  // Se props estiverem definidas, atualiza os campos com IDs
  if (serviceId) handleChange('service', serviceId);
  if (projectId) handleChange('project', projectId);
  if (customerId) handleChange('customer', customerId);
  if (products.length > 0) handleChange('products_ids', products);

  useEffect(() => {
    if (success) {
      console.log("Agendamento salvo com sucesso. Redirecionando/fechando modal...");
      if (onClosedModal) {
        onClosedModal();
        onRefresh && onRefresh();
      } else {
        router.push('/apps/inspections/schedule');
      }
    }
  }, [success, onClosedModal, onRefresh, router]);

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const validateChange = (field, newValue) => {
    console.log(`validateChange: ${field} mudou para:`, newValue);
    handleChange(field, newValue);
  };

  const handleOptionChange = (event) => {
    console.log("Opção selecionada:", event.target.value);
    setSelectedOption(event.target.value);
    if (event.target.value === 'project') {
      handleChange('product', null);
    } else if (event.target.value === 'product') {
      handleChange('project', null);
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        {/* Cliente */}
        {!customerId && (
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="customer">Cliente</CustomFormLabel>
            <GenericAsyncAutocompleteInput
              label="Cliente"
              endpoint="/api/users"
              queryParam="complete_name__icontains"
              extraParams={{ fields: 'complete_name,id' }}
              value={formData.customer}
              onChange={(option) => {
                console.log("Cliente selecionado:", option);
                setClientSelected(option ? option.value : '');
                // Mantém a chamada com o objeto completo
                handleChange('customer', option || null);
              }}
              mapResponse={(data) =>
                data.results.map(item => ({ label: item.complete_name, value: item.id }))
              }
              {...(formErrors.customer && { error: true, helperText: formErrors.customer })}
            />
          </Grid>
        )}
        {/* Serviço */}
        {!serviceId && (
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="service">Serviço</CustomFormLabel>
            <GenericAsyncAutocompleteInput
              label="Serviço"
              endpoint="/api/services"
              queryParam="name__icontains"
              extraParams={{ fields: 'name,id' }}
              value={formData.service}
              onChange={(option) => {
                console.log("Serviço selecionado:", option);
                handleChange('service', option || null);
              }}
              mapResponse={(data) =>
                data.results.map(item => ({ label: item.name, value: item.id }))
              }
              {...(formErrors.service && { error: true, helperText: formErrors.service })}
            />
          </Grid>
        )}
        {formData.customer && formData.service ? (
          <>
            <Grid item xs={12}>
              <OptionSelector selectedOption={selectedOption} handleOptionChange={handleOptionChange} />
            </Grid>
            {selectedOption === 'project' && (
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="project">Projeto</CustomFormLabel>
                <GenericAsyncAutocompleteInput
                  label="Projeto"
                  endpoint="/api/projects"
                  extraParams={{
                    customer_id: formData.customer,
                    fields: 'project_number,sale.customer.complete_name,id',
                    expand: 'sale.customer'
                  }}
                  value={formData.project}
                  onChange={(option) => {
                    console.log("Projeto selecionado:", option);
                    handleChange('project', option || null);
                  }}
                  mapResponse={(data) =>
                    data.results.map(item => ({
                      label: item.project_number || item.sale.customer.complete_name,
                      value: item.id,
                    }))
                  }
                  {...(formErrors.project && { error: true, helperText: formErrors.project })}
                />
              </Grid>
            )}
            {selectedOption === 'product' && (
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="product">Produto</CustomFormLabel>
                <GenericAsyncAutocompleteInput
                  label="Produto"
                  endpoint="/api/products"
                  queryParam="name__icontains"
                  extraParams={{ fields: 'name,id' }}
                  value={formData.product}
                  onChange={(option) => {
                    console.log("Produto selecionado:", option);
                    handleChange('product', option || null);
                  }}
                  mapResponse={(data) =>
                    data.results.map(item => ({ label: item.name, value: item.id }))
                  }
                  {...(formErrors.product && { error: true, helperText: formErrors.product })}
                />
              </Grid>
            )}
          </>
        ) : (
          <Grid item xs={12}>
            <Alert severity="info">Por favor, selecione Cliente e Serviço para continuar.</Alert>
          </Grid>
        )}
        {/* Data do Agendamento */}
        <Grid item xs={12} sm={6}>
          <FormDate
            label="Data do agendamento"
            name="schedule_date"
            value={formData.schedule_date}
            onChange={(newValue) => {
              console.log("Data do agendamento alterada para:", newValue);
              validateChange('schedule_date', newValue);
            }}
            {...(formErrors.schedule_date && { error: true, helperText: formErrors.schedule_date })}
          />
        </Grid>
        {/* Hora do Agendamento */}
        <Grid item xs={12} sm={6}>
          <FormSelect
            label="Hora do agendamento"
            options={timeOptions}
            onChange={(e) => {
              console.log("Hora do agendamento alterada para:", e.target.value);
              validateChange('schedule_start_time', e.target.value);
            }}
            disabled={!formData.schedule_date}
            value={formData.schedule_start_time || ''}
            {...(formErrors.schedule_start_time && { error: true, helperText: formErrors.schedule_start_time })}
          />
        </Grid>
        {/* Endereço */}
        <Grid item xs={12} sm={6}>
          <CustomFormLabel htmlFor="address">
            Endereço
            <Tooltip title="Somente endereços vinculados ao usuário serão exibidos." arrow>
              <HelpIcon sx={{ ml: 1, cursor: 'pointer' }} />
            </Tooltip>
          </CustomFormLabel>
          <GenericAsyncAutocompleteInput
            label="Endereço"
            endpoint="/api/addresses"
            extraParams={{ customer_id: clientSelected, fields: 'street,number,city,state,id' }}
            value={selectedAddress}
            onChange={(option) => {
              console.log("Endereço selecionado:", option);
              setSelectedAddress(option);
              handleChange('address', option ? option : null);
            }}
            mapResponse={(data) =>
              data.results.map(item => ({
                label: `${item.street}, ${item.number} - ${item.city}, ${item.state}`,
                value: item.id,
              }))
            }
            {...(formErrors.address && { error: true, helperText: formErrors.address })}
          />
        </Grid>
        {/* Status */}
        <HasPermission permissions={['field_services.change_status_schedule_field']} userPermissions={userPermissions}>
          <Grid item xs={12} sm={6}>
            <FormSelect
              label="Status do agendamento"
              options={statusOptions}
              onChange={(e) => {
                console.log("Status alterado para:", e.target.value);
                handleChange('status', e.target.value);
              }}
              value={formData.status || ''}
              {...(formErrors.status && { error: true, helperText: formErrors.status })}
            />
          </Grid>
        </HasPermission>
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
              console.log("Observação alterada:", e.target.value);
              handleChange('observation', e.target.value);
            }}
            {...(formErrors.observation && { error: true, helperText: formErrors.observation })}
          />
        </Grid>
        {/* Botão Salvar */}
        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                console.log("Enviando payload:", formData);
                handleSave();
              }}
              disabled={formLoading}
              endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
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
        <Alert onClose={handleAlertClose} severity={alertType} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateSchedule;
