'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { parseISO, format } from 'date-fns';

/* material */
import { Grid, Button, Stack, Tooltip, Snackbar, Alert, CircularProgress } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

/* components */
import AutoCompleteAddress from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Address';
import AutoCompleteServiceCatalog from '@/app/components/apps/inspections/auto-complete/Auto-input-Service';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import FormTimePicker from '@/app/components/forms/form-custom/FormTimePicker';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';

/* hooks */
import useScheduleForm2 from '@/hooks/inspections/schedule/useScheduleForm2';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import AutoCompleteProject from '../../auto-complete/Auto-input-Project';
import { useSelector } from 'react-redux';
import HasPermission from '@/app/components/permissions/HasPermissions';
import CreateAddressPage from '../../../address/Add-address';
import addressService from '@/services/addressService';
import GenericAutocomplete from '@/app/components/auto-completes/GenericAutoComplete';

const ScheduleFormCreate = ({
  serviceId = null,
  projectId = null,
  customerId = null,
  onClosedModal = null,
  products = [],
  onRefresh = null,
}) => {
  const router = useRouter();

  const { formData, handleChange, handleSave, loading: formLoading, formErrors, success } = useScheduleForm2();

  const userPermissions = useSelector((state) => state.user.permissions);

  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertType, setAlertType] = React.useState('success');
  const [selectedAddresses, setSelectedAddress] = React.useState();

  serviceId ? (formData.service_id = serviceId) : null;
  projectId ? (formData.project_id = projectId) : null;
  customerId ? (formData.customer_id = customerId) : null;
  products.length > 0 ? (formData.products_ids = products) : null;

  console.log('customerId', customerId);

  const statusOptions = [
    { value: 'Pendente', label: 'Pendente' },
    { value: 'Confirmado', label: 'Confirmado' },
    { value: 'Cancelado', label: 'Cancelado' },
  ];

  const timeOptions = [
    { value: '08:30:00', label: '08:30' },
    { value: '10:00:00', label: '10:00' },
    { value: '13:00:00', label: '13:00' },
    { value: '14:30:00', label: '14:30' },
    { value: '16:00:00', label: '16:00' },
  ];

  useEffect(() => {
    if (success) {
      if (onClosedModal) {
        onClosedModal();
        onRefresh();
      } else {
        router.push('/apps/inspections/schedule');
      }
    }
  }, [success]);

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const validateChange = (field, newValue) => {
    if (field === 'schedule_date') {
      try {
        const today = new Date();
        const selectedDate = parseISO(newValue);

        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (selectedDate < todayStart) {
          showAlert('A data selecionada não pode ser anterior à data atual.', 'error');
          handleChange(field, '');
          return;
        }
      } catch (error) {
        console.error('Erro ao processar a data:', error);
        showAlert('Por favor, insira uma data válida.', 'error');
        handleChange(field, '');
        return;
      }
    }

    if (field === 'schedule_start_time') {
      try {
        const today = new Date();
        const selectedTime = newValue;
        const selectedDate = parseISO(formData.schedule_date);

        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (selectedDate.getTime() === todayStart.getTime()) {
          const formattedTime = format(today, 'HH:mm:ss');

          if (selectedTime < formattedTime) {
            showAlert('O horário selecionado não pode ser anterior ao horário atual.', 'error');
            handleChange(field, '');
            return;
          }
        }
      } catch (error) {
        console.error('Erro ao processar o horário:', error);
        showAlert('Por favor, insira um horário válido.', 'error');
        handleChange(field, '');
        return;
      }
    }

    handleChange(field, newValue);
  };

  const fetchAddress = async (search) => {
    try {
      const response = await addressService.getAddress({
        q: search,
        customer_id: customerId,
        limit: 40,
        fields: 'id,street,number,city,state',
      });
      return response.results;
    } catch (error) {
      console.error('Erro na busca de endereços:', error);
      return [];
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        {/* Serviço */}
        {serviceId ? null : (
          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel htmlFor="service">Serviço</CustomFormLabel>
            <AutoCompleteServiceCatalog
              onChange={(id) => handleChange('service_id', id)}
              value={formData.service_id}
              {...(formErrors.service_id && {
                error: true,
                helperText: formErrors.service_id,
              })}
            />
          </Grid>
        )}
        {/* Projeto */}
        {projectId ? null : (
          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel htmlFor="project">Projeto</CustomFormLabel>
            <AutoCompleteProject
              onChange={(id) => handleChange('project_id', id)}
              value={formData.project_id}
              {...(formErrors.project_id && {
                error: true,
                helperText: formErrors.project_id,
              })}
            />
          </Grid>
        )}
        {/* Data do Agendamento */}
        <Grid item xs={12} sm={12} lg={6}>
          <FormDate
            label="Data do agendamento"
            name="start_datetime"
            value={formData.schedule_date}
            onChange={(newValue) => validateChange('schedule_date', newValue)}
            {...(formErrors.schedule_date && {
              error: true,
              helperText: formErrors.schedule_date,
            })}
          />
        </Grid>

          <Grid item xs={12} sm={12} lg={6}>
            <FormSelect
              options={timeOptions}
              onChange={(e) => validateChange('schedule_start_time', e.target.value)}
              disabled={!formData.schedule_date}
              value={formData.schedule_start_time || ''}
              {...(formErrors.schedule_start_time && {
                error: true,
                helperText: formErrors.schedule_start_time,
              })}
              label={'Hora do Agendamento'}
            />
          </Grid>

          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel htmlFor="name">
              Endereço
              <Tooltip title="Somente endereços vinculados ao usuário serão exibidos." arrow>
                <HelpIcon sx={{ ml: 1, cursor: 'pointer' }} />
              </Tooltip>
            </CustomFormLabel>
            <GenericAutocomplete
              addTitle="Adicionar Endereço"
              label="Endereço"
              fetchOptions={fetchAddress}
              AddComponent={CreateAddressPage}
              getOptionLabel={(option) =>
                `${option.street}, ${option.number} - ${option.city}, ${option.state}`
              }
              onChange={(selected) => {
                setSelectedAddress(selected?.id);
                console.log('selected', selected);
                handleChange('address_id', selected?.id);
              }}
              value={selectedAddresses}
              {...(formErrors.address_id && {
                error: true,
                helperText: formErrors.address_id,
              })}
            />
          </Grid>

        <HasPermission
          permissions={['field_services.change_status_schedule_field']}
          userPermissions={userPermissions}
        >
          <Grid item xs={12} sm={12} lg={6}>
            <FormSelect
              label="Status do Agendamento"
              options={statusOptions}
              onChange={(e) => handleChange('status', e.target.value)}
              value={formData.status || ''}
              {...(formErrors.status && { error: true, helperText: formErrors.status })}
            />
          </Grid>
        </HasPermission>
        {/* Observação */}
        <Grid item xs={12} sm={12} lg={12}>
          <CustomFormLabel htmlFor="name">Observação</CustomFormLabel>
          <CustomTextField
            name="observation"
            placeholder="Observação do agendamento"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={formData.observation}
            onChange={(e) => handleChange('observation', e.target.value)}
            {...(formErrors.observation && { error: true, helperText: formErrors.observation })}
          />
        </Grid>

        {/* Botão de Ação*/}
        <Grid item xs={12} sm={12} lg={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={formLoading}
              endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              Salvar
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Alerta */}
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

export default ScheduleFormCreate;
