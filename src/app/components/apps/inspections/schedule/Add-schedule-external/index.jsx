'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* material */
import { Grid, Button, Stack } from '@mui/material';

/* components */
import AutoCompleteAddress from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Address';
import AutoCompleteServiceCatalog from '@/app/components/apps/inspections/auto-complete/Auto-input-Service';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';

/* hooks */
import useSheduleForm from '@/hooks/inspections/schedule/useScheduleForm';
import AutoCompleteUser from '../../../comercial/sale/components/auto-complete/Auto-Input-User';
import AutoCompleteUserProject from '../../auto-complete/Auto-input-UserProject';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';

const ScheduleFormCreateExternal = () => {
  const router = useRouter();

  const { formData, handleChange, handleSave, formErrors, success } = useSheduleForm();

  const statusOptions = [
    { value: 'Pendente', label: 'Pendente' },
    { value: 'Concluído', label: 'Concluído' },
    { value: 'Cancelado', label: 'Cancelado' },
  ];

  const timeOptions = [
    { value: '08:00:00', label: '08:00' },
    { value: '09:30:00', label: '09:30' },
    { value: '11:00:00', label: '11:00' },
    { value: '13:30:00', label: '13:30' },
    { value: '15:00:00', label: '15:00' },
  ];

  useEffect(() => {
    if (success) {
      router.push('/apps/inspections/schedule');
    }
  }, [success, router]);

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
            noOptionsText={'Nenhum serviço encontrado'}
          />
        </Grid>

        {/* Cliente */}
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
          <FormSelect
            options={timeOptions}
            onChange={(e) => handleChange('schedule_start_time', e.target.value)}
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
    </>
  );
};

export default ScheduleFormCreateExternal;
