import React, { useState } from 'react';
import { Drawer, Tabs, Tab, Box, Typography } from '@mui/material';

const DetailsDrawer = ({ open, onClose, schedule }) => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    // Se "schedule" não estiver definido, exibe uma mensagem de carregamento
    if (!schedule) {
        return (
            <Drawer anchor="right" open={open} onClose={onClose}>
                <Box sx={{ width: 500, p: 2 }}>
                    <Typography>Carregando detalhes...</Typography>
                </Box>
            </Drawer>
        );
    }

    return (
        <Drawer anchor="right" open={open} onClose={onClose}   ModalProps={{
            BackdropProps: {
              style: {
                backgroundColor: 'rgba(0, 0, 0, 0.1)'
              }
            }
          }}>
            <Box sx={{ width: 500, p: 2 }}>
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    variant="scrollable"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Geral" />
                    <Tab label="Serviço" />
                    <Tab label="Cliente" />
                    <Tab label="Projeto" />
                    <Tab label="Localização" />
                    <Tab label="Criador" />
                </Tabs>

                {tabIndex === 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1">
                            <strong>Protocolo:</strong> {schedule.protocol}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Agendamento:</strong> {schedule.schedule_date} às {schedule.schedule_start_time}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Final:</strong> {schedule.schedule_end_date} às {schedule.schedule_end_time}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Status:</strong> {schedule.status}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Observação:</strong> {schedule.observation || '-'}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Criado em:</strong> {new Date(schedule.created_at).toLocaleString()}
                        </Typography>
                    </Box>
                )}

                {tabIndex === 1 && schedule.service && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1">
                            <strong>Serviço:</strong> {schedule.service.name}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Descrição:</strong> {schedule.service.description || '-'}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Deadline:</strong> {schedule.service.deadline || '-'}
                        </Typography>
                    </Box>
                )}

                {tabIndex === 2 && schedule.customer && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1">
                            <strong>Cliente:</strong> {schedule.customer.complete_name}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Documento:</strong> {schedule.customer.first_document || '-'}
                        </Typography>
                        <Typography variant="body1">
                            <strong>E-mail:</strong> {schedule.customer.email}
                        </Typography>
                    </Box>
                )}

                {tabIndex === 3 && schedule.project && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1">
                            <strong>Projeto:</strong> {schedule.project.project_number}
                        </Typography>
                    </Box>
                )}

                {tabIndex === 4 && (
                    <Box sx={{ mt: 2 }}>
                        {schedule.address && (
                            <>
                                <Typography variant="body1">
                                    <strong>Endereço:</strong>
                                </Typography>
                                <Typography variant="body2">
                                    {schedule.address.street}, {schedule.address.number}{' '}
                                    {schedule.address.complement && `, ${schedule.address.complement}`}
                                </Typography>
                                <Typography variant="body2">
                                    {schedule.address.neighborhood}, {schedule.address.city} - {schedule.address.state}
                                </Typography>
                                <Typography variant="body2">
                                    {schedule.address.country} - CEP: {schedule.address.zip_code}
                                </Typography>
                            </>
                        )}
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Latitude:</strong> {schedule.latitude}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Longitude:</strong> {schedule.longitude}
                        </Typography>
                    </Box>
                )}

                {tabIndex === 5 && schedule.schedule_creator && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1">
                            <strong>Criador:</strong> {schedule.schedule_creator.complete_name}
                        </Typography>
                        <Typography variant="body1">
                            <strong>E-mail:</strong> {schedule.schedule_creator.email}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Data de Cadastro:</strong>{' '}
                            {new Date(schedule.schedule_creator.date_joined).toLocaleString()}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Drawer>
    );
};

export default DetailsDrawer;
