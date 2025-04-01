import React, { useState, useEffect } from 'react';
import {
  Drawer,
  CircularProgress,
  Box,
  Typography,
  Chip,
  Divider,
  Grid,
  Stack,
  Button,
  Card,
  CardHeader,
  CardContent,
  Tabs,
  Tab,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { formatDate } from '@/utils/dateUtils';
import scheduleService from '@/services/scheduleService';
import userService from '@/services/userService';
import ProductService from '@/services/productsService';
import ScheduleStatusChip from '../inspections/schedule/StatusChip';
import UserCard from '../users/userCard';
import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo';
import Comment from '@/app/components/apps/comment/index';
import AnswerForm from '../inspections/form-builder/AnswerForm';
import answerService from '@/services/answerService';

const DetailsDrawer = ({ open, onClose, scheduleId }) => {
  const [loading, setLoading] = useState(true);
  const [schedule, setScheduleDetails] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [error, setError] = useState(null);
  const [seller, setSeller] = useState(null);
  const [productName, setProductName] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (open && scheduleId) {
      setLoading(true);
      scheduleService
        .find(scheduleId, {
          fields: [
            'id',
            'protocol',
            'schedule_date',
            'status',
            'service.name',
            'project.id',
            'project.sale.seller',
            'project.product.id',
            'customer.id',
            'address.complete_address',
            'address.street',
            'address.number',
            'address.city',
            'address.neighborhood',
            'schedule_agent.id',
            'schedule_creator.complete_name',
            'created_at',
            'products.name',
            'branch.name',
            'observation',
          ],
          expand: [
            'customer',
            'customer.addresses',
            'project',
            'project.sale',
            'schedule_agent',
            'schedule_creator',
            'service',
            'products',
            'branch',
            'address',
          ],
        })
        .then(async (response) => {
          setScheduleDetails(response);
        })
        .catch((error) => {
          setError('Erro ao carregar os detalhes do agendamento');
          console.error('Erro ao buscar os detalhes do agendamento:', error);
          enqueueSnackbar('Erro ao carregar os detalhes do agendamento', { variant: 'error' });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, scheduleId, enqueueSnackbar]);

  useEffect(() => {
    const fetchAnswers = async () => {
      if (scheduleId && open) {
        try {
          const data = await answerService.index({ schedule: scheduleId, expand: 'form' });
          setAnswers(data);
        } catch (err) {
          console.error('Erro ao buscar respostas:', err);
          setError('Erro ao carregar as respostas');
          enqueueSnackbar('Erro ao carregar as respostas', { variant: 'error' });
        }
      }
    };
    fetchAnswers();
  }, [open, scheduleId, enqueueSnackbar]);

  useEffect(() => {
    async function fetchSeller() {
      if (schedule?.project?.sale?.seller) {
        try {
          const sellerData = await userService.find(schedule.project.sale.seller, {
            fields: ['id', 'employee.user_manager.id'],
            expand: 'employee.user_manager',
          });
          setSeller(sellerData);
        } catch (err) {
          console.error('Erro ao buscar vendedor:', err);
        }
      }
    }
    fetchSeller();
  }, [schedule]);

  useEffect(() => {
    async function fetchProductName() {
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
        }
      }
    }
    fetchProductName();
  }, [schedule?.project?.product]);

  if (loading) {
    return (
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box
          sx={{
            width: 500,
            p: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      </Drawer>
    );
  }

  if (error) {
    return (
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 500, p: 2 }}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Box>
      </Drawer>
    );
  }

  if (!schedule) {
    enqueueSnackbar('Nenhum detalhe encontrado', { variant: 'error' });
    console.error('Nenhum detalhe encontrado');
    return (
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 500, p: 2 }}>
          <Typography variant="body1">Nenhum detalhe encontrado.</Typography>
        </Box>
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100vw', sm: '70vw' } },
      }}
    >
      <Box
        sx={{
          minWidth: { xs: '100vw', sm: '50vw', md: '40vw' },
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          p: 3,
        }}
      >
        {/* Cabeçalho */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4">nº {schedule.protocol}</Typography>
            <Chip
              size="small"
              color="secondary"
              variant="outlined"
              label={new Date(schedule.created_at).toLocaleString('pt-BR')}
              sx={{ mt: 1 }}
            />
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Logo />
            <ScheduleStatusChip status={schedule.status} />
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />
        {/* Novas Tabs */}
        <Box sx={{ mt: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
            <Tab label="Informações" />
            <Tab label="Comentários" />
            {answers && answers.results?.length > 0 && <Tab label="Formulário" />}
          </Tabs>

          {tabValue === 0 && (
            <Box>
              <Grid container spacing={2}>
                {/* Coluna Esquerda */}
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined">
                    <CardHeader title="Detalhes do Agendamento" />
                    <CardContent>
                      <Typography variant="body1" gutterBottom>
                        <strong>Serviço:</strong> {schedule.service?.name}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Kit:</strong>{' '}
                        {Array.isArray(schedule.products) && schedule.products.length > 0
                          ? schedule.products.map((prod) => prod.name).join(', ')
                          : productName || 'Sem kit associado'}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Observação do Comercial:</strong> {schedule.observation || ' - '}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Unidade:</strong> {schedule.branch?.name || 'Sem unidade associada'}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Agendado por:</strong>{' '}
                        {schedule.schedule_creator?.complete_name || 'Não identificado'}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Criado em:</strong> {formatDate(schedule.created_at)}
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card variant="outlined" sx={{ my: 2 }}>
                    <CardHeader title="Pessoas" />
                    <CardContent>
                      {/* Agente */}
                      {schedule.schedule_agent ? (
                        <UserCard
                          title="Agente"
                          userId={schedule.schedule_agent?.id}
                          showEmail={false}
                          showPhone
                        />
                      ) : (
                        <Typography variant="body1">
                          <strong>Agente:</strong> Não identificado
                        </Typography>
                      )}

                      <Divider sx={{ my: 2 }} />

                      {/* Supervisor */}
                      {seller?.employee?.user_manager ? (
                        <UserCard
                          title="Supervisor"
                          userId={seller.employee.user_manager.id}
                          showEmail={false}
                          showPhone
                        />
                      ) : (
                        <Typography variant="body1">
                          <strong>Supervisor:</strong> Não identificado
                        </Typography>
                      )}

                      <Divider sx={{ my: 2 }} />

                      {/* Vendedor */}
                      {seller ? (
                        <UserCard title="Vendedor" userId={seller.id} showEmail={false} showPhone />
                      ) : (
                        <Typography variant="body1">
                          <strong>Vendedor:</strong> Não identificado
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Coluna Direita */}
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined">
                    <CardHeader title="Dados do Cliente" />
                    <CardContent>
                      <UserCard userId={schedule.customer?.id} showPhone showEmail={false} />
                      <Typography variant="body1" sx={{ mt: 2 }}>
                        <strong>Endereço:</strong> {schedule.address?.complete_address}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <iframe
                          width="100%"
                          height="300"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${schedule.address?.street}+${schedule.address?.number}+${schedule.address?.city}+${schedule.address?.neighborhood}`}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                  <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
                    <Button
                      variant="contained"
                      color="primary"
                      href={`/apps/schedules/${schedule.id}/update`}
                    >
                      Editar Agendamento
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          )}
          {tabValue === 1 && (
            <Box sx={{ p: 2 }}>
              <Comment appLabel="field_services" model="schedule" objectId={schedule.id} />
            </Box>
          )}
          {answers && answers.results?.length > 0 && tabValue === 2 && (
            <Box sx={{ p: 2 }}>
              <AnswerForm answerData={answers} />
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default DetailsDrawer;
