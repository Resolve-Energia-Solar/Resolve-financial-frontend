'use client';

import { useState, useEffect } from 'react';
import { Grid, Stack, Button, CircularProgress, Typography, useTheme } from '@mui/material';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormTimePicker from '@/app/components/forms/form-custom/FormTimePicker';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';

import projectService from '@/services/projectService';
import serviceCatalogService from '@/services/serviceCatalogService';
import { useSnackbar } from 'notistack';
import scheduleService from '@/services/scheduleService';
import { useSelector } from 'react-redux';
import CreateAddressPage from '@/app/components/apps/address/Add-address';
import { ClientCard } from '../../../../components/ClientCard';
import ClientCardChips from '../../../../components/ClientCard/ClientCardChips';
import { DetailsVisualization } from '../../../../components/DetailsVisualization';
import { IconCalendarEvent, IconClock, IconLicense } from '@tabler/icons-react';
import { DetailsVisualizationInfoItem } from '../../../../components/DetailsVisualization/DetailsVisualizationInfoItem';
import answerService from '@/services/answerService';

const ViewInspection = ({ projectId, categoryId, loading, errors = {}, selectedInspection }) => {
    const theme = useTheme();
    const [answers, setAnswers] = useState(null);
    const [answersFiles, setAnswersFiles] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const [project, setProject] = useState(null);
    const userId = useSelector(state => state.user?.user?.id);
    const [formData, setFormData] = useState({
        schedule_date: null,
        schedule_start_time: null,
        schedule_end_date: null,
        schedule_end_time: null,
        observation: null,
        service: null,
        address: null,
        customer: null,
        products: [],
        branch: null,
    });
    const [calculatedEnd, setCalculatedEnd] = useState({ date: null, time: null });
    const [formErrors, setFormErrors] = useState({});
    console.log('formErrors', formErrors);

    useEffect(() => {
        const fetchAnswers = async () => {
            if (selectedInspection && open) {
                try {
                    const data = await answerService.index({ schedule: selectedInspection, expand: 'form' });
                    setAnswers(data);
                } catch (err) {
                    console.error('Erro ao buscar respostas:', err);
                    setError('Erro ao carregar as respostas');
                    enqueueSnackbar('Erro ao carregar as respostas', { variant: 'error' });
                }
            }
        };
        fetchAnswers();
    }, [open, 
        // scheduleId, 
        enqueueSnackbar]);

    useEffect(() => {
        const fetchProject = async () => {
            if (projectId) {
                const response = await projectService.find(projectId, {
                    fields: 'id,project_number,sale.customer.complete_name,sale.customer.id,address.id,product,sale.branch,schedule?.final_service_opinion?.name',
                    expand: 'sale,sale.customer,schedule,final_service_opinion'
                });
                const data = await response;
                console.log('data', data);
                setProject(data);
                setFormData(prev => ({
                    ...prev,
                    address: data.address?.id || null,
                    customer: data.sale?.customer?.id || null,
                    products: [data.product] || [],
                    branch: data.sale?.branch || null,
                }));
            }
        };
        fetchProject();
    }, [projectId]);

    useEffect(() => {
        const calculateFinalTime = async () => {
            const { schedule_date, schedule_start_time, service } = formData;
            if (!schedule_date || !schedule_start_time || !service) return;
            try {
                let rawTime = schedule_start_time;
                let timeString = rawTime instanceof Date
                    ? rawTime.toTimeString().split(' ')[0]
                    : String(rawTime);
                if (/^\d{2}:\d{2}$/.test(timeString)) timeString += ':00';
                if (!/^\d{2}:\d{2}:\d{2}$/.test(timeString)) throw new Error('Hora de início inválida');
                const [hour, minute, second] = timeString.split(':').map(Number);
                const [year, month, day] = schedule_date.split('-').map(Number);
                const startDate = new Date(year, month - 1, day, hour, minute, second);
                if (isNaN(startDate.getTime())) throw new Error('Data ou hora de início inválida');

                const serviceId = service.value || service.id || service;
                const response = await serviceCatalogService.find(serviceId, {
                    expand: ['deadline'],
                    fields: ['deadline.hours'],
                });
                const deadline = response?.deadline?.hours;
                if (!deadline) return;

                const [dH, dM, dS] = deadline.split(':').map(Number);
                const durationMs = (dH * 3600 + dM * 60 + (dS || 0)) * 1000;
                const endDate = new Date(startDate.getTime() + durationMs);
                if (isNaN(endDate.getTime())) throw new Error('Data/hora final inválida');

                const endDateStr = endDate.toISOString().split('T')[0];
                const endTimeStr = endDate.toTimeString().split(' ')[0];

                setCalculatedEnd({ date: endDateStr, time: endTimeStr });
                setFormData(prev => ({
                    ...prev,
                    schedule_end_date: endDateStr,
                    schedule_end_time: endDate,
                }));
            } catch (err) {
                console.error(err);
                enqueueSnackbar(err.message || 'Erro ao calcular data/hora final.', { variant: 'error' });
            }
        };
        calculateFinalTime();
    }, [formData.schedule_date, formData.schedule_start_time, formData.service]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        const { schedule_date, schedule_start_time, schedule_end_date, schedule_end_time, observation, service, address, customer, products, branch } = formData;
        if (!schedule_date || !schedule_start_time || !schedule_end_date || !schedule_end_time || !service || !address) {
            enqueueSnackbar('Preencha todos os campos obrigatórios.', { variant: 'warning' });
            return;
        }
        try {
            const formatTime = (time) => {
                if (!time) return null;
                if (typeof time === 'string') {
                    if (/^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
                        return time.length === 5 ? `${time}:00` : time;
                    }
                    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(time)) {
                        return time.split('T')[1].split('.')[0];
                    }
                }
                if (time instanceof Date) {
                    return time.toTimeString().split(' ')[0];
                }
                return String(time);
            };

            const response = await scheduleService.create({
                project: projectId,
                schedule_creator: userId,
                schedule_date,
                schedule_start_time: formatTime(schedule_start_time),
                schedule_end_date,
                schedule_end_time: formatTime(schedule_end_time),
                observation,
                service: service.value || service.id || service,
                address: address.value || address.id || address,
                customer,
                products,
                branch
            });
            onSave(response);
            enqueueSnackbar('Agendamento salvo com sucesso!', { variant: 'success' });
        } catch (error) {
            setFormErrors(error.response?.data || {});
            console.error('Erro ao salvar agendamento:', error);
            enqueueSnackbar('Erro ao salvar agendamento.', { variant: 'error' });
        }
    }

    return (
        <form noValidate>
            <Grid container spacing={0}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: "flex-start", flexDirection: 'column' }}>

                    <ClientCard.Root>
                        <ClientCard.Client
                            title="Cliente"
                            subtitle={project?.sale?.customer?.complete_name}
                            loading={loading}
                        />

                        <ClientCard.Address
                            title="Endereço"
                            subtitle={
                                selectedInspection?.address
                                    ? `${selectedInspection.address.street}, ${selectedInspection.address.number}`
                                    : 'Não informado'
                            }
                            loading={loading}
                        />

                        <ClientCardChips
                            chipsTitle="Parecer final"
                            status={selectedInspection?.final_service_opinion?.name}
                            loading={loading}
                        />

                    </ClientCard.Root>

                    <Grid container sx={{ xs: 1, sm: 2, md: 3, alignItems: "center", justifyContent: "center", mb: 4 }}>
                        <DetailsVisualization.Root>
                            <DetailsVisualization.Title title={"Vistoria agendada"}>
                                <Grid item rowSpacing={2} xs={6} sx={{ display: 'flex', flexDirection: 'row' }}>
                                    <Grid item xs={6}>
                                        <DetailsVisualizationInfoItem
                                            Icon={IconCalendarEvent}
                                            label="Data agendada"
                                            value={selectedInspection?.schedule_date}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <DetailsVisualizationInfoItem
                                            Icon={IconClock}
                                            label="Hora agendada"
                                            value={selectedInspection?.schedule_start_time}
                                        />
                                    </Grid>
                                </Grid>
                            </DetailsVisualization.Title>
                            <DetailsVisualization.DataText
                                title={"Protocolo"}
                                ataText={selectedInspection?.protocol}
                            />
                            <DetailsVisualization.DataText
                                title={"Produtos"}
                                dataText={
                                    selectedInspection?.products?.length
                                        ? selectedInspection.products.map(p => p.description).join(', ')
                                        : '-'
                                }
                            />
                            <DetailsVisualization.DataText
                                title={"Vendedor"}
                                dataText={`${project?.products}`}
                            />
                            <DetailsVisualization.DataText
                                title={"Agente associado"}
                                dataText={selectedInspection?.scheduled_agent?.name}
                            />
                            <DetailsVisualization.DataText
                                title={"Supervisor Vistoria"}
                                dataText={selectedInspection?.scheduled_agent}
                            />
                            <DetailsVisualization.DataText
                                title={"Observação"}
                                dataText={selectedInspection?.observation}
                            />

                            {answers && answers.results?.length > 0 && (<DetailsVisualization.Gallery
                                title={"Fotos adicionadas"}
                                answerData={answers}
                            />)}

                        </DetailsVisualization.Root>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ display: "flex", alignItems: "flex-start", justifyContent: 'flex-start' }}>
                    <Stack direction="row" justifyContent="flex-end">
                        <Button
                            variant="contained" color="secondary"
                            onClick={handleSubmit}
                            disabled={loading}
                            endIcon={loading ? <CircularProgress size={15} /> : <IconLicense size={15} />}
                        // startIcon={<IconLicense size={15} />}
                        >
                            Visualizar formulário
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </form>
    );
};

export default ViewInspection;
