'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { parseISO, format } from 'date-fns';
import { Grid, Button, Stack, Tooltip, Snackbar, Alert, CircularProgress } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import AutoCompleteServiceCatalog from '@/app/components/apps/inspections/auto-complete/Auto-input-Service';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import AutoCompleteProject from '../../auto-complete/Auto-input-Project';
import HasPermission from '@/app/components/permissions/HasPermissions';
import CreateAddressPage from '../../../address/Add-address';
import addressService from '@/services/addressService';
import GenericAutocomplete from '@/app/components/auto-completes/GenericAutoComplete';
import UseSaleScheduleForm from '@/hooks/inspections/schedule/UseSaleScheduleForm';
import { useSelector } from 'react-redux';
import serviceCatalogService from '@/services/serviceCatalogService';

const ScheduleFormCreate = ({
  serviceId = null,
  projectId = null,
  customerId = null,
  onClosedModal = null,
  products = [],
  onRefresh = null,
}) => {
  const router = useRouter();

  const {
    formData,
    handleChange,
    handleSave,
    loading: formLoading,
    formErrors,
    success,
  } = UseSaleScheduleForm();

  const timeOptions = [
    { value: '08:30:00', label: '08:30' },
    { value: '10:00:00', label: '10:00' },
    { value: '13:00:00', label: '13:00' },
    { value: '14:30:00', label: '14:30' },
    { value: '16:00:00', label: '16:00' },
  ];

  const userPermissions = useSelector((state) => state.user.permissions);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [selectedAddresses, setSelectedAddress] = useState();
  // Estado para armazenar os valores calculados de schedule_end_date e schedule_end_time
  const [calculatedEnd, setCalculatedEnd] = useState({ date: '', time: '' });

  if (projectId) formData.project = projectId;
  if (customerId) formData.customer = customerId;
  if (serviceId) formData.service = serviceId;
  if (products.length > 0) formData.products_ids = products;

  useEffect(() => {
    if (success) {
      if (onClosedModal) {
        onClosedModal();
        onRefresh && onRefresh();
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
      const response = await addressService.index({
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

  // Lógica para calcular schedule_end_date e schedule_end_time com base no deadline do serviço
  useEffect(() => {
    const calculateFinalTime = async () => {
      if (!formData.schedule_date || !formData.schedule_start_time || !formData.service) return;
      try {
        // Obter o id do serviço (considerando que pode vir como objeto ou valor)
        const serviceId = formData.service.value || formData.service.id || formData.service;
        const serviceInfo = await serviceCatalogService.find(serviceId, {
          expand: ['deadline'],
          fields: ['deadline'],
        });
        const deadline = serviceInfo.deadline?.hours;
        if (!deadline) return;

        // Normaliza o horário de início (adiciona ":00" se necessário)
        let startTime = formData.schedule_start_time;
        if (!startTime.includes(':')) {
          startTime += ':00';
        }
        const [startHour, startMinute, startSecond] = startTime.split(':').map(Number);
        const [year, month, day] = formData.schedule_date.split('-').map(Number);
        const startDate = new Date(year, month - 1, day, startHour, startMinute, startSecond || 0);

        // Converte o deadline (formato "HH:mm:ss") para milissegundos
        const [dHour, dMinute, dSecond] = deadline.split(':').map(Number);
        const durationMs = (dHour * 3600 + dMinute * 60 + (dSecond || 0)) * 1000;
        const endDate = new Date(startDate.getTime() + durationMs);

        // Formata o endDate e endTime para os formatos requeridos
        const endDateStr = endDate.toISOString().split('T')[0]; // YYYY-MM-DD
        const endTimeStr = endDate.toTimeString().split(' ')[0]; // HH:mm:ss

        setCalculatedEnd({ date: endDateStr, time: endTimeStr });
        handleChange('schedule_end_date', endDateStr);
        handleChange('schedule_end_time', endTimeStr);
      } catch (error) {
        console.error('Erro ao calcular schedule_end_date e schedule_end_time:', error);
        showAlert('Erro ao calcular data/hora final.', 'error');
      }
    };

    calculateFinalTime();
  }, [formData.schedule_date, formData.schedule_start_time, formData.service]);

  return (
    <>
      <Grid container spacing={3}>
        {/* Serviço */}
        {serviceId ? null : (
          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel htmlFor="service">Serviço</CustomFormLabel>
            <AutoCompleteServiceCatalog
              onChange={(id) => handleChange('service', id)}
              value={formData.service}
              {...(formErrors.service && { error: true, helperText: formErrors.service })}
            />
          </Grid>
        )}
        {/* Projeto – se não for passado via params, o usuário pode selecionar */}
        {projectId ? null : (
          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel htmlFor="project">Projeto</CustomFormLabel>
            <AutoCompleteProject
              onChange={(id) => handleChange('project', id)}
              value={formData.project}
              {...(formErrors.project && { error: true, helperText: formErrors.project })}
            />
          </Grid>
        )}

        {products ? null : (
          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel htmlFor="products">Produto</CustomFormLabel>
            <AutoCompleteProject
              onChange={(id) => handleChange('product', id)}
              value={formData.project}
              {...(formErrors.project && { error: true, helperText: formErrors.project })}
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
            {...(formErrors.schedule_date && { error: true, helperText: formErrors.schedule_date })}
          />
        </Grid>
        {/* Hora do Agendamento */}
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
            label="Hora do Agendamento"
          />
        </Grid>
        {/* Endereço */}
        <Grid item xs={12} sm={12} lg={6}>
          <CustomFormLabel htmlFor="name">
            Endereço
            <Tooltip title="Somente endereços vinculados ao usuário serão exibidos." arrow>
              <HelpIcon fontSize='2px' sx={{ ml: 1, cursor: 'pointer' }} />
            </Tooltip>
          </CustomFormLabel>
          <GenericAutocomplete
            // addTitle="Adicionar Endereço"
            label=""
            size="small"
            fetchOptions={fetchAddress}
            AddComponent={CreateAddressPage}
            getOptionLabel={(option) =>
              `${option.street}, ${option.number} - ${option.city}, ${option.state}`
            }
            onChange={(selected) => {
              setSelectedAddress(selected);
              handleChange('address', selected?.id);
            }}
            value={selectedAddresses}
            {...(formErrors.address && { error: true, helperText: formErrors.address })}
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
              '& .MuiInputBase-input': {
                padding: '12px',
              },
            }}
          />
        </Grid>
        {/* Status do Agendamento */}
        <HasPermission
          permissions={['field_services.change_status_schedule_field']}
          userPermissions={userPermissions}
        >
          <Grid item xs={12} sm={12} lg={6}>
            <FormSelect
              label="Status do Agendamento"
              options={[
                { value: 'Pendente', label: 'Pendente' },
                { value: 'Confirmado', label: 'Confirmado' },
                { value: 'Cancelado', label: 'Cancelado' },
              ]}
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
        {/* Botão de Ação */}
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
        onClosedModal={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClosedModal={handleAlertClose} severity={alertType} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ScheduleFormCreate;
