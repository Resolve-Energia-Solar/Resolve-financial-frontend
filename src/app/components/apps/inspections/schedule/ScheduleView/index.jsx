'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  CardContent,
  Chip,
  Divider,
  Drawer,
  Paper,
  Stack,
  Typography,
  Skeleton, // Importa o Skeleton do MUI
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useSelector } from 'react-redux';

import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo';
import ScheduleStatusChip from '../StatusChip';
import answerService from '@/services/answerService';
import userService from '@/services/userService';
import AnswerForm from '../../form-builder/AnswerForm';
import HasPermission from '@/app/components/permissions/HasPermissions';
import scheduleService from '@/services/scheduleService';
import saleService from '@/services/saleService';
import ProductService from '@/services/productsService';

export default function ScheduleView({ open, onClose, selectedSchedule }) {
  const router = useRouter();
  const [scheduleData, setScheduleData] = useState(null);
  const [answerData, setAnswerData] = useState(null);
  const [loadingAnswer, setLoadingAnswer] = useState(true);
  const [seller, setSeller] = useState(null);
  const [productName, setProductName] = useState(null);
  
  const userPermissions = useSelector((state) => state.user.permissions);

  const hasPermission = (permissions) => {
    if (!permissions) return true;
    return permissions.some((permission) => userPermissions.includes(permission));
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Não identificado';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Reseta os estados quando o agendamento selecionado mudar
  useEffect(() => {
    setScheduleData(null);
    setAnswerData(null);
    setSeller(null);
    setProductName(null);
  }, [selectedSchedule]);

  // Busca os dados completos do agendamento
  useEffect(() => {
    async function fetchFullSchedule() {
      try {
        const data = await scheduleService.getScheduleById(selectedSchedule.id, {
          fields:
            'id,schedule_date,customer,address,service,project,schedule_agent,created_at,observation,status,products,schedule_creator',
        });
        setScheduleData(data);
      } catch (error) {
        console.error('Erro ao buscar agendamento completo:', error);
      }
    }
    if (selectedSchedule) {
      fetchFullSchedule();
    }
  }, [selectedSchedule]);

  // Busca as respostas associadas ao agendamento
  useEffect(() => {
    const fetchAnswer = async () => {
      setLoadingAnswer(true);
      try {
        if (scheduleData?.id) {
          const data = await answerService.getAnswerBySchedule(scheduleData.id);
          setAnswerData(data);
        }
      } catch (err) {
        console.error('Erro ao buscar respostas:', err);
      } finally {
        setLoadingAnswer(false);
      }
    };

    if (scheduleData) {
      fetchAnswer();
    }
  }, [scheduleData]);

  useEffect(() => {
    async function fetchSaleAndSeller() {
      if (scheduleData?.project?.sale) {
        try {
          const saleData = await saleService.getSaleById(scheduleData.project.sale);
          if (saleData?.seller) {
            const sellerData = await userService.getUserById(saleData.seller.id);
            setSeller(sellerData);
          }
        } catch (err) {
          console.error('Erro ao buscar venda ou vendedor:', err);
        }
      }
    }
    fetchSaleAndSeller();
  }, [scheduleData]);

  useEffect(() => {
    async function fetchProductName() {
      if (scheduleData?.project?.product) {
        try {
          const productId =
            typeof scheduleData.project.product === 'object'
              ? scheduleData.project.product.id
              : scheduleData.project.product;
          const productData = await ProductService.getProductById(productId);
          setProductName(productData.name);
        } catch (error) {
          console.error('Erro ao buscar produto:', error);
        }
      }
    }
    fetchProductName();
  }, [scheduleData?.project?.product]);

  const handleEditClick = (id) => {
    router.push(`/apps/inspections/schedule/${id}/update`);
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  console.log('scheduleData', scheduleData);

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box
          role="presentation"
          sx={{
            minWidth: { xs: '100vw', sm: '50vw', md: '40vw' },
            padding: 3,
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Detalhes do Agendamento</Typography>
              <Close onClick={onClose} sx={{ cursor: 'pointer' }} />
            </Box>

            {/* Se os dados ainda não foram carregados, mostra um skeleton detalhado */}
            {!scheduleData ? (
              <Stack spacing={2}>
                <Skeleton variant="text" width="40%" height={40} />
                <Skeleton variant="text" width="20%" height={30} />
                <Divider />
                <Skeleton variant="text" width="60%" height={30} />
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="70%" height={30} />
                <Divider />
                <Skeleton variant="rectangular" width="100%" height={150} />
              </Stack>
            ) : (
              <>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box>
                    <Typography variant="h4">#{scheduleData.id}</Typography>
                    <Chip
                      size="small"
                      color="secondary"
                      variant="outlined"
                      label={formatDate(scheduleData.schedule_date)}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Logo />
                  <ScheduleStatusChip status={scheduleData.status} />
                </Stack>
                <Divider />

                <Paper variant="outlined" sx={{ mt: 3, p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Cliente Contratante
                  </Typography>
                  <Typography variant="body1">
                    <strong>Nome:</strong> {scheduleData.customer?.complete_name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Endereço:</strong>{' '}
                    {`${scheduleData.address?.street}, ${scheduleData.address?.number}, ${scheduleData.address?.neighborhood}, ${scheduleData.address?.city} - ${scheduleData.address?.state}`}
                  </Typography>
                </Paper>

                <Paper variant="outlined" sx={{ mt: 3, p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Detalhes do Serviço
                  </Typography>
                  <Typography variant="body1">
                    <strong>Serviço:</strong> {scheduleData.service?.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Kit:</strong>{' '}
                    {Array.isArray(scheduleData.products) && scheduleData.products.length > 0
                      ? scheduleData.products.map((prod) => prod.name).join(', ')
                      : productName || scheduleData.project?.product?.name || 'Sem kit associado'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Agente:</strong>{' '}
                    {scheduleData.schedule_agent ? scheduleData.schedule_agent?.complete_name : 'Sem agente associado'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Vendedor:</strong>{' '}
                    {seller?.complete_name || 'Sem vendedor associado'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Supervisor:</strong>{' '}
                    {seller?.employee?.manager?.complete_name || 'Sem supervisor associado'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Número do Supervisor:</strong>{' '}
                    {seller?.employee?.manager?.phone_numbers?.length > 0
                      ? `+${seller.employee.manager.phone_numbers[0]?.country_code} (${seller.employee.manager.phone_numbers[0]?.area_code}) ${seller.employee.manager.phone_numbers[0]?.phone_number}`
                      : 'Sem número associado'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Unidade:</strong>{' '}
                    {seller?.employee?.branch?.name || 'Sem unidade associada'}
                  </Typography>
                  <HasPermission
                    permissions={['field_services.view_agent_info']}
                    userPermissions={userPermissions}
                  >
                    <Typography variant="body1">
                      <strong>Nome do Vistoriador:</strong>{' '}
                      {scheduleData?.schedule_agent?.complete_name || 'Sem nome associada'}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Telefone do Vistoriador:</strong>{' '}
                      {scheduleData?.schedule_agent?.phone_numbers?.length > 0
                        ? scheduleData.schedule_agent.phone_numbers
                            .map((phone) => `+${phone.country_code} (${phone.area_code}) ${phone.phone_number}`)
                            .join(', ')
                        : 'Sem telefone associado'}
                    </Typography>
                  </HasPermission>
                </Paper>

                <Paper variant="outlined" sx={{ mt: 3, p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Informações do Agendamento
                  </Typography>
                  <Typography variant="body1">
                    <strong>Agendado por:</strong> {scheduleData?.schedule_creator?.complete_name || 'Não identificado'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Criado em:</strong> {formatDateTime(scheduleData?.created_at)}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Observação do comercial:</strong> {scheduleData?.observation || ' - '}
                  </Typography>
                </Paper>

                {answerData?.results?.length > 0 && !loadingAnswer && (
                  <AnswerForm answerData={answerData} />
                )}

                <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditClick(scheduleData.id)}
                  >
                    Editar Agendamento
                  </Button>
                </Stack>
              </>
            )}
          </CardContent>
        </Box>
      </Drawer>
    </Box>
  );
}
