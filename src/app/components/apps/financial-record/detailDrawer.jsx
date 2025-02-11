'use client';
import React, { useState } from 'react';
import {
    Chip,
    Drawer,
    Box,
    Typography,
    Avatar,
    Divider,
    Tabs,
    Tab,
    Grid,
    IconButton,
    Link
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Comment from '../comment';
import AttachmentTable from '../attachment/attachmentTable';

const statusMap = {
    "P": <Chip label="Pendente" color="warning" size="small" />,
    "A": <Chip label="Aceito" color="success" size="small" />,
    "R": <Chip label="Recusado" color="error" size="small" />
};

const paymentStatusMap = {
    "P": <Chip label="Pendente" color="warning" size="small" />,
    "PG": <Chip label="Pago" color="success" size="small" />,
    "C": <Chip label="Cancelado" color="error" size="small" />
}

const responsibleStatusMap = {
    "P": <Chip label="Pendente" color="warning" size="small" />,
    "A": <Chip label="Aprovado" color="success" size="small" />,
    "R": <Chip label="Reprovado" color="error" size="small" />
}
const FINANCIAL_RECORD_CONTENT_TYPE = process.env.NEXT_PUBLIC_FINANCIAL_RECORD_CONTENT_TYPE;

const FinancialRecordDetailDrawer = ({ open, onClose, record }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const [openAttachmentModal, setOpenAttachmentModal] = useState(false);

    if (!record) return null;

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: '55vw', p: 4, display: 'flex', flexDirection: 'column' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                        Solicitação nº {record.protocol}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Tabs value={tabIndex} onChange={(event, newIndex) => setTabIndex(newIndex)}>
                    <Tab label="Geral" />
                    <Tab label="Comentários" />
                    <Tab label="Anexos" />
                </Tabs>
                {tabIndex === 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography>
                                    <strong>Protocolo:</strong> {record.protocol}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography>
                                    <strong>Descrição:</strong> {record.notes}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography>
                                    <strong>Beneficiário:</strong> {record.client_supplier_name}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography>
                                    <strong>Valor:</strong>{' '}
                                    R$ {parseFloat(record.value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography>
                                    <strong>Data de Vencimento:</strong> {new Date(record.due_date).toLocaleDateString('pt-BR')}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography>
                                    <strong>Data do Serviço:</strong> {new Date(record.service_date).toLocaleDateString('pt-BR')}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography>
                                    <strong>Status:</strong> {statusMap[record.status]}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography>
                                    <strong>Status do Financeiro:</strong> {paymentStatusMap[record.payment_status]}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography>
                                    <strong>Status do Gestor:</strong> {responsibleStatusMap[record.responsible_status]}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography>
                                    <strong>Data de Criação:</strong> {new Date(record.created_at).toLocaleString('pt-BR')}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider sx={{ my: 3 }} />
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Typography>
                                    <strong>Código do Departamento:</strong> {record.department_code}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography>
                                    <strong>Código da Categoria:</strong> {record.category_code}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography>
                                    <strong>Código do Cliente/Fornecedor:</strong> {record.client_supplier_code}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography>
                                    <strong>Número da Fatura:</strong> {record.invoice_number || '-'}
                                </Typography>
                            </Grid>
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
                                            <Typography>
                                                <Link href={`mailto:${record.requester.email}`}>{record.requester.email}</Link>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Gestor</Typography>
                                    <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
                                        <Avatar src={record.responsible.profile_picture} alt={record.responsible.complete_name} sx={{ width: 40, height: 40 }} />
                                        <Box>
                                            <Typography>{record.responsible.complete_name}</Typography>
                                            <Typography>
                                                <Link href={`mailto:${record.responsible.email}`}>{record.responsible.email}</Link>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Box>
                )}

                {tabIndex === 1 && (
                    <Box sx={{ mt: 3 }}>
                        <Comment contentType={FINANCIAL_RECORD_CONTENT_TYPE} objectId={record.id} />
                    </Box>
                )}

                {tabIndex === 2 && (
                    <Box sx={{ mt: 3 }}>
                        <AttachmentTable contentType={FINANCIAL_RECORD_CONTENT_TYPE} objectId={record.id} />
                    </Box>
                )}
            </Box>
        </Drawer>
    )
};

export default FinancialRecordDetailDrawer;
