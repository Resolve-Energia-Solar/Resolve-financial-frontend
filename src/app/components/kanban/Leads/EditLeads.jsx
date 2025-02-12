import { Grid, Typography, Chip, InputAdornment } from '@mui/material';
import { AccountCircle, Phone, Email } from '@mui/icons-material';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import leadService from '@/services/leadService';
import { useEffect, useState } from 'react';

function EditLead({ leadId = null }) {
    const [lead, setLead] = useState(null);

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const response = await leadService.getLeadById(leadId);
                console.log(response);
                setLead(response);
            } catch (error) {
                console.error(error);
            }
        }

        fetchLead();
    }, []);

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
                            {lead?.name}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={6} container justifyContent="flex-end" alignItems="center">
                    <Chip label={`Criado em: ${new Date(lead?.created_at).toLocaleString('pt-BR')}`} sx={{ backgroundColor: '#F4F5F7', color: '#7E8388' }} />
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
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ mr: 0 }}>
                                    <AccountCircle />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CustomFormLabel htmlFor="cpf">CPF/CNPJ</CustomFormLabel>
                    <CustomTextField
                        name="cpf"
                        placeholder="008.123.456-78"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ mr: 0 }}>
                                    <AccountCircle />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CustomFormLabel htmlFor="phone">Telefone com DDD</CustomFormLabel>
                    <CustomTextField
                        name="phone"
                        placeholder="(91) 99999-9999"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ mr: 0 }}>
                                    <Phone />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CustomFormLabel htmlFor="email">E-mail</CustomFormLabel>
                    <CustomTextField
                        name="email"
                        placeholder="example.resolve@gmail.com"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ mr: 0 }}>
                                    <Email />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}

export default EditLead;
