'use client';
import { Grid, Typography, Stack, CircularProgress, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteServiceCatalog from '@/app/components/apps/inspections/auto-complete/Auto-input-Service';
import useScheduleForm from '@/hooks/inspections/schedule/useScheduleForm';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import AutoCompleteAddress from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Address';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';

import { parseISO, format, isBefore } from 'date-fns';
import HasPermission from '@/app/components/permissions/HasPermissions';
import { useSelector } from 'react-redux';
import AutoCompleteUser from '@/app/components/apps/invoice/components/auto-complete/Auto-Input-User';
import CreateAddressPage from '@/app/components/apps/address/Add-address';
import GenericAutocomplete from '@/app/components/auto-completes/GenericAutoComplete';

function LeadAddSchedulePage({
  leadId = null,
  serviceId = null,
  onRefresh = null,
  onClose = null,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const userPermissions = useSelector((state) => state.user.permissions);

  const {
    formData,
    handleChange,
    handleSave,
    loading: formLoading,
    formErrors,
    success,
  } = useScheduleForm();
  formData.leads_ids = [...new Set([...(formData.leads_ids || []), leadId])];

  const MIN_SCHEDULE_DATE = '2022-01-17T00:00:00';

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

  const validateChange = (field, newValue) => {
    if (field === 'schedule_date') {
      try {
        const selectedDate = parseISO(newValue);
        const minDate = parseISO(MIN_SCHEDULE_DATE);

        if (isBefore(selectedDate, minDate)) {
          enqueueSnackbar('A data selecionada não pode ser anterior a 17/01.', {
            variant: 'error',
          });
          handleChange(field, '');
          return;
        }
      } catch (error) {
        console.error('Erro ao processar a data:', error);
        enqueueSnackbar('Por favor, insira uma data válida.', { variant: 'error' });
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
            enqueueSnackbar('O horário selecionado não pode ser anterior ao horário atual.', {
              variant: 'error',
            });
            handleChange(field, '');
            return;
          }
        }
      } catch (error) {
        console.error('Erro ao processar o horário:', error);
        enqueueSnackbar('Por favor, insira um horário válido.', { variant: 'error' });
        handleChange(field, '');
        return;
      }
    }

    handleChange(field, newValue);
  };

  const handleSaveForm = async () => {
    const response = await handleSave();
    if (response) {
      enqueueSnackbar('Agendamento salvo com sucesso', { variant: 'success' });
      if (onRefresh) onRefresh();
      if (onClose) onClose();
    }
  };

  const fetchAddress = async (search) => {
    try {
      const response = await addressService.index({
        q: search,
        limit: 40,
        fields: 'id,street,number,city,state',
      });
      return response.results;
    } catch (error) {
      console.error('Erro na busca de endereços:', error);
      return [];
    }
  };

  const [selectedAddresses, setSelectedAddresses] = useState([]);

  return (
    <Grid container spacing={1}>
      <Grid item>
        <Typography sx={{ fontSize: "24px", fontWeight: 700, color: "#303030" }}>
          Agende uma visita
        </Typography>
        <Typography sx={{ fontSize: "14px", fontWeight: 400, color: "#98959D" }}>
          Selecione data, horário e selecione o endereço do cliente para criar o agendamento.
        </Typography>
      </Grid>

      {serviceId ? null : (
        <Grid item xs={12}>
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

      <Grid item xs={12}>
        <CustomFormLabel htmlFor="address">Endereço</CustomFormLabel>
        <GenericAutocomplete
          label="Endereço"
          fetchOptions={fetchAddress}
          multiple
          AddComponent={CreateAddressPage}
          getOptionLabel={(option) =>
            `${option.street}, ${option.number} - ${option.city}, ${option.state}`
          }
          onChange={(selected) => {
            setSelectedAddresses(selected);
            console.log(selected);
            const ids = Array.isArray(selected) ? selected.map((item) => item.id) : [];
            handleChange('addresses_ids', ids);
          }}
          value={selectedAddresses}
          {...(formErrors.addresses && {
            error: true,
            helperText: formErrors.addresses,
          })}
        />
      </Grid>

      <Grid item xs={12} sm={12} lg={6}>
        <FormDate
          label="Data"
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
          label={'Hora'}
        />
      </Grid>

      {/* Status do Agendamento */}
      <HasPermission
        permissions={['field_services.change_status_schedule_field']}
        userPermissions={userPermissions}
      >
        <Grid item xs={12}>
          <FormSelect
            label="Status do Agendamento"
            options={statusOptions}
            onChange={(e) => handleChange('status', e.target.value)}
            value={formData.status || ''}
            {...(formErrors.status && { error: true, helperText: formErrors.status })}
          />
        </Grid>
      </HasPermission>
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
            sx={{ backgroundColor: '#FFCC00', color: '#000', p: 1 }}
            fullWidth
            onClick={handleSaveForm}
            disabled={formLoading}
            endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Agendar visita
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default LeadAddSchedulePage;
