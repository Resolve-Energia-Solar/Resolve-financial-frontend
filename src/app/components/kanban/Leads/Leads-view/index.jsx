'use client';
import { Grid, Typography, Chip, Divider } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import BlankCard from '@/app/components/shared/BlankCard';

function ViewLeadPage({ leadId = null }) {
    return (
        <Grid container spacing={3} sx={{ p: 2 }}>
            <BlankCard sx={{ borderRadius: "20px", boxShadow: 3, p: 0, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <Grid container spacing={2} alignItems="center" sx={{ p: 3 }}>
                    <Grid item xs={12} md={6} container alignItems="center" spacing={2}>
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
                    <Grid item xs={12} md={6} container justifyContent="flex-end" alignItems="center">
                        <Chip
                            label={`Criado em: ${new Date().toLocaleString('pt-BR')}`}
                            sx={{ backgroundColor: '#F4F5F7', color: '#7E8388' }}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 0 }} />

                <Grid container spacing={2} sx={{ p: 3.5 }}>
                    <Grid item xs={12} md={6} >
                        <Typography variant="body1" gutterBottom>
                            Telefone
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            (11) 99999-9999
                        </Typography>
                    </Grid>
                </Grid>
            </BlankCard>
        </Grid>
    );
}

export default ViewLeadPage;
