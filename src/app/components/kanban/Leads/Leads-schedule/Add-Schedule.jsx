'use client';
import { Grid, Typography, Stack, CircularProgress, Button, InputAdornment, Box, TextField, Select, MenuItem, useTheme } from '@mui/material';
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

import { IconAlarm } from '@tabler/icons-react';


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
  const theme = useTheme();

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: "flex-start", flexDirection: 'column' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3, alignItems: "center", justifyContent: "center" }}>
          <Grid item xs={12}>
            <Typography sx={{ fontSize: "24px", fontWeight: 700, color: "#303030" }}>
              Agende uma visita
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ fontSize: "14px", fontWeight: 400, color: "#98959D" }}>
              Selecione data, horário e selecione o endereço do cliente para criar o agendamento.
            </Typography>
          </Grid>
        </Grid>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3, alignItems: "center", justifyContent: "center" }}>
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
        </Grid>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3, alignItems: "center", justifyContent: "center" }}>
          <Grid item xs={12} sm={12} lg={6}>
          <Box sx={{ minWidth: 385 }}>
            <CustomFormLabel
              htmlFor="project"
              sx={{ color: '#303030', fontWeight: '700', fontSize: '16px' }}
            >
              Projeto
            </CustomFormLabel>
              <Select
                value={formData.project}
                onChange={(e) => handleChange(e.target.value)}
                fullWidth
                size="medium"
                sx={{ backgroundColor: '#F4F5F7', borderRadius: '8px', }}
                displayEmpty
              >
                <MenuItem value="" sx={{ color: '#7E8388' }} disabled>
                  Selecione um projeto
                </MenuItem>
                {formData.project && formData.project.map((project, index) => (
                  <MenuItem
                    key={index}
                    value={project.id}
                    sx={{ color: '#7E8388' }}
                  >
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Grid>

          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel
              htmlFor="address"
              sx={{ color: '#303030', fontWeight: '700', fontSize: '16px' }}
            >
              Endereço
            </CustomFormLabel>
            <GenericAutocomplete
              fetchOptions={fetchAddress}
              multiple
              size="small"
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
              InputProps={{
                sx: {
                  input: {
                    color: '#7E92A2',
                    fontWeight: '400',
                    fontSize: '12px',
                    opacity: 1,
                  },
                  '& .MuiOutlinedInput-root': {
                    border: '1px solid #3E3C41',  
                    borderRadius: '9px',          
                  },
                  '& .MuiInputBase-input': {
                    padding: '12px',              
                  },
                },
              }}
            />
          </Grid>
          
        </Grid>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3, alignItems: "center", justifyContent: "center" }}>
          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel
              htmlFor="start_datetime"
              sx={{ color: '#303030', fontWeight: '700', fontSize: '16px' }}
            >
              Agente Vistoria
            </CustomFormLabel>
            <FormDate
              name="start_datetime"
              value={formData.schedule_date}
              onChange={(newValue) => validateChange('schedule_date', newValue)}
              {...(formErrors.schedule_date && {
                error: true,
                helperText: formErrors.schedule_date,
              })}
              sx={{
                input: {
                  color: '#7E92A2',
                  fontWeight: '400',
                  fontSize: '12px',
                  opacity: 1,
                },
                '& .MuiOutlinedInput-root': {
                  border: '1px solid #3E3C41', 
                  borderRadius: '9px',  
                },
              }}
            />
          </Grid>
          

          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel
              htmlFor="start_datetime"
              sx={{ color: '#303030', fontWeight: '700', fontSize: '16px' }}
            >
              Supervisor
            </CustomFormLabel>
            <FormSelect
              options={timeOptions}
              onChange={(e) => validateChange('schedule_start_time', e.target.value)}
              value={formData.schedule_start_time || ''}
              {...(formErrors.schedule_start_time && {
                error: true,
                helperText: formErrors.schedule_start_time,
              })}
              InputProps={{
                sx: {
                  '& .MuiOutlinedInput-root': {
                    border: '1px solid #3E3C41 !important',  
                    borderRadius: '9px',
                    '&:hover': {
                      borderColor: '#3E3C41 !important',
                    },
                  },
                  '& .MuiSelect-select': {
                    color: '#7E92A2',  
                    fontWeight: '400',
                    fontSize: '12px',
                    opacity: 1,
                  },
                  
                },
              }}
              startAdornment={
                <InputAdornment position="start">
                  <IconAlarm color={theme.palette.primary.main} position='absolute' left='10px' top='50%' />
                </InputAdornment>
              }
            />
          </Grid>
        </Grid>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3, alignItems: "center", justifyContent: "center" }}>
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel
              htmlFor="start_datetime"
              sx={{ color: '#303030', fontWeight: '700', fontSize: '16px' }}
            >
              Data
            </CustomFormLabel>
            <FormDate
              name="start_datetime"
              value={formData.schedule_date}
              onChange={(newValue) => validateChange('schedule_date', newValue)}
              {...(formErrors.schedule_date && {
                error: true,
                helperText: formErrors.schedule_date,
              })}
              sx={{
                input: {
                  color: '#7E92A2',
                  fontWeight: '400',
                  fontSize: '12px',
                  opacity: 1,
                },
                '& .MuiOutlinedInput-root': {
                  border: '1px solid #3E3C41', 
                  borderRadius: '9px',  
                },
              }}
            />
          </Grid>
          

          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel
              htmlFor="start_datetime"
              sx={{ color: '#303030', fontWeight: '700', fontSize: '16px' }}
            >
              Horário
            </CustomFormLabel>
            <FormSelect
              options={timeOptions}
              onChange={(e) => validateChange('schedule_start_time', e.target.value)}
              value={formData.schedule_start_time || ''}
              {...(formErrors.schedule_start_time && {
                error: true,
                helperText: formErrors.schedule_start_time,
              })}
              InputProps={{
                sx: {
                  '& .MuiOutlinedInput-root': {
                    border: '1px solid #3E3C41 !important',  
                    borderRadius: '9px',
                    '&:hover': {
                      borderColor: '#3E3C41 !important',
                    },
                  },
                  '& .MuiSelect-select': {
                    color: '#7E92A2',  
                    fontWeight: '400',
                    fontSize: '12px',
                    opacity: 1,
                  },
                  
                },
              }}
              startAdornment={
                <InputAdornment position="start">
                  <IconAlarm color={theme.palette.primary.main} position='absolute' left='10px' top='50%' />
                </InputAdornment>
              }
            />
          </Grid>


          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel
              htmlFor="start_datetime"
              sx={{ color: '#303030', fontWeight: '700', fontSize: '16px' }}
            >
              Vendedor
            </CustomFormLabel>
            <FormSelect
              options={timeOptions}
              onChange={(e) => validateChange('schedule_start_time', e.target.value)}
              disabled={!formData.schedule_date}
              value={formData.schedule_start_time || ''}
              {...(formErrors.schedule_start_time && {
                error: true,
                helperText: formErrors.schedule_start_time,
              })}
            />
          </Grid>
        </Grid>

        {/* Status do Agendamento */}
        {/* <HasPermission
          permissions={['field_services.change_status_schedule_field']}
          userPermissions={userPermissions}
        >
          <Grid item xs={12} sm={12} lg={12}>
            <CustomFormLabel
              htmlFor="status"
              sx={{ color: '#303030', fontWeight: '700', fontSize: '16px' }}
            >
              Status
            </CustomFormLabel>
            <FormSelect
              options={statusOptions}
              onChange={(e) => handleChange('status', e.target.value)}
              value={formData.status || ''}
              {...(formErrors.status && { error: true, helperText: formErrors.status })}
            />
          </Grid>
        </HasPermission> */}

        <Grid item xs={12} sm={12} lg={12}>
          <CustomFormLabel
              htmlFor="observation"
              sx={{
                color: '#303030',
                fontWeight: '700',
                fontSize: '16px',
                marginBottom: 0, 
              }}
            >
              Observação
          </CustomFormLabel>
          <CustomTextField
            name="observation"
            placeholder="Observação do agendamento"
            variant="outlined"
            fullWidth
            multiline
            rows={1}
            value={formData.observation}
            onChange={(e) => handleChange('observation', e.target.value)}
            {...(formErrors.observation && { error: true, helperText: formErrors.observation })}
            sx={{
              mt: 1,
              '& .MuiInputBase-root': {
                overflow: 'auto',  
                wordWrap: 'break-word', 
                height: "100%"
              },
              '& .MuiOutlinedInput-root': {
                border: '1px solid #3E3C41', 
                borderRadius: '9px',  
              },
              input: {
                color: '#7E92A2',
                fontWeight: '400',
                fontSize: '12px',
                opacity: 1,
              },
              '& .MuiInputBase-input::placeholder': {
                color: "#B2AFB6",
              }
            }}  
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              sx={{ 
                backgroundColor: theme.palette.primary.main, 
                color: '#000', 
                p: 1,
                height: "56px",
                '&:hover': {
                  color: theme.palette.primary.light, 
                }
              }}
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
    </Grid>
  );
}

export default LeadAddSchedulePage;
