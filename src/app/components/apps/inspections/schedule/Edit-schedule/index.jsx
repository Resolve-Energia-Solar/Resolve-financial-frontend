'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';

/* material */
import { Grid, Button, Stack, Alert, Icon, Tooltip } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

/* components */
import AutoCompleteAddress from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Address';
import AutoCompleteProject from '@/app/components/apps/inspections/auto-complete/Auto-input-Project';
import AutoCompleteServiceCatalog from '@/app/components/apps/inspections/auto-complete/Auto-input-Service';
import AutoCompleteUserSchedule from '@/app/components/apps/inspections/auto-complete/Auto-input-UserSchedule';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import FormTimePicker from '@/app/components/forms/form-custom/FormTimePicker';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';

/* hooks */
import useSchedule from '@/hooks/inspections/schedule/useSchedule';
import useScheduleForm from '@/hooks/inspections/schedule/useScheduleForm';

const ScheduleFormEdit = ({ scheduleId = null, onClosedModal = null, onRefresh = null }) => {
  const params = useParams();
  let id = scheduleId;
  if (!scheduleId) id = params.id;

  const { loading, error, scheduleData } = useSchedule(id);

  const { formData, handleChange, handleSave, formErrors, success } = useScheduleForm(
    scheduleData,
    id,
  );

  const statusOptions = [
    { value: 'Pendente', label: 'Pendente' },
    { value: 'Concluído', label: 'Concluído' },
    { value: 'Cancelado', label: 'Cancelado' },
  ];

  useEffect(() => {
    if (success) {
      if (onClosedModal) {
        onClosedModal();
        onRefresh();
      }
    }
  }, [success]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Grid container spacing={3}>
        {/* Serviço */}
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

        {/* Projeto */}
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
        <Grid item xs={12} sm={12} lg={6}>
          <FormTimePicker
            label="Hora do agendamento"
            name="schedule_start_time"
            value={formData.schedule_start_time}
            onChange={(newValue) => handleChange('schedule_start_time', newValue)}
            {...(formErrors.schedule_start_time && {
              error: true,
              helperText: formErrors.schedule_start_time,
            })}
          />
        </Grid>

        {/* Endereço */}
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="name">Endereço</CustomFormLabel>
          <AutoCompleteAddress
            onChange={(id) => handleChange('address_id', id)}
            value={formData.address_id}
            {...(formErrors.address_id && { error: true, helperText: formErrors.address_id })}
          />
        </Grid>

        {/* Agente de Campo */}
        <Grid item xs={12} sm={12} lg={4}>
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

        {/* Status do Agendamento */}
        <Grid item xs={12} sm={12} lg={4}>
          <FormSelect
            label="Status do Agendamento"
            options={statusOptions}
            onChange={(e) => handleChange('status', e.target.value)}
            value={formData.status || ''}
            {...(formErrors.status && { error: true, helperText: formErrors.status })}
          />
        </Grid>

        {/* Botão de Ação */}
        <Grid item xs={12} sm={12} lg={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Salvar Alterações
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default ScheduleFormEdit;
