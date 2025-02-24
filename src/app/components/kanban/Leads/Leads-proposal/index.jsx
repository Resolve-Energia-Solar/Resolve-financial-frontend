'use client';
import { Grid, Typography, Chip, Divider, Box, Rating, useTheme, IconButton, Card, MenuItem, InputAdornment, TextField } from '@mui/material';
import { AccountCircle, CalendarToday, CalendarViewWeek, Email, Phone, WbSunny } from '@mui/icons-material';
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

function LeadProposalPage({ leadId = null }) {
    const router = useRouter();
    const theme = useTheme();
    const [lead, setLead] = useState(null);
    const [loadingLeads, setLoadingLeads] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        funnel: '',
        status: '',
        first_document: '',
        interest_level: '',
        reference_amount: '',
        entry_amount: '',
        payment_method: '',
        seller: '',
        proposal_expiration: '',
        description: '',
        created_at: ''
    });

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const response = await leadService.getLeadById(leadId);
                setFormData(response);
            } catch (error) {
                console.error(error);
            }
        };

        if (leadId) fetchLead();
    }, [leadId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

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
        }
        fetchLead();

    }, []);


    return (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <BlankCard sx={{ borderRadius: "20px", boxShadow: 3, p: 0, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                    <Grid container spacing={2} alignItems="center" sx={{ p: 3 }}>
                        <Grid item xs={12} md={5} container alignItems="center" spacing={2}>
                            <Grid item>
                                <AccountCircle sx={{ fontSize: 62 }} />
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" gutterBottom sx={{ fontSize: 12, color: '#ADADAD', margin: 0 }}>
                                    Cliente
                                </Typography>
                                <Typography variant="h6" gutterBottom sx={{ fontSize: 16 }}>
                                    {lead?.name}
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
                                        value={lead?.qualification}
                                        max={5}
                                        readOnly
                                        size="normal"
                                        icon={<WbSunny fontSize="inherit" sx={{ color: theme.palette.warning.main }} />}
                                        emptyIcon={
                                            <WbSunny fontSize="inherit" sx={{ color: theme.palette.action.disabled }} />
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 0 }} />

                    <Grid container spacing={2} sx={{ p: 3.5 }}>

                        <Grid item xs={12} sm={4}>
                            <CustomFormLabel htmlFor="name">Nome Completo</CustomFormLabel>
                            <TextField name="name" value={formData.name} onChange={handleChange} fullWidth
                                InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircle /></InputAdornment>) }} />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <CustomFormLabel htmlFor="name">Tipo</CustomFormLabel>

                            <TextField select name="type"value={formData.type} onChange={handleChange} fullWidth>
                                <MenuItem value="PF">Pessoa Física</MenuItem>
                                <MenuItem value="PJ">Pessoa Jurídica</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <CustomFormLabel htmlFor="funnel">Funil</CustomFormLabel>
                            <TextField select name="funnel" value={formData.funnel} onChange={handleChange} fullWidth>
                                <MenuItem value="N">Não Interessado</MenuItem>
                                <MenuItem value="P">Pouco Interessado</MenuItem>
                                <MenuItem value="I">Interessado</MenuItem>
                                <MenuItem value="M">Muito Interessado</MenuItem>
                                <MenuItem value="PC">Pronto para Comprar</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <CustomFormLabel htmlFor="origin_id">Origem</CustomFormLabel>
                            <AutoCompleteOrigin value={formData.origin_id} onChange={(value) => setFormData({ ...formData, origin_id: value })} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <CustomFormLabel htmlFor="first_document">CPF/CNPJ</CustomFormLabel>
                            <TextField name="first_document" value={formData.first_document} onChange={handleChange} fullWidth />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <CustomFormLabel htmlFor="phone">Telefone com DDD</CustomFormLabel>
                            <TextField name="phone" value={formData.phone} onChange={handleChange} fullWidth
                                InputProps={{ startAdornment: (<InputAdornment position="start"><Phone /></InputAdornment>) }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <CustomFormLabel htmlFor="contact_email">E-mail</CustomFormLabel>
                            <TextField name="contact_email" value={formData.contact_email} onChange={handleChange} fullWidth
                                InputProps={{ startAdornment: (<InputAdornment position="start"><Email /></InputAdornment>) }} />
                        </Grid>

                    </Grid>
                </BlankCard>
            </Grid>
        </Grid>
    );
}

export default EditLeadPage;
