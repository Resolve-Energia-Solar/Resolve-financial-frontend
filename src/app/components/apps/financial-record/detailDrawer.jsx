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
    Grid,
    IconButton,
    Chip,
    Link,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Comment from '../comment';
import Attachments from '../../shared/Attachments';

const FINANCIAL_RECORD_CONTENT_TYPE = process.env.NEXT_PUBLIC_FINANCIAL_RECORD_CONTENT_TYPE

const statusMap = {
    "S": <Chip label="Solicitada" color="warning" />,
    "E": <Chip label="Em Andamento" color="primary" />,
    "P": <Chip label="Paga" color="success" />,
    "C": <Chip label="Cancelada" color="error" />
};

const paymentStatusMap = {
    "P": <Chip label="Pago" color="success" />,
    "E": <Chip label="Pendente" color="warning" />,
    "C": <Chip label="Cancelado" color="error" />
};

const responsibleStatusMap = {
    "P": <Chip label="Pendente" color="warning" />,
    "A": <Chip label="Aprovado" color="success" />,
    "R": <Chip label="Reprovado" color="error" />
};

const FinancialRecordDetailDrawer = ({ open, onClose, record }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const [openAddAttachmentModal, setOpenAddAttachmentModal] = useState(false);
    if (!record) return null;

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: '55vw', p: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Solicitação nº {record.protocol}</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)}>
                    <Tab label="Geral" />
                    <Tab label="Comentários" />
                    <Tab label="Anexos" />
                </Tabs>

                {tabIndex === 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}><Typography><strong>Protocolo:</strong> {record.protocol}</Typography></Grid>
                            <Grid item xs={12} md={6}><Typography><strong>Descrição:</strong> {record.notes}</Typography></Grid>
                            <Grid item xs={12} md={6}><Typography><strong>Beneficiário:</strong> {record.client_supplier_name}</Typography></Grid>
                            <Grid item xs={12} md={6}>
                                <Typography><strong>Valor:</strong> R$ {parseFloat(record.value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}><Typography><strong>Data de Vencimento:</strong> {new Date(record.due_date).toLocaleDateString('pt-BR')}</Typography></Grid>
                            <Grid item xs={12} md={6}><Typography><strong>Data do Serviço:</strong> {new Date(record.service_date).toLocaleDateString('pt-BR')}</Typography></Grid>
                            <Grid item xs={12} md={6}><Typography><strong>Status:</strong> {statusMap[record.status]}</Typography></Grid>
                            <Grid item xs={12} md={6}><Typography><strong>Status do Financeiro:</strong> {paymentStatusMap[record.payment_status]}</Typography></Grid>
                            <Grid item xs={12} md={6}><Typography><strong>Status do Gestor:</strong> {responsibleStatusMap[record.responsible_status]}</Typography></Grid>
                            <Grid item xs={12} md={6}><Typography><strong>Data de Criação:</strong> {new Date(record.created_at).toLocaleString('pt-BR')}</Typography></Grid>
                        </Grid>
                        <Divider sx={{ my: 3 }} />
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}><Typography><strong>Código do Departamento:</strong> {record.department_code}</Typography></Grid>
                            <Grid item xs={12} md={6}><Typography><strong>Código da Categoria:</strong> {record.category_code}</Typography></Grid>
                            <Grid item xs={12} md={6}><Typography><strong>Código do Cliente/Fornecedor:</strong> {record.client_supplier_code}</Typography></Grid>
                            <Grid item xs={12} md={6}><Typography><strong>Número da Fatura:</strong> {record.invoice_number || "-"}</Typography></Grid>
                        </Grid>
                        <Divider sx={{ my: 3 }} />
                        <Grid container>
                            <Box display="flex" gap={2}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Solicitante</Typography>
                                    <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
                                        <Avatar src={record.requester.profile_picture} alt={record.requester.complete_name} sx={{ width: 40, height: 40 }} />
                                        <Box>
                                            <Typography>{record.requester.complete_name}</Typography>
                                            <Typography><Link href={`mailto:${record.requester.email}`}>{record.requester.email}</Link></Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Gestor</Typography>
                                    <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
                                        <Avatar src={record.responsible.profile_picture} alt={record.responsible.complete_name} sx={{ width: 40, height: 40 }} />
                                        <Box>
                                            <Typography>{record.responsible.complete_name}</Typography>
                                            <Typography><Link href={`mailto:${record.responsible.email}`}>{record.responsible.email}</Link></Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Box>
                )}

                {tabIndex === 1 && (
                    <Comment contentType={FINANCIAL_RECORD_CONTENT_TYPE} objectId={record.id} />
                )}

                {tabIndex === 2 && (
                    <Attachments objectId={record.id} contentType={FINANCIAL_RECORD_CONTENT_TYPE} documentTypes={["Financial"]} />
                )}
            </Box>
        </Drawer>
    );
};

export default FinancialRecordDetailDrawer;
