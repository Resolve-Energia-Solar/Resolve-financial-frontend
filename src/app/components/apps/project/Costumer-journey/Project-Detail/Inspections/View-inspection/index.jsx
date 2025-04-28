'use client';

import { useState, useEffect } from 'react';
import { Grid, Stack, Button, CircularProgress } from '@mui/material';
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

const ViewInspection = ({ projectId, categoryId, onSave = () => { }, loading, errors = {}, row }) => {
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
        const fetchProject = async () => {
            if (projectId) {
                const response = await projectService.find(projectId, {
                    fields: 'id,project_number,sale.customer.complete_name,sale.customer.id,address.id,product,sale.branch',
                    expand: 'sale,sale.customer'
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
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                    <ClientCard.Root>
                        <ClientCard.Client
                            title="Cliente"
                            subtitle={project?.sale?.customer?.complete_name}
                            loading={loading}
                        />

                        <ClientCard.Address
                            title="Endereço"
                            subtitle={(row.address?.complete_address || row.address?.name) || 'Não informado'}   
                            loading={loading}
                        />
                    </ClientCard.Root>
                </Grid>
                <Grid item xs={12}>
                    <CustomTextField
                        fullWidth label="Projeto"
                        value={`${project?.project_number} - ${project?.sale?.customer?.complete_name}`}
                        disabled
                    />
                </Grid>
                {/* Serviço antes das datas */}
                <Grid item xs={6}>
                    <GenericAsyncAutocompleteInput
                        label="Serviço"
                        value={formData.service}
                        onChange={val => handleChange('service', val)}
                        endpoint="api/services"
                        extraParams={{ fields: ['id', 'name'], ordering: ['name'], limit: 50, category__in: categoryId }}
                        mapResponse={data => data.results.map(it => ({ label: it.name, value: it.id }))}
                        error={!!formErrors.service}
                        helperText={formErrors.service?.[0]}
                    />
                </Grid>
                <Grid item xs={6}>
                    <GenericAsyncAutocompleteInput
                        label="Endereço"
                        value={formData.address}
                        onChange={val => handleChange('address', val)}
                        endpoint="api/addresses"
                        queryParam='q'
                        extraParams={{
                            fields: ['id', 'complete_address'],
                            customer_id: formData.customer || project?.sale?.customer?.id || null,
                        }}
                        mapResponse={data => data.results.map(it => ({ label: it.complete_address || it.name, value: it.id }))}
                        renderCreateModal={({ onClose, onCreate, newObjectData, setNewObjectData }) => (
                            <CreateAddressPage
                                onClose={onClose} onCreate={onCreate}
                                newObjectData={newObjectData} setNewObjectData={setNewObjectData}
                            />
                        )}
                        error={!!formErrors.address}
                        helperText={formErrors.address?.[0]}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormDate
                        label="Data Início"
                        name="schedule_date"
                        value={formData.schedule_date}
                        onChange={val => handleChange('schedule_date', val)}
                        error={!!formErrors.schedule_date}
                        helperText={formErrors.schedule_date?.[0]}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormTimePicker
                        fullWidth label="Hora Início"
                        name="schedule_start_time"
                        value={formData.schedule_start_time}
                        onChange={val => handleChange('schedule_start_time', val)}
                        error={!!formErrors.schedule_start_time}
                        helperText={formErrors.schedule_start_time?.[0]}
                    />
                </Grid>
                {formData.schedule_date && formData.schedule_start_time && (
                    <>
                        <Grid item xs={6}>
                            <FormDate
                                label="Data Fim"
                                name="schedule_end_date"
                                value={formData.schedule_end_date}
                                onChange={val => handleChange('schedule_end_date', val)}
                                error={!!formErrors.schedule_end_date}
                                helperText={formErrors.schedule_end_date?.[0]}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormTimePicker
                                fullWidth label="Hora Fim"
                                name="schedule_end_time"
                                value={formData.schedule_end_time}
                                onChange={val => handleChange('schedule_end_time', val)}
                                error={!!formErrors.schedule_end_time}
                                helperText={formErrors.schedule_end_time?.[0]}
                            />
                        </Grid>
                    </>
                )}
                <Grid item xs={12}>
                    <CustomTextField
                        multiline rows={4}
                        fullWidth label="Observação"
                        name="observation"
                        value={formData.observation || ''}
                        onChange={e => handleChange('observation', e.target.value)}
                        error={!!formErrors.observation}
                        helperText={formErrors.observation?.[0]}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="flex-end">
                        <Button
                            variant="contained" color="primary"
                            onClick={handleSubmit}
                            disabled={loading}
                            endIcon={loading && <CircularProgress size={20} />}
                        >
                            Salvar
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </form>
    );
};

export default ViewInspection;
