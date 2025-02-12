'use client';
import { Grid, Typography, Chip } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';

function EditLead({ leadId }) {
    return (
        <Grid container spacing={3} sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center" sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}>
                <Grid item xs={6} container alignItems="center" spacing={3}>
                    <Grid item>
                        <AccountCircle sx={{ fontSize: 70 }} />
                    </Grid>
                    <Grid item>
                        <Typography variant="body1" gutterBottom>
                            Cliente
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Matheus Barbosa de Almeida Macias
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={6} container justifyContent="flex-end" alignItems="center">
                    <Chip label="Última atualização: 10/02/2025 10h24" />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <CustomFormLabel htmlFor="name">Nome Completo</CustomFormLabel>
                    <CustomTextField
                        name="name"
                        placeholder="Nome"
                        variant="outlined"
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CustomFormLabel htmlFor="name">CPF/CNPJ</CustomFormLabel>
                    <CustomTextField
                        name="name"
                        placeholder="Nome"
                        variant="outlined"
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CustomFormLabel htmlFor="name">Telefone com DDD</CustomFormLabel>
                    <CustomTextField
                        name="name"
                        placeholder="Nome"
                        variant="outlined"
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CustomFormLabel htmlFor="name">E-mail</CustomFormLabel>
                    <CustomTextField
                        name="name"
                        placeholder="Nome"
                        variant="outlined"
                        fullWidth
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}

export default EditLead;
