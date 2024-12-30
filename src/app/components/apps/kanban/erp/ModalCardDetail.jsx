'use client'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    Avatar,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    styled,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SubjectIcon from '@mui/icons-material/Subject';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ShareIcon from '@mui/icons-material/Share';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TodayIcon from '@mui/icons-material/Today';
import { Task, Visibility } from '@mui/icons-material';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

import { format } from 'date-fns'
import { useRef } from 'react';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        width: '70%',
        maxWidth: '90vw',
        height: '90vh',
    },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));

const ReactQuill = dynamic(
    async () => {
        const { default: RQ } = await import('react-quill');
        // eslint-disable-next-line react/display-name
        return ({ ...props }) => <RQ {...props} />;
    },
    {
        ssr: false,
    },
);

export default function ModalCardDetail({ open, onClose, data, onClickActionActivity, comments, handleText, setText, text }) {



    const HtmlRenderer = ({ rawHtml }) => {
        return (
            <div
                dangerouslySetInnerHTML={{ __html: rawHtml }}
            />
        );
    };



    return (
        <StyledDialog open={open} onClose={onClose} >
            <DialogTitle>
                <Box display="flex" alignItems="center" marginBottom={2}>
                    <CreditCardIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">{data?.title}</Typography>
                </Box>
                <Box borderBottom={1} marginBottom={2} bgcolor="primary.main" />
                <Box>
                    <Box display='flex' gap={8}>
                        <Box display="flex" flexDirection="column" alignItems="flex-start" gap={1}>
                            <Typography variant="subtitle1" >Venda nº {data?.project.sale.contract_number}</Typography>
                            <Typography variant="subtitle1" >Projeto nº {data?.project.project_number}</Typography>
                            <Typography variant="subtitle1">Contratante: {data?.project.sale.customer.name}</Typography>

                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="flex-start" gap={1}>
                            <Typography variant="subtitle1">Data da Venda: 17 de nov. 2024</Typography>
                            <Typography variant="subtitle1">Data para Conclusão: 17 de fev. 2025</Typography>
                            <Typography variant="subtitle1">Homologador: João Silva Vieigas Queiroz</Typography>
                        </Box>
                    </Box>
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers >
                <Box display="flex" gap={2}>
                    <Box flex={1}>
                        <Box mb={3}>
                            <SectionTitle variant="subtitle1">
                                <SubjectIcon />
                                Descrição
                            </SectionTitle>
                            <Typography marginLeft={4} marginBottom={4}>
                                {data?.description}
                            </Typography>
                        </Box>

                        <Box mb={3}>
                            <SectionTitle variant="subtitle1">
                                <ChatBubbleOutlineIcon />
                                Atividades
                            </SectionTitle>

                            <Box>
                                <ReactQuill
                                    value={text}
                                    onChange={(value) => setText(value)}
                                    placeholder="Escreva aqui..."

                                />
                                <Button onClick={handleText} disabled={!text || text === '<p><br></p>'} sx={{ marginBlock: 2 }}>
                                    Salvar
                                </Button>
                            </Box>

                            <Box>
                                {
                                    comments ? comments.map((comment) => (
                                        <Box display="flex" mb={2}>
                                            <Avatar sx={{ width: 32, height: 32, mr: 1 }}>{comment.author.first_name}</Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" mb={0.5}>{comment.author.complete_name}</Typography>
                                                <Typography variant="body2" >
                                                    <HtmlRenderer rawHtml={comment.text} />
                                                </Typography>
                                                <Typography variant="caption">{format(new Date(comment.created_at), 'dd MMMM yyyy, hh:mm:ss')}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )) : <Box fullWidth display="flex" justifyContent="center"><CircularProgress size={30} /></Box>
                                }
                            </Box>
                        </Box>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box width={250}>
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
                            <Box display="flex" flexDirection={'column'} gap={1}>
                                <Button variant="contained" size="medium" startIcon={data?.id_integration ? <Visibility /> : <Task />} onClick={onClickActionActivity} sx={{ justifyContent: 'start' }}>
                                    {
                                        data?.id_integration ?
                                            'Visualizar Atividade' :
                                            'Realizar Atividade'
                                    }
                                </Button>
                                <Button variant="contained" size="medium" startIcon={<InventoryIcon />} sx={{ justifyContent: 'start' }}>Arquivar</Button>
                                <Button variant="contained" size="medium" startIcon={<ShareIcon />} sx={{ justifyContent: 'start' }}>Compartilhar</Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </StyledDialog >
    );
}