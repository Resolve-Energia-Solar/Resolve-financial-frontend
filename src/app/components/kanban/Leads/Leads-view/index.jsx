'use client';
import { Grid, Typography, Chip, Divider, Box, Rating, useTheme, IconButton, Card } from '@mui/material';
import { AccountCircle, CalendarToday, CalendarViewWeek, WbSunny } from '@mui/icons-material';
import BlankCard from '@/app/components/shared/BlankCard';
import { IconCalendarWeek, IconEye, IconPencil, IconTrash } from '@tabler/icons-react';
import MediaControlCard from '../../components/CardProposal';

function ViewLeadPage({ leadId = null }) {
    const theme = useTheme();

    return (
        <Grid container spacing={3} sx={{ p: 2 }}>
            <Grid item xs={12} md={8}>
                <BlankCard sx={{ borderRadius: "20px", boxShadow: 3, p: 0, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                    <Grid container spacing={2} alignItems="center" sx={{ p: 3 }}>
                        <Grid item xs={12} md={5} container alignItems="center" spacing={2}>
                            <Grid item>
                                <AccountCircle sx={{ fontSize: 62 }} />
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" gutterBottom sx={{ fontSize: 12, color: '#ADADAD' }}>
                                    Cliente
                                </Typography>
                                <Typography variant="h6" gutterBottom sx={{ fontSize: 16 }}>
                                    Marília Leal da Cunha
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
                                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Typography variant="body1" gutterBottom sx={{ fontSize: 12, color: '#ADADAD' }}>
                                        Nível de interesse
                                    </Typography>
                                    <Rating
                                        name="qualification"
                                        value={0}
                                        max={5}
                                        size="small"
                                        sx={{ ml: 1 }}
                                        icon={<WbSunny fontSize="inherit" sx={{ color: theme.palette.warning.main }} />}
                                        emptyIcon={
                                            <WbSunny fontSize="inherit" sx={{ color: theme.palette.action.disabled }} />
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Typography variant="body1" gutterBottom sx={{ fontSize: 12, color: '#ADADAD' }}>
                                        Status
                                    </Typography>
                                    <Chip label="Contrato" size="small" sx={{ width: '100%', p: 2, backgroundColor: 'transparent', border: '1px solid #FFC107', color: '#ADADAD' }} />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <IconButton
                                        size="small"
                                    // onClick={() => onClick(item, 'edit')}
                                    >
                                        <IconPencil fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                    // onClick={() => router.push(`/apps/leads/${item.id}/view`)}
                                    >
                                        <IconTrash fontSize="small" />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 0 }} />
                    <Box sx={{ p: 3.5 }}>
                        <Typography variant="body1" gutterBottom sx={{ color: '#7E8388', fontSize: '14px' }}>
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
                            <IconCalendarWeek size={28} style={{ verticalAlign: 'middle' }} />
                            <Typography variant="p" sx={{ color: '#000000', fontSize: '24px' }}>
                                Vistoria técnica{' '}
                                <Box
                                    component="span"
                                    sx={{
                                        fontWeight: 'bold',
                                        fontSize: '24px',
                                        marginLeft: { xs: 0, sm: 1 },
                                        whiteSpace: 'nowrap', // Impede que a data e hora quebrem
                                    }}
                                >
                                    11/02/2025 • 14h
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
                                001.008.003-24
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4} >
                            <Typography variant="body1" gutterBottom sx={{ color: '#7E8388', fontSize: '14px' }}>
                                Fone
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ color: '#000000', fontSize: '14px' }}>
                                (91) 99377-8899
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4} >
                            <Typography variant="body1" gutterBottom sx={{ color: '#7E8388', fontSize: '14px' }}>
                                E-mail
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ color: '#000000', fontSize: '14px' }}>
                                mariliale@gmail.com
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4} >
                            <Typography variant="body1" gutterBottom sx={{ color: '#7E8388', fontSize: '14px' }}>
                                Endereço
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ color: '#000000', fontSize: '14px' }}>
                                Rua Antônio Barreto, 1523
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4} >
                            <Typography variant="body1" gutterBottom sx={{ color: '#7E8388', fontSize: '14px' }}>
                                Origem/Campanha
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ color: '#000000', fontSize: '14px' }}>
                                Facebook / Dia da Mulher
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4} >
                            <Typography variant="body1" gutterBottom sx={{ color: '#7E8388', fontSize: '14px' }}>
                                kWp
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ color: '#000000', fontSize: '14px' }}>
                                250
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4} >
                            <Typography variant="body1" gutterBottom sx={{ color: '#7E8388', fontSize: '14px' }}>
                                Responsável
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ color: '#000000', fontSize: '14px' }}>
                                Beatriz Silva
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={8} >
                            <Typography variant="body1" gutterBottom sx={{ color: '#7E8388', fontSize: '14px' }}>
                                Observações
                            </Typography>
                            <Typography variant="p" gutterBottom sx={{ color: '#303030', fontSize: '14px' }}>
                                At risus viverra adipiscing at in tellus. Blandit massa enim nec dui nunc mattis. Lacus vel facilisis volutpat est velit.
                            </Typography>
                        </Grid>
                    </Grid>
                </BlankCard>
            </Grid>

            <Grid item xs={12} md={4}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <Typography variant="h6" gutterBottom sx={{ fontSize: 18, fontWeight: 700 }}>
                            Propostas
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ fontSize: 14, color: '#7E92A2' }}>
                            Última proposta enviada
                        </Typography>
                    </Grid>

                    <Grid item>
                        <MediaControlCard />
                    </Grid>

                    <Grid item>
                        <Typography variant="body1" gutterBottom sx={{ fontSize: 14, color: '#7E92A2' }}>
                            Outras propostas
                        </Typography>
                    </Grid>

                    <Grid item>
                        <MediaControlCard />
                    </Grid>

                    <Grid item>
                        <MediaControlCard />
                    </Grid>
                </Grid>
            </Grid>

        </Grid>
    );
}

export default ViewLeadPage;
