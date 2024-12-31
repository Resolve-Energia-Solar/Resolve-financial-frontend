'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* material */
import { Grid, Button, Stack, Tooltip, Snackbar, Alert } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

/* components */
import AutoCompleteAddress from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Address';
import AutoCompleteServiceCatalog from '@/app/components/apps/inspections/auto-complete/Auto-input-Service';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import FormTimePicker from '@/app/components/forms/form-custom/FormTimePicker';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';

/* hooks */
import useSheduleForm from '@/hooks/inspections/schedule/useScheduleForm';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import AutoCompleteProject from '../../auto-complete/Auto-input-Project';

const ScheduleFormCreate = ({
  serviceId = null,
  projectId = null,
  customerId = null,
  onClosedModal = null,
  products = [],
  onRefresh = null,
}) => {
  const router = useRouter();

  const { formData, handleChange, handleSave, formErrors, success } = useSheduleForm();

  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertType, setAlertType] = React.useState('success');

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
    { value: '08:00:00', label: '08:00' },
    { value: '09:30:00', label: '09:30' },
    { value: '11:00:00', label: '11:00' },
    { value: '13:30:00', label: '13:30' },
    { value: '15:00:00', label: '15:00' },
  ];

  console.log('formData', formData);

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

        if (selectedDate.getDate() < today.getDate()) {
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

        if (selectedDate.getDate() === today.getDate()) {
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

        {/* Hora do Agendamento */}
        <Grid item xs={12} sm={12} lg={6}>
          <FormSelect
            options={timeOptions}
            onChange={(e) => validateChange('schedule_start_time', e.target.value)}
            value={formData.schedule_start_time || ''}
            {...(formErrors.schedule_start_time && {
              error: true,
              helperText: formErrors.schedule_start_time,
            })}
            label={'Hora do Agendamento'}
          />
        </Grid>

        {/* Endereço */}
        <Grid item xs={12} sm={12} lg={6}>
          <CustomFormLabel htmlFor="name">Endereço</CustomFormLabel>
          <AutoCompleteAddress
            onChange={(id) => handleChange('address_id', id)}
            value={formData.address_id}
            {...(formErrors.address_id && { error: true, helperText: formErrors.address_id })}
          />
        </Grid>

        {/* Status do Agendamento */}
        <Grid item xs={12} sm={12} lg={6}>
          <FormSelect
            label="Status do Agendamento"
            options={statusOptions}
            onChange={(e) => handleChange('status', e.target.value)}
            value={formData.status || ''}
            {...(formErrors.status && { error: true, helperText: formErrors.status })}
          />
        </Grid>

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
            <Button variant="contained" color="primary" onClick={handleSave}>
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
