'use client';
import React, { useState } from 'react';
import {
    Drawer,
    Box,
    Typography,
    Avatar,
    Divider,
    Tabs,
    Tab,
    Grid
} from '@mui/material';
import Comment from '../comment';

const FinancialRecordDetailDrawer = ({ open, onClose, record }) => {
    const [tabIndex, setTabIndex] = useState(0);

    if (!record) return null;

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: '40vw', p: 4 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Detalhes do Registro</Typography>
                
                <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)}>
                    <Tab label="Geral" />
                    <Tab label="Comentários" />
                </Tabs>

                {tabIndex === 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}><Typography><strong>Protocolo:</strong> {record.protocol}</Typography></Grid>
                            <Grid item xs={12}><Typography><strong>Descrição:</strong> {record.notes}</Typography></Grid>
                            <Grid item xs={6}><Typography><strong>Beneficiário/Pagador:</strong> {record.client_supplier_name}</Typography></Grid>
                            <Grid item xs={6}><Typography><strong>Valor:</strong>R$ {record.value}</Typography></Grid>
                            <Grid item xs={6}><Typography><strong>Data de Vencimento:</strong> {record.due_date}</Typography></Grid>
                            <Grid item xs={6}><Typography><strong>Data do Serviço:</strong> {record.service_date}</Typography></Grid>
                            <Grid item xs={6}><Typography><strong>Status:</strong> {record.status}</Typography></Grid>
                            <Grid item xs={6}><Typography><strong>Status do Pagamento:</strong> {record.payment_status}</Typography></Grid>
                            <Grid item xs={12}><Typography><strong>Data de Criação:</strong> {record.created_at}</Typography></Grid>
                        </Grid>
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Solicitante</Typography>
                        <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
                            <Avatar src={record.requester.profile_picture} alt={record.requester.complete_name} sx={{ width: 56, height: 56 }} />
                            <Box>
                                <Typography><strong>Nome:</strong> {record.requester.complete_name}</Typography>
                                <Typography><strong>Email:</strong> {record.requester.email}</Typography>
                                <Typography><strong>Telefone:</strong> +{record.requester.phone_numbers[0].country_code} ({record.requester.phone_numbers[0].area_code}) {record.requester.phone_numbers[0].phone_number}</Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ my: 3 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Responsável</Typography>
                        <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
                            <Avatar src={record.responsible.profile_picture} alt={record.responsible.complete_name} sx={{ width: 56, height: 56 }} />
                            <Box>
                                <Typography><strong>Nome:</strong> {record.responsible.complete_name}</Typography>
                                <Typography><strong>Email:</strong> {record.responsible.email}</Typography>
                                <Typography><strong>Telefone:</strong> +{record.responsible.phone_numbers[0].country_code} ({record.responsible.phone_numbers[0].area_code}) {record.responsible.phone_numbers[0].phone_number}</Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ my: 3 }} />
                        <Grid container spacing={2}>
                            <Grid item xs={6}><Typography><strong>Código do Departamento:</strong> {record.department_code}</Typography></Grid>
                            <Grid item xs={6}><Typography><strong>Código da Categoria:</strong> {record.category_code}</Typography></Grid>
                            <Grid item xs={6}><Typography><strong>Código do Cliente/Fornecedor:</strong> {record.client_supplier_code}</Typography></Grid>
                            <Grid item xs={6}><Typography><strong>Número da Fatura:</strong> {record.invoice_number}</Typography></Grid>
                        </Grid>
                    </Box>
                )}

                {tabIndex === 1 && (
                    <Comment contentType={104} objectId={record.id}/>
                )}
            </Box>
        </Drawer>
    );
};

export default FinancialRecordDetailDrawer;