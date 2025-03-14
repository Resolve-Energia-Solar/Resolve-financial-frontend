'use client';
import { Grid, Typography, Chip, Divider, Box, Rating, useTheme, IconButton, Card } from '@mui/material';
import { AccountCircle, CalendarToday, CalendarViewWeek, WbSunny } from '@mui/icons-material';
import BlankCard from '@/app/components/shared/BlankCard';
import { IconCalendarWeek, IconEye, IconPencil, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import leadService from '@/services/leadService';
import formatPhoneNumber from '@/utils/formatPhoneNumber';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import ProposalService from '@/services/proposalService';
import ProposalCard from '../../components/CardProposal';
import LeadInfoHeader from '../components/HeaderCard';
import CircleIcon from '@mui/icons-material/Circle';

const SERVICE_INSPECTION_ID = process.env.NEXT_PUBLIC_SERVICE_INSPECTION_ID

function ViewLeadPage({ leadId = null }) {
    const router = useRouter();
    const theme = useTheme();
    const [lead, setLead] = useState(null);
    const [loadingLeads, setLoadingLeads] = useState(true);
    const { enqueueSnackbar } = useSnackbar();
    const [proposals, setProposals] = useState([]);

    const [lastInspetion, setLastInspetion] = useState(null);

    const proposalStatus = {
        "A": { label: "Aceita", color: "#E9F9E6" },
        "R": { label: "Recusada", color: "#FEEFEE" },
        "P": { label: "Pendente", color: "#FFF7E5" },
    };



    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const data = await ProposalService.getProposals({
                    params: {
                        lead: leadId,
                    },
                });
                setProposals(data.results);
            } catch (err) {
                enqueueSnackbar('Não foi possível carregar as propostas', { variant: 'error' });
            }
        }
        fetchProposals();


        const fetchLead = async () => {
            setLoadingLeads(true);
            try {
                const data = await leadService.getLeadById(leadId, {
                    params: {
                        expand: 'schedules',
                    }
                });
                setLead(data);
                setLastInspetion(data.schedules.filter(i => i.service.id === parseInt(SERVICE_INSPECTION_ID)).sort((a, b) => new Date(b.schedule_date) - new Date(a.schedule_date))[0]);
                console.log(data);
            } catch (err) {
                enqueueSnackbar('Não foi possível carregar o lead', { variant: 'error' });
            } finally {
                setLoadingLeads(false);
            }
        }
        fetchLead();

    }, []);

    console.log('lastInspetion:', lastInspetion);

    return (
        <Grid container spacing={0}>
            <Grid item xs={12} md={8} sx={{ padding: '0px 10px 10px 10px' }}>
                <BlankCard 
                    sx={{ 
                        borderRadius: "20px", 
                        boxShadow: 3, 
                        p: 3, 
                        display: 'flex', 
                        justifyContent: 'center', 
                        flexDirection: 'column' 
                    }}
                >
                    <Grid container spacing={2} alignItems="center" sx={{ width: "100%" }}>
                        <Grid item xs={12}>
                            <Box 
                                sx={{ 
                                    borderRadius: '20px', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    width: "100%" 
                                }}
                            >
                                <LeadInfoHeader leadId={leadId} tabValue={10} />
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{ p: 3.5 }}>
                        <Typography gutterBottom sx={{ color: '#7E8388', fontSize: '14px', fontWeight: "400", color: "#ADADAD" }}>
                            Agendamento
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mt: 1.5,
                                flexDirection: { xs: 'column', md: 'row' }, // Responsivo: coluna em telas pequenas, linha em telas maiores
                                textAlign: { xs: 'center', md: 'left' }, // Centraliza o texto em telas pequenas
                            }}
                        >
                            <IconCalendarWeek size={28} style={{ verticalAlign: 'middle', color: "#303030" }} />
                            <Typography sx={{ color: '#000000', fontSize: '24px', fontWeight: "400", color: "#303030" }}>
                                Vistoria técnica{' '}
                                <Box
                                    component="span"
                                    sx={{
                                        fontWeight: '700',
                                        fontSize: '24px',
                                        marginLeft: { xs: 0, sm: 1 },
                                        whiteSpace: 'nowrap', // Impede que a data e hora quebrem
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    {lastInspetion && lastInspetion.schedule_date && lastInspetion.schedule_start_time ? (
                                            <>
                                                {new Date(lastInspetion.schedule_date).toLocaleDateString('pt-BR')} 
                                                <CircleIcon sx={{ fontSize: "8px"}} /> 
                                                {lastInspetion.schedule_start_time}
                                            </>
                                        )
                                            
                                        : ('Não há agendamento')}

                                </Box>
                            </Typography>
                        </Box>
                    </Box>
                    <Divider sx={{ my: 0 }} />

                    <Grid container spacing={6} sx={{ p: 3.5 }}>
                        <Grid item xs={12} md={4} >
                            <Typography variant="body1" gutterBottom sx={{ color: '#7E8388', fontSize: '14px' }}>
                                CPF
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ color: '#000000', fontSize: '14px' }}>
                                {lead?.first_document || '-'}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4} >
                            <Typography variant="body1" gutterBottom sx={{ color: '#7E8388', fontSize: '14px' }}>
                                Fone
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ color: '#000000', fontSize: '14px' }}>
                                {formatPhoneNumber(lead?.phone)}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4} >
                            <Typography variant="body1" gutterBottom sx={{ color: '#7E8388', fontSize: '14px' }}>
                                E-mail
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ color: '#000000', fontSize: '14px' }}>
                                {lead?.contact_email || '-'}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4} >
                            <Typography variant="body1" gutterBottom sx={{ color: '#7E8388', fontSize: '14px' }}>
                                Endereço
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ color: '#000000', fontSize: '14px' }}>
                                {lead?.addresses[0]?.street || '-'}, {lead?.addresses[0]?.number || '-'}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4} >
                            <Typography variant="body1" gutterBottom sx={{ color: '#7E8388', fontSize: '14px' }}>
                                Origem/Campanha
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ color: '#000000', fontSize: '14px' }}>
                                {lead?.origin?.name || '-'} / -
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4} >
                            <Typography variant="body1" gutterBottom sx={{ color: '#7E8388', fontSize: '14px' }}>
                                kWp
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ color: '#000000', fontSize: '14px' }}>
                                {lead?.kwp || '-'}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4} >
                            <Typography variant="body1" gutterBottom sx={{ color: '#7E8388', fontSize: '14px' }}>
                                Responsável
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ color: '#000000', fontSize: '14px' }}>
                                -
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={8} >
                            <Typography variant="body1" gutterBottom sx={{ color: '#7E8388', fontSize: '14px' }}>
                                Observações
                            </Typography>
                            <Typography variant="body1" gutterBottom sx={{ color: '#303030', fontSize: '14px' }}>
                                -
                            </Typography>
                        </Grid>
                    </Grid>
                </BlankCard>
            </Grid>

            <Grid item xs={12} md={4} sx={{ padding: '0px 10px 10px 10px' }}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <Typography variant="h6" gutterBottom sx={{ fontSize: 18, fontWeight: 700 }}>
                            Propostas
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ fontSize: 14, color: '#7E92A2' }}>
                            Última proposta enviada
                        </Typography>
                    </Grid>

                    {proposals.length > 0 && (
                        <Grid item>
                            <ProposalCard
                                image="https://cdn-icons-png.flaticon.com/512/5047/5047881.png"
                                price={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposals[0].value)}
                                status={proposalStatus[proposals[0].status]?.label}
                                statusColor={proposalStatus[proposals[0].status]?.color}
                                description={proposals[0].description}
                                reference={`Validate: ${proposals[0].due_date}`}
                                onEdit={() => console.log('Editar')}
                                onDelete={() => console.log('Deletar')}
                            />
                        </Grid>
                    )}

                    {proposals.length > 1 && (
                        <Grid item>
                            <Typography variant="body1" gutterBottom sx={{ fontSize: 14, color: '#7E92A2' }}>
                                Outras propostas
                            </Typography>
                        </Grid>
                    )}

                    {proposals.slice(1).map((proposal, index) => (
                        <Grid item key={index}>
                            <ProposalCard
                                image="https://cdn-icons-png.flaticon.com/512/5047/5047881.png"
                                price={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.value)}
                                status={proposalStatus[proposal.status]?.label}
                                statusColor={proposalStatus[proposal.status]?.color}
                                description={proposal.description}
                                reference={`Validate: ${proposal.due_date}`}
                                onEdit={() => console.log('Editar')}
                                onDelete={() => console.log('Deletar')}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Grid>

        </Grid >
    );
}

export default ViewLeadPage;
