import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    TextField,
    Typography,
    Box,
    Avatar,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    styled
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SubjectIcon from '@mui/icons-material/Subject';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import InventoryIcon from '@mui/icons-material/Inventory';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ShareIcon from '@mui/icons-material/Share';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TodayIcon from '@mui/icons-material/Today';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        width: '60%',
        maxWidth: '90vw',
        height: '80vh',
    },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));

export default function ModalCardDetail({ open, onClose, data }) {

    console.log(data)

    return (
        <StyledDialog open={open} onClose={onClose}>
            <DialogTitle>
                <Box display="flex" alignItems="center" marginBottom={4}>
                    <CreditCardIcon sx={{ mr: 1 }} />
                    <TextField
                        value={data?.title}
                        onChange={(e) => setTitle(e.target.value)}
                        variant="standard"
                        sx={{
                            input: {
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                '&:focus': {
                                    background: 'rgba(0, 0, 0, 0.05)',
                                },
                            }
                        }}
                        fullWidth
                    />
                </Box>
                <Box>
                    <SectionTitle variant="title" fontWeight={'bold'}>
                        <ChatBubbleOutlineIcon />
                        Detalhamento
                    </SectionTitle>
                    <Box display={'flex'} gap={8}>
                        <Box display="flex" flexDirection={'column'} alignItems="flex-start" mb={3} gap={1}>


                            <Typography variant="subtitle1" >Venda nº {data?.project.sale.contract_number}</Typography>
                            <Typography variant="subtitle1" >Projeto nº {data?.project.project_number}</Typography>
                            <Typography variant="subtitle1">Contratante: {data?.project.sale.customer.name}</Typography>
                            <Typography variant="subtitle1">Homologador: João Silva Vieigas Queiroz</Typography>

                        </Box>
                        <Box display="flex" flexDirection={'column'} alignItems="flex-start" mb={3} gap={1}>


                            <Typography variant="subtitle1">Data da Venda: 17 de nov. 2024</Typography>
                            <Typography variant="subtitle1">Data para Conclusão: 17 de fev. 2025</Typography>

                        </Box>
                    </Box>

                </Box>

                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box display="flex" gap={2}>
                    <Box flex={1}>
                        <Box mb={3}>
                            <SectionTitle variant="subtitle1">
                                <SubjectIcon />
                                Descrição
                            </SectionTitle>
                            <TextField
                                multiline
                                rows={4}
                                value={data?.description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                        </Box>

                        <Box mb={3}>
                            <SectionTitle variant="subtitle1">
                                <ChatBubbleOutlineIcon />
                                Atividades
                            </SectionTitle>
                            <Box display="flex" alignItems="flex-start" mb={2}>
                                <Avatar sx={{ width: 32, height: 32, mr: 1 }}>JS</Avatar>
                                <Box>
                                    <Typography variant="subtitle2" mb={0.5}>João Silva</Typography>
                                    <Typography variant="body2">Ótimo progresso! Continuem assim.</Typography>
                                    <Typography variant="caption">31 de jul. de 2024, 15:37</Typography>
                                </Box>
                            </Box>
                            <TextField
                                placeholder="Adicione um comentário..."
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={2}
                            />
                        </Box>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box width={200}>
                        <Box mb={3} display="flex" flexDirection="column" gap={0.5}>
                            <Typography variant="subtitle1" gutterBottom>Datas</Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                                <TodayIcon fontSize="small" />
                                <Typography variant="body2">Criação: 15/08/2023</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <ScheduleIcon fontSize="small" />
                                <Typography variant="body2">Prazo: 15/08/2023</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <EventAvailableIcon fontSize="small" />
                                <Typography variant="body2">Conclusão: 15/08/2023</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>Anexos</Typography>
                            <List dense sx={{ maxHeight: '150px', overflowY: 'auto' }}>

                                {data?.project.attachments.map((attachment) => {
                                    <ListItem>
                                        <ListItemIcon>
                                            <AttachFileIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary="documento.pdf" secondary={attachment?.name} />
                                    </ListItem>
                                })}

                            </List>
                            <Button variant="outlined" fullWidth size="small">
                                Adicionar anexo s
                            </Button>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>Acões</Typography>
                            <Box display={'flex'} flexDirection={'column'} gap={1}>
                                <Button variant="contained" size="medium" startIcon={<InventoryIcon />} sx={{ justifyContent: 'start' }}>Arquivar</Button>
                                <Button variant="contained" size="medium" startIcon={<ShareIcon />} sx={{ justifyContent: 'start' }}>Compartilhar</Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </StyledDialog>
    );
}