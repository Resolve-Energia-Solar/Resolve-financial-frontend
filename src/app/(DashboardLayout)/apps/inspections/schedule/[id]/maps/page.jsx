'use client';

import React, { useEffect, useState } from 'react';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import InvoiceList from '@/app/components/apps/invoice/Invoice-list/index';
import { InvoiceProvider } from '@/app/context/InvoiceContext/index';
import BlankCard from '@/app/components/shared/BlankCard';
import { CardContent, Grid, Skeleton } from '@mui/material';
import ScheduleFormEdit from '@/app/components/apps/inspections/schedule/Edit-schedule';
import ScheduleMap from '@/app/components/apps/inspections/schedule/ScheduleMaps';
import { useParams } from 'next/navigation';
import scheduleService from '@/services/scheduleService';
import { Box, Divider, Paper, Typography } from '@mui/material';
import { formatDate } from '@/utils/inspectionFormatDate';

const BCrumb = [
    {
        to: '/',
        title: 'Home',
    },
    {
        title: 'Agendamentos',
    },
];

const LoadingSkeleton = () => (
    <Box p={3} display="flex" flexDirection="column" gap="4px">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="text" width="70%" />
    </Box>
);

const ScheduleView = () => {
    const [scheduleData, setScheduleData] = useState(null);
    const [error, setError] = useState(null);
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const schedule = await scheduleService.getScheduleById(id);
                if (schedule) setScheduleData(schedule);
            } catch (error) {
                console.error('Erro ao buscar agendamento:', error);
                setError('Erro ao carregar os dados do agendamento. Tente novamente.');
            }
        };

        fetchSchedule();
    }, [id]);

    return (
        <InvoiceProvider>
            <PageContainer
                title="Acompanhar Agendamento"
                description="Essa é a página de Acompanhar Agendamento"
            >
                <Breadcrumb title="Acompanhar Agendamento" items={BCrumb} />
                <BlankCard>
                    <CardContent>
                        <Grid container spacing={3} mt={2} mb={4}>
                            <Grid item xs={12} sm={12}>
                                <Box p={3} display="flex" flexDirection="column" gap="4px">
                                    <Paper elevation={3} mt={2}>
                                        {!scheduleData && !error && <LoadingSkeleton />}
                                        {error && (
                                            <Box p={3}>
                                                <Typography color="error">{error}</Typography>
                                            </Box>
                                        )}
                                        {scheduleData && (
                                            <>
                                                <Box p={3} display="flex" flexDirection="column" gap="4px">
                                                    <Typography variant="h6">Agendamento</Typography>
                                                    <Typography variant="body1">
                                                        Agente de Campo: {scheduleData.schedule_agent?.complete_name}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        Serviço: {scheduleData.service?.name}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        Data: {scheduleData.schedule_date ? formatDate(scheduleData.schedule_date) : 'Data não disponível'}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        Horário: {scheduleData.schedule_start_time}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        Observações: {scheduleData.observation}
                                                    </Typography>
                                                </Box>
                                                <Divider />
                                                <Box p={3} display="flex" flexDirection="column" gap="4px">
                                                    <Typography variant="h6">Cliente</Typography>
                                                    <Typography variant="body1">
                                                        Nome: {scheduleData.customer?.complete_name}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        Endereço:{' '}
                                                        {`${scheduleData.address?.street}, 
                                                        ${scheduleData.address?.number}, 
                                                        ${scheduleData.address?.neighborhood}, 
                                                        ${scheduleData.address?.city} - 
                                                        ${scheduleData.address?.state}, 
                                                        ${scheduleData.address?.zip_code}, 
                                                        ${scheduleData.address?.complement}, 
                                                        ${scheduleData.address?.country}`}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        Telefones:{' '}
                                                        {scheduleData.customer?.phone_numbers?.length > 0
                                                            ? scheduleData.customer.phone_numbers.map((phone, index) =>
                                                                index > 0 ? `, ${phone.phone_number}` : phone.phone_number
                                                            )
                                                            : 'Telefone não disponível'}
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        Contrato: {scheduleData.project?.sale?.contract_number}
                                                    </Typography>
                                                </Box>
                                            </>
                                        )}
                                    </Paper>
                                    {scheduleData && <ScheduleMap schedule={scheduleData} />}
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </BlankCard>
            </PageContainer>
        </InvoiceProvider>
    );
};

export default ScheduleView;
