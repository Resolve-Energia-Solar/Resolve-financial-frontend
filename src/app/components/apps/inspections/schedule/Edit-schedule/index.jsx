'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { parseISO, format } from 'date-fns';

/* material */
import { Grid, Button, Stack, Alert, Tooltip, Snackbar, Chip } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

/* components */
import AutoCompleteAddress from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Address';
import AutoCompleteServiceCatalog from '@/app/components/apps/inspections/auto-complete/Auto-input-Service';
import AutoCompleteUserSchedule from '@/app/components/apps/inspections/auto-complete/Auto-input-UserSchedule';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';

/* hooks */
import useSchedule from '@/hooks/inspections/schedule/useSchedule';
import useScheduleForm from '@/hooks/inspections/schedule/useScheduleForm';
import AutoCompleteUser from '../../../comercial/sale/components/auto-complete/Auto-Input-User';
import AutoCompleteUserProject from '../../auto-complete/Auto-input-UserProject';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormTimePicker from '@/app/components/forms/form-custom/FormTimePicker';
import serviceOpinionsService from '@/services/serviceOpinionsService';
import HasPermission from '@/app/components/permissions/HasPermissions';
import { useSelector } from 'react-redux';
import AutoCompleteProduct from '../../auto-complete/Auto-input-product';
import AutoInputStatusSchedule from '../../auto-complete/Auto-Input-StatusInspection';

const ScheduleFormEdit = ({ scheduleId = null, onClosedModal = null, onRefresh = null }) => {
  const router = useRouter();
  const params = useParams();
  let id = scheduleId;
  if (!scheduleId) id = params.id;
  const SERVICE_INSPECTION_ID = process.env.NEXT_PUBLIC_SERVICE_INSPECTION_ID;
  const { loading, error, scheduleData } = useSchedule(id);

  const userPermissions = useSelector((state) => state.user.permissions);

  const { formData, handleChange, handleSave, formErrors, success } = useScheduleForm(
    scheduleData,
    id,
  );

  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertType, setAlertType] = React.useState('success');

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

  const [serviceOpinions, setServiceOpinions] = useState([]);
  const [loadingServiceOpinions, setLoadingServiceOpinions] = useState(false);

  const formattedServiceOpinions = (opinions) => {
    const formattedOpinions = [];

    opinions.forEach((opinion) => {
      formattedOpinions.push({
        value: opinion.id,
        label: opinion.name,
      });
    });

    return formattedOpinions;
  };

  useEffect(() => {
    if (success) {
      showAlert('Ordem de serviço editada com sucesso', 'success');
      router.push('/apps/inspections/schedule');
    }
  }, [success, router]);

  useEffect(() => {
    const fetchServiceOpinions = async () => {
      try {
        setLoadingServiceOpinions(true);
        const response = await serviceOpinionsService.getServiceOpinionsByService(
          formData.service_id,
        );

        setServiceOpinions(formattedServiceOpinions(response.results));
      } catch (error) {
        console.error('Error fetching service opinions:', error);
      } finally {
        setLoadingServiceOpinions(false);
      }
    };

    if (formData.service_id !== null) {
      fetchServiceOpinions();
    }
  }, [formData]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

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

        // Define a data atual sem horas, minutos e segundos
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
        {/* Serviço */}
        {!onClosedModal && (
          <>
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

            {formData.products && (
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
            )}

            {/* Projeto */}
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
          </>
        )}

        {/* Data do Agendamento */}
        <Grid item xs={12} sm={12} lg={6}>
          <FormDate
            label="Data do Agendamento"
            name="start_datetime"
            value={formData.schedule_date}
            onChange={(newValue) => handleChange('schedule_date', newValue)}
            {...(formErrors.schedule_date && {
              error: true,
              helperText: formErrors.schedule_date,
            })}
          />
        </Grid>

        {/* Hora do Agendamento */}
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

        {/* Agente de Campo */}
        <Grid item xs={12} sm={12} lg={12}>
          <CustomFormLabel htmlFor="field_agent">
            Agentes Disponíveis{' '}
            <Tooltip
              title="Os agentes de campo são alocados com base na disponibilidade de horário e proximidade geográfica. Ajuste os parâmetros para visualizar opções disponíveis."
              placement="right-end"
            >
              <HelpIcon fontSize="small" />
            </Tooltip>
          </CustomFormLabel>
          <AutoCompleteUserSchedule
            onChange={(id) => handleChange('schedule_agent_id', id)}
            value={formData.schedule_agent_id}
            disabled={formData.category_id === null}
            query={{
              category: formData.category_id,
              scheduleDate: formData.schedule_date,
              scheduleStartTime: formData.schedule_start_time,
              scheduleEndTime: formData.schedule_end_time,
              scheduleLatitude: formData.latitude,
              scheduleLongitude: formData.longitude,
            }}
            {...(formErrors.schedule_agent_id && {
              error: true,
              helperText: formErrors.schedule_agent_id,
            })}
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

        {/* Parecer de Serviço */}
        <Grid item xs={12} sm={6} lg={6}>
          <CustomFormLabel htmlFor="service_opinion_id">Parecer de serviço</CustomFormLabel>
          <Chip
            label={
              formData.service_opinion
                ? formData.service_opinion.name
                : 'Sem Parecer de serviço no momento'
            }
            color="primary"
          />
        </Grid>

        {/* Parecer final de Serviço */}
        <HasPermission
          permissions={['field_services.change_final_service_opinion']}
          userPermissions={userPermissions}
        >
          <Grid item xs={12} sm={6} lg={6}>
            <CustomFormLabel htmlFor="final_service_opinion_id">
              Parecer final de serviço
            </CustomFormLabel>
            <AutoInputStatusSchedule
              onChange={(id) => handleChange('final_service_opinion_id', id)}
              value={formData.final_service_opinion_id}
              {...(formErrors.final_service_opinion_id && {
                error: true,
                helperText: formErrors.final_service_opinion_id,
              })}
              isFinalOpinion={true}
              serviceId={formData.service_id}
              // disabled={loadingServiceOpinions || formData.service_id === null}
            />
          </Grid>
        </HasPermission>

        {/* Botão de Ação */}
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

export default ScheduleFormEdit;
