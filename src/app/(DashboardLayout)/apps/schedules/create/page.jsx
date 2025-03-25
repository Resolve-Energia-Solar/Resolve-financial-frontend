'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box, Button, Typography, Grid, MenuItem, InputLabel, Select, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, TextField
} from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import BlankCard from '@/app/components/shared/BlankCard';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';
import scheduleService from '@/services/scheduleService';

const CreateSchedulePage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        schedule_date: '',
        schedule_start_time: '',
        schedule_end_date: '',
        schedule_end_time: '',
        service: null,
        customer: null,
        project: null,
        schedule_agent: null,
        branch: null,
        address: null,
        observation: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasProject, setHasProject] = useState(null);

    const handleInputChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        // Converte os campos de foreign key para enviar apenas os IDs
        const submitData = {
            ...formData,
            service: formData.service?.value,
            customer: formData.customer?.value,
            project: formData.project?.value,
            schedule_agent: formData.schedule_agent?.value,
            branch: formData.branch?.value,
            address: formData.address?.value,
        };
        try {
            await scheduleService.createSchedule(submitData);
            router.push('/apps/schedules');
        } catch (err) {
            setError('Erro ao criar agendamento');
            setLoading(false);
        }
    };

    const breadcrumbItems = [
        { to: '/', title: 'Início' },
        { to: '/apps/schedules', title: 'Agendamentos' },
        { title: 'Criar Agendamento' },
    ];

    return (
        <PageContainer title="Criar Agendamento" description="Formulário para criação de um novo agendamento">
            <Breadcrumb items={breadcrumbItems} />
            <BlankCard>
                <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
                    <Typography variant="h5" gutterBottom marginBottom={4}>Criar Agendamento</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <GenericAsyncAutocompleteInput
                                label="Serviço"
                                value={formData.service}
                                onChange={(newValue) => setFormData({ ...formData, service: newValue })}
                                endpoint="/api/services/"
                                queryParam="name__icontains"
                                extraParams={{ fields: ['id', 'name'] }}
                                mapResponse={(data) =>
                                    data.results.map((s) => ({ label: s.name, value: s.id }))
                                }
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <GenericAsyncAutocompleteInput
                                label="Agente"
                                value={formData.schedule_agent}
                                onChange={(newValue) => setFormData({ ...formData, schedule_agent: newValue })}
                                endpoint="/api/users/"
                                queryParam="complete_name__icontains"
                                extraParams={{ fields: ['id', 'complete_name'] }}
                                mapResponse={(data) =>
                                    data.results.map((u) => ({ label: u.complete_name, value: u.id }))
                                }
                                fullWidth
                            />
                        </Grid>
                        {/* Datas e horários */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Data do Agendamento"
                                type="date"
                                name="schedule_date"
                                value={formData.schedule_date}
                                onChange={handleInputChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Horário de Início"
                                type="time"
                                name="schedule_start_time"
                                value={formData.schedule_start_time}
                                onChange={handleInputChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Este agendamento possui projeto?</FormLabel>
                                <RadioGroup
                                    row
                                    value={hasProject}
                                    onChange={(e) => setHasProject(e.target.value)}
                                >
                                    <FormControlLabel value="true" control={<Radio />} label="Sim" />
                                    <FormControlLabel value="false" control={<Radio />} label="Não" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        {hasProject === "true" && (
                            <>
                                <Grid item xs={12} sm={6}>
                                    <GenericAsyncAutocompleteInput
                                        label="Projeto"
                                        value={formData.project}
                                        onChange={(newValue) => {
                                            setFormData({
                                                ...formData,
                                                project: newValue,
                                                customer: newValue.customer,
                                                branch: newValue.branch,
                                                address: newValue.address
                                            });
                                        }}
                                        endpoint="/api/projects/"
                                        queryParam="project_number__icontains"
                                        extraParams={{
                                            expand: ['sale.customer,sale.branch'],
                                            fields: ['id', 'project_number', 'address', 'sale.customer.complete_name', 'sale.customer.id', 'sale.branch.id', 'sale.branch.name']
                                        }}
                                        mapResponse={(data) =>
                                            data.results.results.map((p) => ({
                                                label: `${p.project_number} - ${p.sale.customer.complete_name}`,
                                                value: p.id,
                                                customer: { label: p.sale.customer.complete_name, value: p.sale.customer.id },
                                                branch: { label: p.sale.branch.name, value: p.sale.branch.id },
                                                address: {
                                                    label: `${p.address.zip_code} - ${p.address.country} - ${p.address.state} - ${p.address.city} - ${p.address.neighborhood} - ${p.address.street} - ${p.address.number} - ${p.address.complement}`,
                                                    value: p.address.id
                                                }
                                            }))
                                        }
                                        fullWidth
                                    />
                                </Grid>
                                {formData.project && (
                                    <>
                                        <Grid item xs={12} sm={6}>
                                            <GenericAsyncAutocompleteInput
                                                label="Cliente"
                                                value={formData.customer}
                                                onChange={(newValue) => setFormData({ ...formData, customer: newValue })}
                                                endpoint="/api/users/"
                                                queryParam="complete_name__icontains"
                                                extraParams={{ fields: ['id', 'complete_name'] }}
                                                mapResponse={(data) =>
                                                    data.results.map((u) => ({ label: u.complete_name, value: u.id }))
                                                }
                                                fullWidth
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <GenericAsyncAutocompleteInput
                                                label="Unidade"
                                                value={formData.branch}
                                                onChange={(newValue) => setFormData({ ...formData, branch: newValue })}
                                                endpoint="/api/branches/"
                                                queryParam="name__icontains"
                                                extraParams={{ fields: ['id', 'name'] }}
                                                mapResponse={(data) =>
                                                    data.results.map((b) => ({ label: b.name, value: b.id }))
                                                }
                                                fullWidth
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <GenericAsyncAutocompleteInput
                                                label="Endereço"
                                                value={formData.address}
                                                onChange={(newValue) => setFormData({ ...formData, address: newValue })}
                                                endpoint="/api/addresses/"
                                                queryParam="street__icontains"
                                                extraParams={{ fields: ['id', 'street'] }}
                                                mapResponse={(data) =>
                                                    data.results.map((a) => ({ label: a.street, value: a.id }))
                                                }
                                                fullWidth
                                                disabled
                                            />
                                        </Grid>
                                    </>
                                )}
                            </>
                        )}

                        {hasProject === "false" && (
                            <>
                                <Grid item xs={12} sm={6}>
                                    <GenericAsyncAutocompleteInput
                                        label="Cliente"
                                        value={formData.customer}
                                        onChange={(newValue) => setFormData({ ...formData, customer: newValue })}
                                        endpoint="/api/users/"
                                        queryParam="complete_name__icontains"
                                        extraParams={{ fields: ['id', 'complete_name'] }}
                                        mapResponse={(data) =>
                                            data.results.map((u) => ({ label: u.complete_name, value: u.id }))
                                        }
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <GenericAsyncAutocompleteInput
                                        label="Unidade"
                                        value={formData.branch}
                                        onChange={(newValue) => setFormData({ ...formData, branch: newValue })}
                                        endpoint="/api/branches/"
                                        queryParam="name__icontains"
                                        extraParams={{ fields: ['id', 'name'] }}
                                        mapResponse={(data) =>
                                            data.results.map((b) => ({ label: b.name, value: b.id }))
                                        }
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <GenericAsyncAutocompleteInput
                                        label="Endereço"
                                        value={formData.address}
                                        onChange={(newValue) => setFormData({ ...formData, address: newValue })}
                                        endpoint="/api/addresses/"
                                        queryParam="street__icontains"
                                        extraParams={{ fields: ['id', 'street'] }}
                                        mapResponse={(data) =>
                                            data.results.map((a) => ({ label: a.street, value: a.id }))
                                        }
                                        fullWidth
                                    />
                                </Grid>
                            </>
                        )}
                        <Grid item xs={12}>
                            <TextField
                                label="Observação"
                                name="observation"
                                value={formData.observation}
                                onChange={handleInputChange}
                                fullWidth
                                multiline
                                rows={4}
                            />
                        </Grid>
                    </Grid>
                    {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button variant="outlined" onClick={() => router.back()} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </Box>
                </Box>
            </BlankCard>
        </PageContainer>
    );
};

export default CreateSchedulePage;
