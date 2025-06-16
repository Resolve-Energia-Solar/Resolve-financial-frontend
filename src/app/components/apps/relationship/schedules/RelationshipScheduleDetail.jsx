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
    Dialog,
    DialogTitle,
    DialogContent,
    Paper,
    useTheme
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { formatDate } from '@/utils/dateUtils';
import scheduleService from '@/services/scheduleService';
import userService from '@/services/userService';
import ProductService from '@/services/productsService';
import ScheduleStatusChip from '../../inspections/schedule/StatusChip';
import UserCard from '../../users/userCard';
import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo';
import Comment from '@/app/components/apps/comment/index';
import AnswerForm from '../../inspections/form-builder/AnswerForm';
import answerService from '@/services/answerService';
import History from '../../history';
import { Close, ArrowDropUp, ArrowDropDown, ArrowRightOutlined } from '@mui/icons-material';
import ScheduleTimeline from '../../schedule/ScheduleTimeline';


const RelationshipScheduleDetail = ({ open, onClose, scheduleId, dialogMode = false }) => {
    const [loading, setLoading] = useState(true);
    const [schedule, setSchedule] = useState(null);
    const [answers, setAnswers] = useState(null);
    const [error, setError] = useState(null);
    const [seller, setSeller] = useState(null);
    const [productName, setProductName] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
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
                        'schedule_start_time',
                        'schedule_end_time',
                        'going_to_location_at',
                        'arrived_at',
                        'execution_started_at',
                        'execution_finished_at',
                        'status',
                        'severity',
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
                        'requester.complete_name',
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
                        'requester',
                        'service',
                        'products',
                        'branch',
                        'address',
                    ],
                })
                .then(async (response) => {
                    setSchedule(response);
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
            <Drawer anchor="right" open={open} onClose={onClose} sx={{ zIndex: 1400 }}>
                <Box
                    sx={{
                        width: 500,
                        p: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1400
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

    const content = (
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
                    <Tab label="Histórico" />
                    {answers && answers.results?.length > 0 && <Tab label="Formulário" />}
                </Tabs>

                {tabValue === 0 && (
                    <Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={3}>
                                    <Card variant="outlined">
                                        <CardHeader title="Detalhes do Agendamento" />
                                        <CardContent>
                                            <Typography variant="body1" gutterBottom>
                                                <strong>Serviço:</strong> {schedule.service?.name}
                                            </Typography>
                                            <Typography variant="body1" gutterBottom display={'flex'} alignItems="center">
                                                <strong>Prioridade:</strong> {(() => {
                                                    if (!schedule.severity) return '-';
                                                    const severity = schedule.severity;
                                                    const icons = { C: <ArrowDropUp color='error' />, B: <ArrowRightOutlined color='warning' />, A: <ArrowDropDown color='success' /> };
                                                    const labels = { C: 'Alta (C)', B: 'Média (B)', A: 'Baixa (A)' };
                                                    const colors = { C: 'error.main', B: 'warning.main', A: 'success.main' };
                                                    return (
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            {icons[severity]}
                                                            <Typography variant="body1" color={colors[severity]}>
                                                                {labels[severity]}
                                                            </Typography>
                                                        </Box>
                                                    );
                                                })()}
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
                                            <Typography variant="body1" gutterBottom>
                                                <strong>Solicitante:</strong>{' '}
                                                {schedule.requester?.complete_name || 'Não identificado'}
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                <strong>Criado em:</strong> {formatDate(schedule.created_at)}
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                <strong>Data do agendamento:</strong> {formatDate(schedule?.schedule_date)}
                                            </Typography>

                                            {schedule.going_to_location_at && (
                                                <ScheduleTimeline scheduleData={schedule} />
                                            )}
                                        </CardContent>
                                    </Card>
                                </Stack>
                            </Grid>

                            {/* Coluna Direita */}
                            <Grid item xs={12} md={6}>
                                <Stack spacing={3}>
                                    <Card variant="outlined">
                                        <CardHeader title="Dados do Cliente" />
                                        <CardContent>
                                            <UserCard userId={schedule.customer?.id} showPhone showEmail={false} />
                                            <Typography variant="body1" sx={{ mt: 2 }}>
                                                <strong>Endereço:</strong> {schedule.address?.complete_address}
                                            </Typography>
                                            {schedule.address?.street && (
                                                <Box sx={{ mt: 2 }}>
                                                    <iframe
                                                        width="100%"
                                                        height="300"
                                                        style={{ border: 0, borderRadius: 8 }}
                                                        loading="lazy"
                                                        allowFullScreen
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                        src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${schedule.address?.street}+${schedule.address?.number}+${schedule.address?.city}+${schedule.address?.neighborhood}`}
                                                    />
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {!dialogMode && (
                                        <Box display="flex" justifyContent="flex-end">
                                            <Button
                                                variant="contained"
                                                href={`/apps/relationship/schedules/${schedule.id}/update`}
                                                sx={{
                                                    backgroundColor: theme.palette.primary.main,
                                                    color: theme.palette.getContrastText(theme.palette.primary.main),
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.primary.dark,
                                                    },
                                                }}
                                            >
                                                Editar Agendamento
                                            </Button>
                                        </Box>
                                    )}
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
                {tabValue === 2 && (
                    <Box sx={{ p: 2 }}>
                        <History appLabel={'field_services'} model={'schedule'} objectId={schedule.id} />
                    </Box>
                )}
                {answers && answers.results?.length > 0 && tabValue === 3 && (
                    <Box sx={{ p: 2 }}>
                        <AnswerForm answerData={answers} />
                    </Box>
                )}
            </Box>
        </Box>
    );

    return dialogMode ? (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4">{schedule.service.name}</Typography>
                    <Button variant={null} onClick={onClose}>
                        <Close />
                    </Button>
                </Box>
            </DialogTitle>
            <DialogContent>{content}</DialogContent>
        </Dialog>
    ) : (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: { xs: '100vw', sm: '70vw' } },
            }}
            sx={{ zIndex: 1400 }}
        >
            {content}
        </Drawer>
    );
};

export default RelationshipScheduleDetail;