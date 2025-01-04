import { use, useContext, useEffect, useState } from 'react';
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
import { FilterAlt, Close } from '@mui/icons-material';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { ScheduleDataContext } from '@/app/context/Inspection/ScheduleContext';
import FormDateRange from '../../../comercial/sale/components/DrawerFilters/DateRangePicker';
import CheckboxesTags from '../../../comercial/sale/components/DrawerFilters/CheckboxesTags';
import AutoCompleteUserFilter from '../../auto-complete/Auto-Input-UserFilter';
import AutoCompleteServiceCatalogFilter from '../../auto-complete/Auto-Input-ServiceFilter';
import scheduleService from '@/services/scheduleService';
import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo';
import ScheduleStatusChip from '../StatusChip';
import answerService from '@/services/answerService';
import AnswerForm from '../../form-builder/AnswerForm';

export default function ScheduleView({ open, onClose, selectedSchedule }) {
  const router = useRouter();

  const [answerData, setAnswerData] = useState(null);
  const [loadingAnswer, setLoadingAnswer] = useState(true);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const handleEditClick = (id) => {
    router.push(`/apps/inspections/schedule/${id}/update`);
  };

  useEffect(() => {
    const fetchAnswer = async () => {
      setLoadingAnswer(true);
      try {
        const data = await answerService.getAnswerBySchedule(selectedSchedule.id);
        setAnswerData(data);
      } catch (err) {
        setError('Erro ao carregar a resposta');
      } finally {
        setLoadingAnswer(false);
      }
    };

    if (selectedSchedule) {
      fetchAnswer();
    }
  }, [selectedSchedule]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box
          role="presentation"
          sx={{
            minWidth: {
              xs: '100vw',
              sm: '50vw',
              md: '40vw',
            },
            padding: 2,
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <Typography variant="h5" sx={{ marginBottom: '25px' }}>
                Detalhes do Agendamento
              </Typography>
              <Close onClick={onClose} />
            </Box>
            {selectedSchedule && (
              <>
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
                    <Typography variant="h3"># {selectedSchedule.id}</Typography>
                    <Box mt={1}>
                      <Chip
                        size="small"
                        color="secondary"
                        variant="outlined"
                        label={formatDate(selectedSchedule.schedule_date)}
                      ></Chip>
                    </Box>
                  </Box>
                  <Logo />
                  <ScheduleStatusChip status={selectedSchedule.status} />
                </Stack>
                <Divider />

                <Paper variant="outlined" sx={{ marginTop: 2 }}>
                  <Box p={3} display="flex" flexDirection="column" gap="4px">
                    <Typography variant="h4" sx={{ marginBottom: '15px' }}>
                      <strong>Cliente contratante:</strong>{' '}
                      {selectedSchedule.customer.complete_name}
                    </Typography>

                    <Divider />
                    <Box mt={2}>
                      <Typography variant="body1">
                        <strong>Endereço:</strong>{' '}
                        {`${selectedSchedule.address.street}, ${selectedSchedule.address.number}, ${selectedSchedule.address.neighborhood}, ${selectedSchedule.address.city} - ${selectedSchedule.address.state}`}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
                <Paper variant="outlined" sx={{ marginTop: 2 }}>
                  <Box p={3} display="flex" flexDirection="column" gap="4px">
                    <Typography variant="h4" sx={{ marginBottom: '15px' }}>
                      <strong>Serviço:</strong> {selectedSchedule.service.name}
                    </Typography>
                    <Divider />
                    <Box mt={2}>
                      <Typography variant="body1">
                        <strong>Agente:</strong>{' '}
                        {selectedSchedule.schedule_agent
                          ? selectedSchedule.schedule_agent.complete_name
                          : 'Sem agente associado'}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Vendedor:</strong>{' '}
                        {selectedSchedule.project.id
                          ? selectedSchedule.project.sale.seller.complete_name
                          : 'Sem projeto associado'}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Unidade:</strong>{' '}
                        {selectedSchedule.project.id
                          ? selectedSchedule.project.sale.branch.name
                          : 'Sem projeto associado'}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
                {answerData?.results?.length > 0 && !loadingAnswer && (
                  <AnswerForm answerData={answerData} />
                )}
              </>
            )}
            {/* Botão de Ação */}
            <Grid item xs={12} sm={12} lg={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditClick(selectedSchedule.id)}
                >
                  Editar Agendamento
                </Button>
              </Stack>
            </Grid>
          </CardContent>
        </Box>
      </Drawer>
    </Box>
  );
}
