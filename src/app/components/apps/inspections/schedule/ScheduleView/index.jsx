import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  CardContent,
  Chip,
  Divider,
  Drawer,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';

import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo';
import ScheduleStatusChip from '../StatusChip';
import answerService from '@/services/answerService';
import userService from '@/services/userService';
import AnswerForm from '../../form-builder/AnswerForm';
import saleService from '@/services/saleService';

export default function ScheduleView({ open, onClose, selectedSchedule }) {
  const router = useRouter();
  const [creator, setCreator] = useState(null);
  const [answerData, setAnswerData] = useState(null);
  const [loadingAnswer, setLoadingAnswer] = useState(true);
  const [seller, setSeller] = useState(null);

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

  useEffect(() => {
    async function fetchCreator() {
      if (selectedSchedule?.schedule_creator) {
        try {
          const creatorData = await userService.getUserById(selectedSchedule.schedule_creator);
          setCreator(creatorData);
        } catch (error) {
          console.error('Error fetching creator:', error);
        }
      }
    }

    fetchCreator();
  }, [selectedSchedule]);

  useEffect(() => {
    const fetchAnswer = async () => {
      setLoadingAnswer(true);
      try {
        const data = await answerService.getAnswerBySchedule(selectedSchedule.id);
        setAnswerData(data);
      } catch (err) {
        console.error('Erro ao carregar a resposta:', err);
      } finally {
        setLoadingAnswer(false);
      }
    };

    if (selectedSchedule) {
      fetchAnswer();
    }

    const fetchSeller = async () => {
      if (selectedSchedule?.project?.sale?.seller) {
        try {
          const data = await userService.getUserById(selectedSchedule?.project?.sale?.seller);
          setSeller(data);
          console.log('Vendedor:', data);
        } catch (err) {
          console.error('Erro ao carregar as vendas:', err);
        }
      }
    };

    fetchSeller();
  }, [selectedSchedule]);

  const handleEditClick = (id) => {
    router.push(`/apps/inspections/schedule/${id}/update`);
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

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
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
            >
              <Typography variant="h5">Detalhes do Agendamento</Typography>
              <Close onClick={onClose} sx={{ cursor: 'pointer' }} />
            </Box>

            {selectedSchedule && (
              <>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box>
                    <Typography variant="h4">#{selectedSchedule.id}</Typography>
                    <Chip
                      size="small"
                      color="secondary"
                      variant="outlined"
                      label={formatDate(selectedSchedule.schedule_date)}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Logo />
                  <ScheduleStatusChip status={selectedSchedule.status} />
                </Stack>
                <Divider />

                <Paper variant="outlined" sx={{ mt: 3, p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Cliente Contratante
                  </Typography>
                  <Typography variant="body1">
                    <strong>Nome:</strong> {selectedSchedule.customer.complete_name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Endereço:</strong>{' '}
                    {`${selectedSchedule.address.street}, ${selectedSchedule.address.number}, ${selectedSchedule.address.neighborhood}, ${selectedSchedule.address.city} - ${selectedSchedule.address.state}`}
                  </Typography>
                </Paper>

                <Paper variant="outlined" sx={{ mt: 3, p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Detalhes do Serviço
                  </Typography>
                  <Typography variant="body1">
                    <strong>Serviço:</strong> {selectedSchedule.service.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Agente:</strong>{' '}
                    {selectedSchedule.schedule_agent
                      ? selectedSchedule.schedule_agent.complete_name
                      : 'Sem agente associado'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Vendedor:</strong>{' '}
                    {seller?.complete_name || 'Sem vendedor associado'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Unidade:</strong>{' '}
                    {seller?.employee?.branch?.name || 'Sem unidade associada'}
                  </Typography>

                  <Typography variant="body1">
                    <strong>Telefone:</strong>{' '}
                    {seller?.phone_numbers[0] ? 
                      `(${seller?.phone_numbers[0]?.area_code}) ${seller?.phone_numbers[0]?.phone_number}` 
                      : 'Sem telefone associado'
                    }
                  </Typography>
                </Paper>

                <Paper variant="outlined" sx={{ mt: 3, p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Informações do Agendamento
                  </Typography>
                  <Typography variant="body1">
                    <strong>Agendado por:</strong> {creator?.complete_name || 'Não identificado'}
                  </Typography>
                  <Typography variant="body1">
                    <Typography variant="body1">
                      <strong>Criado em:</strong> {formatDateTime(selectedSchedule?.created_at)}
                    </Typography>{' '}
                  </Typography>
                </Paper>

                {answerData?.results?.length > 0 && !loadingAnswer && (
                  <AnswerForm answerData={answerData} />
                )}

                <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditClick(selectedSchedule.id)}
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
