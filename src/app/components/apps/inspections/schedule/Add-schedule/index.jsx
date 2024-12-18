'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* material */
import { Grid, Button, Stack, Tooltip } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

/* components */
import AutoCompleteAddress from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Address';
import AutoCompleteServiceCatalog from '@/app/components/apps/inspections/auto-complete/Auto-input-Service';
import AutoCompleteUserSchedule from '@/app/components/apps/inspections/auto-complete/Auto-input-UserSchedule';
import PageContainer from '@/app/components/container/PageContainer';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import FormTimePicker from '@/app/components/forms/form-custom/FormTimePicker';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';

/* hooks */
import useSheduleForm from '@/hooks/inspections/schedule/useScheduleForm';
import AutoCompleteUser from '../../../comercial/sale/components/auto-complete/Auto-Input-User';
import AutoCompleteUserProject from '../../auto-complete/Auto-input-UserProject';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import AutoCompleteProject from '../../auto-complete/Auto-input-Project';

const ScheduleFormCreate = ({
  serviceId = null,
  projectId = null,
  onClosedModal = null,
  products = [],
  onRefresh = null,
}) => {
  const router = useRouter();

  const { formData, handleChange, handleSave, formErrors, success } = useSheduleForm();

  serviceId ? (formData.service_id = serviceId) : null;
  projectId ? (formData.project_id = projectId) : null;
  products.length > 0 ? (formData.products_ids = products) : null;

  const statusOptions = [
    { value: 'Pendente', label: 'Pendente' },
    { value: 'Concluído', label: 'Concluído' },
    { value: 'Cancelado', label: 'Cancelado' },
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
    </>
  );
};

export default ScheduleFormCreate;
