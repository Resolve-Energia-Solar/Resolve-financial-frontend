'use client';
import { Grid, Typography, Chip, Divider, Box, Rating, useTheme, IconButton, Card, MenuItem, InputAdornment, TextField, Checkbox, Radio, Button, CircularProgress } from '@mui/material';
import { AccountCircle, CalendarToday, CalendarViewWeek, Email, Person, Phone, WbSunny } from '@mui/icons-material';
import BlankCard from '@/app/components/shared/BlankCard';
import { IconCalendarWeek, IconEye, IconPencil, IconTrash } from '@tabler/icons-react';
import MediaControlCard from '../../components/CardProposal';
import { useEffect, useState } from 'react';
import leadService from '@/services/leadService';
import formatPhoneNumber from '@/utils/formatPhoneNumber';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteOrigin from '@/app/components/apps/leads/auto-input-origin';
import LeadInfoHeader from '../components/HeaderCard';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import useLead from '@/hooks/leads/useLead';
import useLeadForm from '@/hooks/leads/useLeadtForm';

function EditCustomerPage({ leadId = null }) {
    const router = useRouter();
    const theme = useTheme();
    const [lead, setLead] = useState(null);
    const [loadingLeads, setLoadingLeads] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    const { loading, error, leadData } = useLead(leadId);
    const {
        formData,
        handleChange,
        handleSave,
        loading: formLoading,
        formErrors,
        success,
    } = useLeadForm(leadData, leadId);

    useEffect(() => {
        const fetchLead = async () => {
            setLoadingLeads(true);
            try {
                const data = await leadService.getLeadById(leadId);
                setLead(data);
                console.log(data);
            } catch (err) {
                enqueueSnackbar('Não foi possível carregar o lead', { variant: 'error' });
            } finally {
                setLoadingLeads(false);
            }
        };
        fetchLead();
    }, [leadId, enqueueSnackbar]);

    const handleSaveLead = async () => {

            enqueueSnackbar('Essa tab está em manutenção', { variant: 'warning' });
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <BlankCard sx={{ borderRadius: '20px', boxShadow: 3, p: 3 }}>
                    {/* Header */}
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12}>
                            <LeadInfoHeader leadId={leadId} />
                        </Grid>
                    </Grid>

                    {/* Dados Pessoais */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#303030' }}>
                                Dados Pessoais
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CustomFormLabel htmlFor="name">Nome Completo</CustomFormLabel>
                            <TextField
                                name="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person sx={{ color: '#ADADAD' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CustomFormLabel htmlFor="first_document">CPF/CNPJ</CustomFormLabel>
                            <TextField
                                name="first_document"
                                value={formData.first_document}
                                onChange={(e) => handleChange('first_document', e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CustomFormLabel htmlFor="contact_email">E-mail</CustomFormLabel>
                            <TextField
                                name="contact_email"
                                value={formData.contact_email}
                                onChange={(e) => handleChange('contact_email', e.target.value)}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    {/* Endereço */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ fontWeight: '400', color: '#303030' }}>
                                Endereço
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CustomFormLabel htmlFor="cep">CEP</CustomFormLabel>
                            <TextField
                                name="cep"
                                value={formData.cep || ''}
                                onChange={(e) => handleChange('cep', e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CustomFormLabel htmlFor="logradouro">Logradouro</CustomFormLabel>
                            <TextField
                                name="logradouro"
                                value={formData.logradouro || ''}
                                onChange={(e) => handleChange('logradouro', e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CustomFormLabel htmlFor="numero">Nº</CustomFormLabel>
                            <TextField
                                name="numero"
                                value={formData.numero || ''}
                                onChange={(e) => handleChange('numero', e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <CustomFormLabel htmlFor="complemento">Complemento</CustomFormLabel>
                            <TextField
                                name="complemento"
                                value={formData.complemento || ''}
                                onChange={(e) => handleChange('complemento', e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <CustomFormLabel htmlFor="bairro">Bairro</CustomFormLabel>
                            <TextField
                                name="bairro"
                                value={formData.bairro || ''}
                                onChange={(e) => handleChange('bairro', e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <CustomFormLabel htmlFor="cidade">Cidade</CustomFormLabel>
                            <TextField
                                name="cidade"
                                value={formData.cidade || ''}
                                onChange={(e) => handleChange('cidade', e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <CustomFormLabel htmlFor="estado">Estado</CustomFormLabel>
                            <TextField
                                name="estado"
                                value={formData.estado || ''}
                                onChange={(e) => handleChange('estado', e.target.value)}
                                fullWidth
                            />
                        </Grid>
                    </Grid>

                    {/* Botão Salvar */}
                    <Grid container spacing={2} sx={{ mt: 4 }}>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: '#FFCC00', color: '#303030', px: 4 }}
                                onClick={handleSaveLead}
                                disabled={formLoading}
                                endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
                            >
                                <Typography variant="body1">
                                    {formLoading ? 'Salvando...' : 'Salvar'}
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </BlankCard>
            </Grid>
        </Grid>
    );
}

export default EditCustomerPage;