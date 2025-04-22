'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip,
  Paper,
  Tabs,
  Tab,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Skeleton,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BuildIcon from '@mui/icons-material/Build';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import Comment from '../../comment';
import History from '../../history';
import UserCard from '../../users/userCard';
import ProductService from '@/services/productsService';
import userService from '@/services/userService';
import { useRouter } from 'next/navigation';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';
import { formatDateTime } from '@/utils/inspectionFormatDate';
import scheduleService from '@/services/scheduleService';
import extractId from '@/utils/extractId';
import { formatDate } from '@/utils/dateUtils';
import { useSnackbar } from 'notistack';

const formatAddress = (address) => {
  if (!address) return '-';
  const { street, neighborhood, city, state, country } = address;
  return (
    street +
    (neighborhood ? `, ${neighborhood}` : '') +
    (city ? `, ${city}` : '') +
    (state ? `, ${state}` : '') +
    (country ? ` - ${country}` : '')
  );
};

const getStatusChip = (status) => {
  let color = 'default';
  if (status === 'Pendente') color = 'warning';
  else if (status === 'Confirmado') color = 'success';
  else if (status === 'Cancelado') color = 'error';
  return <Chip label={status} color={color} size="small" />;
};

const CommercialScheduleDetail = ({ schedule }) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [tabValue, setTabValue] = useState(0);
  const [loadingProductName, setLoadingProductName] = useState(true);
  const [productName, setProductName] = useState('');
  const [seller, setSeller] = useState(null);
  
  const [editMode, setEditMode] = useState(false);
  const [editedScheduleDate, setEditedScheduleDate] = useState(schedule.schedule_date || '');
  const [editedScheduleStartTime, setEditedScheduleStartTime] = useState(schedule.schedule_start_time || '');
  const [editedAddress, setEditedAddress] = useState(schedule.address || null);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const scheduleId = schedule?.id;

  useEffect(() => {
    setEditedScheduleDate(schedule.schedule_date || '');
    setEditedScheduleStartTime(schedule.schedule_start_time || '');
    setEditedAddress(extractId(schedule.address));
  }, [schedule]);

  const handleSaveEdit = async () => {
    setLoadingEdit(true);
    const payload = {
      schedule_date: editedScheduleDate,
      schedule_start_time: editedScheduleStartTime,
      address: editedAddress && editedAddress.id ? editedAddress.id : editedAddress,
    };

    try {
      await scheduleService.update(schedule.id, payload);
      setEditMode(false);
      enqueueSnackbar('Agendamento atualizado com sucesso!', { variant: 'success' });
    } catch (error) {
      console.error('Erro ao salvar edição:', error);
      enqueueSnackbar('Erro ao atualizar o agendamento', { variant: 'error' });
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedScheduleDate(schedule.schedule_date || '');
    setEditedScheduleStartTime(schedule.schedule_start_time || '');
    setEditedAddress(extractId(schedule.address));
    setEditMode(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const timeOptions = [
    { value: '08:30:00', label: '08:30' },
    { value: '10:00:00', label: '10:00' },
    { value: '13:00:00', label: '13:00' },
    { value: '14:30:00', label: '14:30' },
    { value: '16:00:00', label: '16:00' },
  ];

  console.log('schedule:', schedule);

  useEffect(() => {
    async function fetchProductName() {
      setLoadingProductName(true);
      try {
        let productData = null;
        
        if (schedule?.project?.product) {
          const productId =
            typeof schedule.project.product === 'object'
              ? schedule.project.product.id
              : schedule.project.product;
          productData = await ProductService.find(productId);
        } 
        else if (Array.isArray(schedule.products) && schedule.products.length > 0) {
          productData = { name: schedule.products.map((prod) => prod.name).join(', ') };
        }
        
        setProductName(productData?.name || 'Sem kit associado');
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
        setProductName('Sem kit associado');
      } finally {
        setLoadingProductName(false);
      }
    }
    fetchProductName();
  }, [schedule]);
  
  

  useEffect(() => {
    if (schedule?.project?.sale?.seller) {
      const fetchSeller = async () => {
        try {
          const sellerData = await userService.find(schedule.project.sale.seller, {
            fields: 'id,employee.user_manager.id',
            expand: 'employee.user_manager',
          });
          setSeller(sellerData);
        } catch (err) {
          console.error('Erro ao buscar vendedor:', err);
        }
      };
      fetchSeller();
    }
  }, [schedule?.project?.sale?.seller]);

  if (!schedule) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">Nenhum agendamento selecionado.</Typography>
      </Box>
    );
  }
  console.log('conditions:', !(schedule.status === 'Pendente' || !schedule.schedule_agent))
  console.log('schedule', schedule);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={3} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Informações do Agendamento" />
          <Tab label="Comentários" />
          <Tab label="Histórico" />
        </Tabs>
        <Divider />
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          {tabValue === 0 && (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Detalhes do Agendamento</Typography>
                {editMode ? (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveEdit}
                      disabled={loadingEdit}
                      endIcon={loadingEdit ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                      Salvar
                    </Button>
                    <Button variant="outlined" color="error" onClick={handleCancelEdit}>
                      Cancelar
                    </Button>
                  </Stack>
                ) : (
                  schedule.status === 'Pendente' && !schedule.schedule_agent && (
                    <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
                      Editar
                    </Button>
                  )
                )}
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <PersonIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="subtitle2" color="textSecondary">
                      <strong>Cliente</strong>
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {schedule.customer?.complete_name || '-'}
                  </Typography>
                </Grid>
                {/* Produto */}
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <Inventory2OutlinedIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="subtitle2" color="textSecondary">
                      <strong>Produto</strong>
                    </Typography>
                  </Box>
                  {loadingProductName ? (
                      <Skeleton variant="text" width={200} height={30} />
                    ) : (
                      <Typography variant="body1">
                        {productName}
                      </Typography>
                    )}
                </Grid>
                {/* Serviço (somente leitura) */}
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <BuildIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="subtitle2" color="textSecondary">
                      <strong>Serviço</strong>
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {schedule.service?.name || '-'}
                  </Typography>
                </Grid>
                {/* Status (somente leitura) */}
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ mr: 1 }}>
                      <strong>Status do Agendamento</strong>
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {getStatusChip(schedule.status)}
                  </Typography>
                </Grid>
                {/* Data do Agendamento (editável se editMode=true) */}
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <CalendarTodayIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="subtitle2" color="textSecondary">
                      <strong>Data do Agendamento</strong>
                    </Typography>
                  </Box>
                  {editMode ? (
                    <FormDate
                      label="Data do agendamento"
                      name="schedule_date"
                      value={editedScheduleDate}
                      onChange={(newValue) => setEditedScheduleDate(newValue)}
                    />
                  ) : (
                    <Typography variant="body1">
                      {formatDate(schedule.schedule_date) || '-'}
                    </Typography>
                  )}
                </Grid>
                {/* Hora de Início (editável se editMode=true) */}
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <AccessTimeIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="subtitle2" color="textSecondary">
                      <strong>Hora de Início</strong>
                    </Typography>
                  </Box>
                  {editMode ? (
                    <FormSelect
                      label="Hora do agendamento"
                      options={timeOptions}
                      onChange={(e) => setEditedScheduleStartTime(e.target.value)}
                      disabled={!editedScheduleDate}
                      value={editedScheduleStartTime || ''}
                    />
                  ) : (
                    <Typography variant="body1">
                      {schedule.schedule_start_time || '-'}
                    </Typography>
                  )}
                </Grid>
                {/* Endereço (editável se editMode=true) */}
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <LocationOnIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="subtitle2" color="textSecondary">
                      <strong>Endereço</strong>
                    </Typography>
                  </Box>
                  {editMode ? (
                    <GenericAsyncAutocompleteInput
                      label="Endereço"
                      endpoint="/api/addresses"
                      queryParam="street__icontains"
                      extraParams={{ customer_id: schedule.customer?.id, fields: 'street,number,city,state,id' }}
                      value={editedAddress?.id}
                      onChange={(option) => setEditedAddress(option)}
                      mapResponse={(data) =>
                        data.results.map((item) => ({
                          label: `${item.street}, ${item.number} - ${item.city}, ${item.state}`,
                          value: item.id,
                        }))
                      }
                    />
                  ) : (
                    <Typography variant="body1">
                      {formatAddress(schedule.address)}
                    </Typography>
                  )}
                </Grid>
                {/* Criado Em (somente leitura) */}
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <ScheduleIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="subtitle2" color="textSecondary">
                      <strong>Criado Em</strong>
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {formatDateTime(schedule.created_at) || '-'}
                  </Typography>
                </Grid>
                {/* Outras informações (ex.: Pessoas) */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Pessoas
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Card variant="outlined">
                      <CardHeader
                        avatar={<SupervisorAccountIcon color="primary" />}
                        title="Agente"
                      />
                      <Divider />
                      <CardContent>
                        {schedule.schedule_agent ? (
                          <UserCard
                            userId={schedule.schedule_agent?.id}
                            showEmail={false}
                            showPhone
                          />
                        ) : (
                          <Typography variant="body2">Agente não identificado</Typography>
                        )}
                      </CardContent>
                    </Card>
                    <Card variant="outlined">
                      <CardHeader
                        avatar={<PersonIcon color="primary" />}
                        title="Supervisor"
                      />
                      <Divider />
                      <CardContent>
                        {seller?.employee?.user_manager ? (
                          <UserCard
                            userId={seller.employee.user_manager.id}
                            showEmail={false}
                            showPhone
                          />
                        ) : (
                          <Typography variant="body2">
                            Supervisor não identificado
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                    <Card variant="outlined">
                      <CardHeader
                        avatar={<PersonIcon color="primary" />}
                        title="Vendedor"
                      />
                      <Divider />
                      <CardContent>
                        {seller ? (
                          <UserCard userId={seller.id} showEmail={false} showPhone />
                        ) : (
                          <Typography variant="body2">
                            Vendedor não identificado
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              </Grid>
            </>
          )}
          {tabValue === 1 && (
            <Comment appLabel={'field_services'} model={'schedule'} objectId={scheduleId} />
          )}
          {tabValue === 2 && (
            <History appLabel={'field_services'} model={'schedule'} objectId={scheduleId}/>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default CommercialScheduleDetail;
