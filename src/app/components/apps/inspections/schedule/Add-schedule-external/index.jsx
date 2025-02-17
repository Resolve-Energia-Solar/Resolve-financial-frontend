'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { parseISO, isBefore, format } from 'date-fns';

import { Grid, Button, Stack, Snackbar, Alert, CircularProgress } from '@mui/material';

import AutoCompleteAddress from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Address';
import AutoCompleteServiceCatalog from '@/app/components/apps/inspections/auto-complete/Auto-input-Service';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';

import useSheduleForm from '@/hooks/inspections/schedule/useScheduleForm';
import AutoCompleteUser from '../../../comercial/sale/components/auto-complete/Auto-Input-User';
import AutoCompleteUserProject from '../../auto-complete/Auto-input-UserProject';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormTimePicker from '@/app/components/forms/form-custom/FormTimePicker';
import AutoCompleteProduct from '../../auto-complete/Auto-input-product';
import { useSelector } from 'react-redux';
import HasPermission from '@/app/components/permissions/HasPermissions';

const ScheduleFormCreateExternal = () => {
  const router = useRouter();

  const userPermissions = useSelector((state) => state.user.permissions);
  const hasPermission = (permissions) => {
    if (!permissions) return true; 
    return permissions.some(permission => userPermissions?.includes(permission));
  };

  const { formData, handleChange, handleSave, loading: formLoading, formErrors, success } = useSheduleForm();
  const SERVICE_INSPECTION_ID = process.env.NEXT_PUBLIC_SERVICE_INSPECTION_ID;
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertType, setAlertType] = React.useState('success');

  const MIN_SCHEDULE_DATE = '';

  const statusOptions = [
    { value: 'Pendente', label: 'Pendente' },
    { value: 'Confirmado', label: 'Confirmado' },
    { value: 'Cancelado', label: 'Cancelado' },
  ];

  const timeOptions = [
    { value: '08:30:00', label: '08:30' },
    { value: '10:00:00', label: '10:00' },
    { value: '11:30:00', label: '11:30' },
    { value: '13:00:00', label: '13:00' },
    { value: '14:30:00', label: '14:30' },
    { value: '16:00:00', label: '16:00' },
    { value: '17:30:00', label: '17:30' },
  ];

  useEffect(() => {
    if (success) {
      router.push('/apps/inspections/schedule');
    }
  }, [success, router]);

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
        const selectedDate = parseISO(newValue);
        const minDate = parseISO(MIN_SCHEDULE_DATE);

        if (isBefore(selectedDate, minDate)) {
          showAlert('A data selecionada não pode ser anterior a 17/01.', 'error');
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

  return (
    <>
      <Grid container spacing={3}>
        <HasPermission 
        permissions={['field_services.can_change_service']}
        userPermissions={userPermissions}
        >
        <Grid item xs={12} sm={12} lg={6}>
          <CustomFormLabel htmlFor="service">Serviço</CustomFormLabel>
          <AutoCompleteServiceCatalog
            onChange={(id) => handleChange('service_id', id)}
            value={formData.service_id}
            {...(formErrors.service_id && {
              error: true,
              helperText: formErrors.service_id,
            })}
            noOptionsText={'Nenhum serviço encontrado'}
          />
        </Grid>
        </HasPermission>

        <Grid item xs={12} sm={12} lg={6}>
          <CustomFormLabel htmlFor="products">Produtos</CustomFormLabel>
          <AutoCompleteProduct
            onChange={(id) => handleChange('products', id)}
            value={formData.products}
            {...(formErrors.products && {
              error: true,
              helperText: formErrors.products,
            })}
            noOptionsText={'Nenhum produto encontrado'}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={6}>
          <CustomFormLabel htmlFor="client">Cliente</CustomFormLabel>
          <AutoCompleteUser
            onChange={(id) => handleChange('customer_id', id)}
            value={formData.customer_id}
            {...(formErrors.customer_id && {
              error: true,
              helperText: formErrors.customer_id,
            })}
          />
        </Grid>

        {formData.customer_id && (
          <Grid item xs={12} sm={12} lg={12}>
            <CustomFormLabel htmlFor="project">Projeto</CustomFormLabel>
            <AutoCompleteUserProject
              onChange={(id) => handleChange('project_id', id)}
              value={formData.project_id}
              selectedClient={formData.customer_id}
              noTextOptions={'O cliente não possui projetos atualmente'}
              {...(formErrors.project_id && {
                error: true,
                helperText: formErrors.project_id,
              })}
            />
          </Grid>
        )}

        <Grid item xs={12} sm={12} lg={6}>
          <FormDate
            label="Data do Agendamento"
            name="start_datetime"
            value={formData.schedule_date}
            onChange={(newValue) => validateChange('schedule_date', newValue)}
            {...(formErrors.schedule_date && {
              error: true,
              helperText: formErrors.schedule_date,
            })}
          />
        </Grid>

        {formData.service_id == SERVICE_INSPECTION_ID ? (
          <Grid item xs={12} sm={12} lg={6}>
            <FormSelect
              options={timeOptions}
              onChange={(e) => {
                const timeValue = e.target.value.includes(':')
                  ? e.target.value
                  : `${e.target.value}:00`;
                validateChange('schedule_start_time', timeValue);
              }}
              disabled={!formData.schedule_date}
              value={formData.schedule_start_time || ''}
              {...(formErrors.schedule_start_time && {
                error: true,
                helperText: formErrors.schedule_start_time,
              })}
              label={'Hora do Agendamento'}
            />
          </Grid>
        ) : (
          <Grid item xs={12} sm={12} lg={6}>
            <FormTimePicker
              label="Hora do Agendamento"
              value={
                formData.schedule_start_time
                  ? new Date(`1970-01-01T${formData.schedule_start_time}`)
                  : null
              }
              onChange={(newValue) => {
                if (newValue instanceof Date) {
                  const formattedTime = `${newValue
                    .getHours()
                    .toString()
                    .padStart(2, '0')}:${newValue
                    .getMinutes()
                    .toString()
                    .padStart(2, '0')}:${newValue.getSeconds().toString().padStart(2, '0')}`;
                  validateChange('schedule_start_time', formattedTime);
                }
              }}
              {...(formErrors.schedule_start_time && {
                error: true,
                helperText: formErrors.schedule_start_time,
              })}
            />
          </Grid>
        )}

        <Grid item xs={12} sm={12} lg={6}>
          <CustomFormLabel htmlFor="name">Endereço</CustomFormLabel>
          <AutoCompleteAddress
            onChange={(id) => handleChange('address_id', id)}
            value={formData.address_id}
            {...(formErrors.address_id && { error: true, helperText: formErrors.address_id })}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={6}>
          <FormSelect
            label="Status do Agendamento"
            options={statusOptions}
            onChange={(e) => handleChange('status', e.target.value)}
            value={formData.status || ''}
            {...(formErrors.status && { error: true, helperText: formErrors.status })}
          />
        </Grid>

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

export default ScheduleFormCreateExternal;
