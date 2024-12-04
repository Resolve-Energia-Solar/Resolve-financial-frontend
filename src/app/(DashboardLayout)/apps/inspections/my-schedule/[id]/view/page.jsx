'use client';
import React, { use, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';

/* hooks */
import ParentCard from '@/app/components/shared/ParentCard';
import { formatDate, formatDateTime } from '@/utils/inspectionFormatDate';
import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';
import FormDateTime from '@/app/components/forms/form-custom/FormDateTime';
import FormTimePicker from '@/app/components/forms/form-custom/FormTimePicker';
import useSchedule from '@/hooks/inspections/schedule/useSchedule';
import useScheduleForm from '@/hooks/inspections/schedule/useScheduleForm';
import scheduleService from '@/services/scheduleService';

const ScheduleView = () => {
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scheduleData, setScheduleData] = useState(null);
  const [openConfirmArrival, setOpenConfirmArrival] = useState(false);
  const [openStartService, setOpenStartService] = useState(false);
  const [openFinishService, setOpenFinishService] = useState(false);

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success
  } = useScheduleForm(scheduleData, id);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await scheduleService.getScheduleById(id);
        setScheduleData(data);
      } catch (err) {
        setError(`Erro ao carregar agendamento`);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id]);

  const confirmArrival = (event) => {
    handleChange('going_to_location_at', new Date().toISOString());
    setOpenConfirmArrival(true);
  };

  const startService = (event) => {
    handleChange('execution_started_at', new Date().toISOString());
    setOpenStartService(true);
  };

  const finishService = (event) => {
    handleChange('execution_finished_at', new Date().toISOString());
    handleChange('status', 'Concluído');
    setOpenFinishService(true);
  };

  const handleCloseConfirmArrival = () => {
    setOpenConfirmArrival(false);
  };

  const handleCloseStartService = () => {
    setOpenStartService(false);
  };

  const handleCloseFinishService = () => {
    setOpenFinishService(false);
  };

  const handleConfirmArrival = () => {
    setScheduleData((prev) => ({ ...prev, going_to_location_at: formData.going_to_location_at }));
    handleSave();
    setOpenConfirmArrival(false);
  };

  const handleConfirmStartService = () => {
    setScheduleData((prev) => ({ ...prev, execution_started_at: formData.execution_started_at }));
    handleSave();
    setOpenStartService(false);
  };

  const handleConfirmFinishService = () => {
    setScheduleData((prev) => ({ ...prev, execution_finished_at: formData.execution_finished_at }));
    handleSave();
    setOpenFinishService(false);
  };

  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      to: '/apps/inspections/my-schedule',
      title: 'Meus Agendamentos',
    },
    {
      title: 'Visualizar Agendamento',
    },
  ];

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PageContainer
      title="Visualização de Agendamento"
      description="Página de visualização de agendamento"
    >
      <Breadcrumb title="Agendamento" items={BCrumb} />
      <ParentCard
        title="Visualização de Agendamento"
        footer={
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={confirmArrival}
              disabled={scheduleData.going_to_location_at}
            >
              Estou a caminho
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={startService}
              disabled={scheduleData.execution_started_at || !scheduleData.going_to_location_at}
            >
              Iniciando Serviço
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={finishService}
              disabled={scheduleData.execution_finished_at || !scheduleData.execution_started_at}
            >
              Serviço Concluído
            </Button>
          </Box>
          
        }
      >
        <Box sx={{ padding: 3 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box
              sx={{
                textAlign: {
                  xs: 'center',
                  sm: 'left',
                },
              }}
            >
              <Typography variant="h5"># {id}</Typography>
              <Box mt={1}>
                <Chip
                  size="small"
                  color="secondary"
                  variant="outlined"
                  label={formatDate(scheduleData.schedule_date)}
                ></Chip>
              </Box>
            </Box>
            <Logo />
            <Box textAlign="right">
              {scheduleData.status === 'Pendente' ? (
                <Chip size="small" color="primary" label={scheduleData.status} />
              ) : scheduleData.status === 'Concluído' ? (
                <Chip size="small" color="success" label={scheduleData.status} />
              ) : scheduleData.status === 'Cancelado' ? (
                <Chip size="small" color="warning" label={scheduleData.status} />
              ) : (
                ''
              )}
            </Box>
          </Stack>
          <Divider></Divider>
          <Grid container spacing={3} mt={2} mb={4}>
            <Grid item xs={12} sm={12}>
              <Paper variant="outlined">
                <Box p={3} display="flex" flexDirection="column" gap="4px">
                  <Typography variant="h3" gutterBottom>
                    Data: {formatDate(scheduleData.schedule_date)} -{' '}
                    {scheduleData.schedule_start_time}
                  </Typography>
                  <Typography variant="body1">
                    Serviço: {scheduleData.service.name || 'Serviço não disponível'}
                  </Typography>
                  <Typography variant="body1">
                    Categoria: {scheduleData.service.category.name || 'Categoria não disponível'}
                  </Typography>
                  <Typography variant="body1">
                    Prazo: {scheduleData.service.deadline.name || 'Prazo não disponível'}
                  </Typography>
                  <Typography variant="body1">
                    Local: {scheduleData.address.street || 'Endereço não disponível'},{' '}
                    {scheduleData.address.number || 'Número não disponível'},{' '}
                    {scheduleData.address.neighborhood || 'Bairro não disponível'},{' '}
                    {scheduleData.address.city || 'Cidade não disponível'} -{' '}
                    {scheduleData.address.state || 'Estado não disponível'},{' '}
                    {scheduleData.address.zip_code || 'CEP não disponível'},{' '}
                    {scheduleData.address.complement ? scheduleData.address.complement : ''}
                    {scheduleData.address.country || 'País não disponível'}
                  </Typography>
                </Box>
                <Divider></Divider>
                {scheduleData.going_to_location_at && (
                  <Box p={3} display="flex" flexDirection="column" gap="4px">
                    <Typography variant="body1">
                      Deslocamento iniciado em: {formatDateTime(scheduleData.going_to_location_at)}
                    </Typography>
                  </Box>
                )}
                {scheduleData.execution_started_at && (
                  <Box p={3} display="flex" flexDirection="column" gap="4px">
                    <Typography variant="body1">
                      Serviço iniciado em: {formatDateTime(scheduleData.execution_started_at)}
                    </Typography>
                  </Box>
                )}
                {scheduleData.execution_finished_at && (
                  <Box p={3} display="flex" flexDirection="column" gap="4px">
                    <Typography variant="body1">
                      Serviço finalizado em: {formatDateTime(scheduleData.execution_finished_at)}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </ParentCard>
      {/* Modal de confirmação de exclusão */}
      <Dialog
        open={openConfirmArrival}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={handleCloseConfirmArrival}
      >
        <DialogTitle id="alert-dialog-title">Confirmar Deslocamento</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja confirmar que está a caminho do local?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseConfirmArrival}>
            Cancelar
          </Button>
          <Button color="primary" onClick={handleConfirmArrival}>
            Sim
          </Button>
        </DialogActions>
      </Dialog>
      {/* Modal de confirmação de início de serviço */}
      <Dialog
        open={openStartService}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={handleCloseStartService}
      >
        <DialogTitle id="alert-dialog-title">Confirmar Início de Serviço</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja confirmar que iniciou o serviço?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseStartService}>
            Cancelar
          </Button>
          <Button color="primary" onClick={handleConfirmStartService}>
            Sim
          </Button>
        </DialogActions>
      </Dialog>
      {/* Modal de confirmação de finalização de serviço */}
      <Dialog
        open={openFinishService}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={handleCloseFinishService}
      >
        <DialogTitle id="alert-dialog-title">Confirmar Finalização de Serviço</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja confirmar que finalizou o serviço?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseFinishService}>
            Cancelar
          </Button>
          <Button color="primary" onClick={handleConfirmFinishService}>
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ScheduleView;
