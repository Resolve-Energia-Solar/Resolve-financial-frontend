import { useEffect, useState } from 'react';
import scheduleService from '@/services/scheduleService';
import { Skeleton } from '@mui/material';
import { Card, CardHeader, CardContent, Divider, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Chip } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { useSnackbar } from 'notistack';

export default function ScheduleTimeline({ scheduleData, scheduleId }) {
    const [schedule, setSchedule] = useState(scheduleData || null);
    const [loading, setLoading] = useState(!scheduleData);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (scheduleData) {
            setSchedule(scheduleData);
            setLoading(false);
        } else if (scheduleId) {
            setLoading(true);
            const fetchSchedule = async () => {
                try {
                    const response = await scheduleService.find(scheduleId, { fields: 'going_to_location_at,arrived_at,execution_started_at,execution_finished_at' });
                    setSchedule(response);
                } catch (error) {
                    console.error('Erro ao carregar os dados de duração', error);
                    enqueueSnackbar('Erro ao carregar os dados de duração', { variant: 'error' });
                } finally {
                    setLoading(false);
                }
            };
            fetchSchedule();
        }
    }, [scheduleId, scheduleData]);

    return (
        <Card variant="outlined" sx={{ mt: 2 }}>
            <CardHeader title="Dados de Duração" />
            <Divider />
            <CardContent>
                <Timeline position="alternate">
                    {/* Início do deslocamento */}
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color='success' />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="body1">
                                <strong>Início do deslocamento:</strong> {!loading ? new Date(schedule?.going_to_location_at).toLocaleTimeString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                }) : <Skeleton variant="text" width={100} />}
                            </Typography>
                        </TimelineContent>
                    </TimelineItem>

                    {/* Fim do deslocamento */}
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color={schedule?.arrived_at ? 'success' : 'grey'} />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="body1">
                                <strong>Fim do deslocamento:</strong> {!loading ? schedule?.arrived_at
                                    ? new Date(schedule?.arrived_at).toLocaleTimeString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })
                                    : <Chip label={'Em deslocamento'} size="small" /> : <Skeleton variant="text" width={100} />
                                }
                            </Typography>
                        </TimelineContent>
                    </TimelineItem>

                    {/* Iniciado em */}
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color={schedule?.execution_started_at ? 'success' : 'grey'} />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="body1">
                                <strong>Iniciado em:</strong> {!loading ? schedule?.execution_started_at
                                    ? new Date(schedule?.execution_started_at).toLocaleTimeString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })
                                    : <Chip label={'Não iniciado'} size="small" /> : <Skeleton variant="text" width={100} />
                                }
                            </Typography>
                        </TimelineContent>
                    </TimelineItem>

                    {/* Finalizado em */}
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color={schedule?.execution_finished_at ? 'success' : 'grey'} />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="body1">
                                <strong>Finalizado em:</strong> {!loading ? schedule?.execution_finished_at
                                    ? new Date(schedule?.execution_finished_at).toLocaleTimeString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit'
                                    })
                                    : <Chip label={schedule?.execution_started_at ? 'Em andamento' : 'Não iniciado'} size="small" color={schedule?.execution_started_at ? 'primary' : 'default'} /> : <Skeleton variant="text" width={100} />
                                }
                            </Typography>
                        </TimelineContent>
                    </TimelineItem>
                </Timeline>

                {schedule?.arrived_at && <>
                    {/* Durações - área separada em tabela */}
                    <Divider sx={{ my: 2 }} />
                    <TableContainer component={Paper} sx={{ mt: 2 }} variant='outlined'>
                        <Table sx={{ minWidth: 300 }} aria-label="durações table" size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Duração</TableCell>
                                    <TableCell>Tempo</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {schedule?.arrived_at && (
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            Deslocamento
                                        </TableCell>
                                        <TableCell>
                                            {(() => {
                                                const started = new Date(schedule?.going_to_location_at);
                                                const finished = new Date(schedule?.arrived_at);
                                                const duration = finished - started;
                                                const hours = Math.floor(duration / 3600000);
                                                const minutes = Math.floor((duration % 3600000) / 60000);
                                                const seconds = Math.floor((duration % 60000) / 1000);
                                                return `${hours}h ${minutes}m ${seconds}s`;
                                            })()}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {(schedule?.arrived_at && schedule?.execution_started_at) && (
                                    <TableRow>
                                        <TableCell component="th" scope="row" title="Intervalo entre a chegada ao local e o início da execução do serviço">
                                            Espera no local
                                        </TableCell>
                                        <TableCell>
                                            {(() => {
                                                const started = new Date(schedule?.arrived_at);
                                                const finished = new Date(schedule?.execution_started_at);
                                                const duration = finished - started;
                                                const hours = Math.floor(duration / 3600000);
                                                const minutes = Math.floor((duration % 3600000) / 60000);
                                                const seconds = Math.floor((duration % 60000) / 1000);
                                                return `${hours}h ${minutes}m ${seconds}s`;
                                            })()}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {schedule?.execution_started_at && schedule?.execution_finished_at && (
                                    <TableRow>
                                        <TableCell component="th" scope="row" title="Desde o início do serviço até o fim, sem contar o deslocamento">
                                            Serviço
                                        </TableCell>
                                        <TableCell>
                                            {(() => {
                                                const started = new Date(schedule?.execution_started_at);
                                                const finished = new Date(schedule?.execution_finished_at);
                                                const duration = finished - started;
                                                const hours = Math.floor(duration / 3600000);
                                                const minutes = Math.floor((duration % 3600000) / 60000);
                                                const seconds = Math.floor((duration % 60000) / 1000);
                                                return `${hours}h ${minutes}m ${seconds}s`;
                                            })()}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {schedule?.execution_finished_at && (
                                    <TableRow>
                                        <TableCell component="th" scope="row" title="Desde o início do deslocamento até o fim do serviço">
                                            Total
                                        </TableCell>
                                        <TableCell>
                                            {(() => {
                                                const goingTo = new Date(schedule?.going_to_location_at);
                                                const finished = new Date(schedule?.execution_finished_at);
                                                const duration = finished - goingTo;
                                                const hours = Math.floor(duration / 3600000);
                                                const minutes = Math.floor((duration % 3600000) / 60000);
                                                const seconds = Math.floor((duration % 60000) / 1000);
                                                return `${hours}h ${minutes}m ${seconds}s`;
                                            })()}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>}
            </CardContent>
        </Card>
    );
};