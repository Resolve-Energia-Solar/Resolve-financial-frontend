import React, { useState, useEffect } from 'react';
import { Drawer, Tabs, Tab, Box, Typography, CircularProgress } from '@mui/material';
import scheduleService from '@/services/scheduleService';

const DetailsDrawer = ({ open, onClose, scheduleId }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const [scheduleDetails, setScheduleDetails] = useState(null);
    const [loading, setLoading] = useState(true); // Carregar os dados enquanto isso é true
    const [error, setError] = useState(null); // Para capturar qualquer erro

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    useEffect(() => {
        if (open && scheduleId) {  // Garantir que o Drawer está aberto e tem um ID válido
            setLoading(true);  // Inicia o carregamento
            scheduleService.find(scheduleId)
                .then((response) => {
                    setScheduleDetails(response.data);  // Armazena os detalhes
                })
                .catch((error) => {
                    setError('Erro ao carregar os detalhes do agendamento');
                    console.error("Erro ao buscar os detalhes do agendamento:", error);
                })
                .finally(() => {
                    setLoading(false);  // Finaliza o carregamento
                });
        }
    }, [open, scheduleId]);  // Recarregar os dados sempre que o Drawer ou ID mudarem

    // Exibe um spinner enquanto os dados estão sendo carregados
    if (loading) {
        return (
            <Drawer anchor="right" open={open} onClose={onClose}>
                <Box sx={{ width: 500, p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />
                </Box>
            </Drawer>
        );
    }

    // Se houver um erro no carregamento, mostra uma mensagem
    if (error) {
        return (
            <Drawer anchor="right" open={open} onClose={onClose}>
                <Box sx={{ width: 500, p: 2 }}>
                    <Typography variant="body1" color="error">{error}</Typography>
                </Box>
            </Drawer>
        );
    }

    if (!scheduleDetails) {
        return null; // Caso o agendamento não exista ou tenha falhado ao buscar os dados
    }

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 500, p: 2 }}>
                <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab label="Geral" />
                    <Tab label="Serviço" />
                    <Tab label="Cliente" />
                    <Tab label="Projeto" />
                    <Tab label="Localização" />
                    <Tab label="Criador" />
                </Tabs>

                {tabIndex === 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1"><strong>ID:</strong> {scheduleDetails.id}</Typography>
                        <Typography variant="body1"><strong>Protocolo:</strong> {scheduleDetails.protocol}</Typography>
                        <Typography variant="body1"><strong>Agendamento:</strong> {scheduleDetails.schedule_date} às {scheduleDetails.schedule_start_time}</Typography>
                        <Typography variant="body1"><strong>Final:</strong> {scheduleDetails.schedule_end_date} às {scheduleDetails.schedule_end_time}</Typography>
                        <Typography variant="body1"><strong>Status:</strong> {scheduleDetails.status}</Typography>
                        <Typography variant="body1"><strong>Observação:</strong> {scheduleDetails.observation || '-'}</Typography>
                        <Typography variant="body1"><strong>Criado em:</strong> {new Date(scheduleDetails.created_at).toLocaleString()}</Typography>
                    </Box>
                )}

                {tabIndex === 1 && scheduleDetails.service && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1"><strong>Serviço:</strong> {scheduleDetails.service.name}</Typography>
                        <Typography variant="body1"><strong>Descrição:</strong> {scheduleDetails.service.description || '-'}</Typography>
                        <Typography variant="body1"><strong>Deadline:</strong> {scheduleDetails.service.deadline || '-'}</Typography>
                    </Box>
                )}

                {tabIndex === 2 && scheduleDetails.customer && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1"><strong>Cliente:</strong> {scheduleDetails.customer.complete_name}</Typography>
                        <Typography variant="body1"><strong>Documento:</strong> {scheduleDetails.customer.first_document || '-'}</Typography>
                        <Typography variant="body1"><strong>E-mail:</strong> {scheduleDetails.customer.email}</Typography>
                    </Box>
                )}

                {tabIndex === 3 && scheduleDetails.project && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1"><strong>Projeto:</strong> {scheduleDetails.project.project_number}</Typography>
                    </Box>
                )}

                {tabIndex === 4 && (
                    <Box sx={{ mt: 2 }}>
                        {scheduleDetails.address && (
                            <>
                                <Typography variant="body1"><strong>Endereço:</strong></Typography>
                                <Typography variant="body2">
                                    {scheduleDetails.address.street}, {scheduleDetails.address.number} {scheduleDetails.address.complement && `, ${scheduleDetails.address.complement}`}
                                </Typography>
                                <Typography variant="body2">{scheduleDetails.address.neighborhood}, {scheduleDetails.address.city} - {scheduleDetails.address.state}</Typography>
                                <Typography variant="body2">{scheduleDetails.address.country} - CEP: {scheduleDetails.address.zip_code}</Typography>
                            </>
                        )}
                        <Typography variant="body1" sx={{ mt: 1 }}><strong>Latitude:</strong> {scheduleDetails.latitude}</Typography>
                        <Typography variant="body1"><strong>Longitude:</strong> {scheduleDetails.longitude}</Typography>
                    </Box>
                )}

                {tabIndex === 5 && scheduleDetails.schedule_creator && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1"><strong>Criador:</strong> {scheduleDetails.schedule_creator.complete_name}</Typography>
                        <Typography variant="body1"><strong>E-mail:</strong> {scheduleDetails.schedule_creator.email}</Typography>
                        <Typography variant="body1"><strong>Data de Cadastro:</strong> {new Date(scheduleDetails.schedule_creator.date_joined).toLocaleString()}</Typography>
                    </Box>
                )}
            </Box>
        </Drawer>
    );
};

export default DetailsDrawer;
