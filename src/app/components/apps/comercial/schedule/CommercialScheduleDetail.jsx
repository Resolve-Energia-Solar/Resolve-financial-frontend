'use client';
import { useEffect } from 'react';
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
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BuildIcon from '@mui/icons-material/Build';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Comment from '../../comment';
import { formatDateTime } from '@/utils/inspectionFormatDate';
import React, { useState, useCallback } from 'react';
import History from '../../history';
import ProductService from '@/services/productsService';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { Skeleton } from '@mui/material';
import UserCard from '../../users/userCard';
import userService from '@/services/userService';

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
  const [tabValue, setTabValue] = useState(0);
  const [loadingProductName, setloadingProductName] = useState(true);
  const [productName, setProductName] = useState('');
  const [seller, setSeller] = useState(null);
  const [loadingSeller, setLoadingSeller] = useState(true);

  const scheduleId = schedule?.id;

  const formatDate = useCallback((dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }, []);

  console.log('schedule', schedule);

  useEffect(() => {
    async function fetchProductName() {
      setloadingProductName(true);
      if (schedule?.project?.product) {
        try {
          const productId =
            typeof schedule.project.product === 'object'
              ? schedule.project.product.id
              : schedule.project.product;
          const productData = await ProductService.getProductById(productId);
          setProductName(productData.name);
        } catch (error) {
          console.error('Erro ao buscar produto:', error);
        } finally {
          setloadingProductName(false);
        }
      }
    }
    fetchProductName();
  }, [schedule?.project?.product]);


  useEffect(() => {
    if (schedule?.project?.sale?.seller) {
      setLoadingSeller(true);
      const fetchSeller = async () => {
        try {
          const sellerData = await userService.find(schedule.project.sale.seller, {
            fields: 'id,employee.user_manager.id',
            expand: 'employee.user_manager',
          });
          console.log('Vendedor:', sellerData);
          setSeller(sellerData);
        } catch (err) {
          console.error('Erro ao buscar vendedor:', err);
        } finally {
          setLoadingSeller(false);
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" mb={0.5}>
                  <PersonIcon sx={{ mr: 1 }} color="primary" />
                  <Typography variant="subtitle2" color="textSecondary">
                    <strong>Cliente</strong>
                  </Typography>
                </Box>
                <Typography variant="body1">{schedule.customer?.complete_name || '-'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" mb={0.5}>
                  <Inventory2OutlinedIcon sx={{ mr: 1 }} color="primary" />
                  <Typography variant="subtitle2" color="textSecondary">
                    <strong>Kit</strong>
                  </Typography>
                </Box>
                {loadingProductName ? (
                  <Skeleton variant="text" width={200} height={30} />
                ) : (
                  <Typography variant="body1">
                    {Array.isArray(schedule.products) && schedule.products.length > 0
                      ? schedule.products.map((prod) => prod.name).join(', ')
                      : productName || 'Sem kit associado'}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" alignItems="center" mb={0.5}>
                  <BuildIcon sx={{ mr: 1 }} color="primary" />
                  <Typography variant="subtitle2" color="textSecondary">
                    <strong>Serviço</strong>
                  </Typography>
                </Box>
                <Typography variant="body1">{schedule.service?.name || '-'}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Box display="flex" alignItems="center" mb={0.5}>
                  <Typography variant="subtitle2" color="textSecondary" sx={{ mr: 1 }}>
                    <strong>Status do Agendamento</strong>
                  </Typography>
                </Box>
                <Typography variant="body1">{getStatusChip(schedule.status)}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Box display="flex" alignItems="center" mb={0.5}>
                  <CalendarTodayIcon sx={{ mr: 1 }} color="primary" />
                  <Typography variant="subtitle2" color="textSecondary">
                    <strong>Data do Agendamento</strong>
                  </Typography>
                </Box>
                <Typography variant="body1">{formatDate(schedule.schedule_date) || '-'}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Box display="flex" alignItems="center" mb={0.5}>
                  <AccessTimeIcon sx={{ mr: 1 }} color="primary" />
                  <Typography variant="subtitle2" color="textSecondary">
                    <strong>Hora de Início</strong>
                  </Typography>
                </Box>
                <Typography variant="body1">{schedule.schedule_start_time || '-'}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Box display="flex" alignItems="center" mb={0.5}>
                  <SupervisorAccountIcon sx={{ mr: 1 }} color="primary" />
                  <Typography variant="subtitle2" color="textSecondary">
                    <strong>Agente</strong>
                  </Typography>
                </Box>
                <Chip
                  label={schedule.schedule_agent?.complete_name || 'Sem Agente'}
                  color={schedule.schedule_agent ? 'success' : 'error'}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={6}>
                <Box display="flex" alignItems="center" mb={0.5}>
                  <LocationOnIcon sx={{ mr: 1 }} color="primary" />
                  <Typography variant="subtitle2" color="textSecondary">
                    <strong>Endereço</strong>
                  </Typography>
                </Box>
                <Typography variant="body1">{formatAddress(schedule.address)}</Typography>
              </Grid>

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
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Pessoas
                </Typography>

                <Box display="flex" flexDirection="column" gap={2}>
                  {/* Agente */}
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

                  {/* Supervisor */}
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
                        <Typography variant="body2">Supervisor não identificado</Typography>
                      )}
                    </CardContent>
                  </Card>

                  {/* Vendedor */}
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
                        <Typography variant="body2">Vendedor não identificado</Typography>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              </Grid>


            </Grid>
          )}

          {tabValue === 1 && (
            <Comment appLabel={'field_services'} model={'schedule'} objectId={scheduleId} />
          )}
          {tabValue === 2 && (
            <Box p={2}>
              <Typography variant="body1">
                Em breve, você verá o histórico de alterações deste agendamento.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default CommercialScheduleDetail;
