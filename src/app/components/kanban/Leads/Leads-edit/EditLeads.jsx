import { useState, useEffect } from 'react';
import { Grid, Typography, Chip, InputAdornment, TextField, MenuItem } from '@mui/material';
import { AccountCircle, Phone, Email } from '@mui/icons-material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import leadService from '@/services/leadService';
import AutoCompleteOrigin from '@/app/components/apps/leads/auto-input-origin';
import { useSnackbar } from 'notistack';

function EditLeadteste({ leadId = null }) {
    const { enqueueSnackbar } = useSnackbar();
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        funnel: '',
        origin_id: '',
        first_document: '',
        phone: '',
        contact_email: '',
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

    const handleSubmit = async () => {
        try {
            await leadService.patchLead(leadId, formData);
            enqueueSnackbar('Lead atualizado com sucesso', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Erro ao atualizar lead', { variant: 'error' });
        }
    };

    return (
        <Grid container spacing={3} sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center" sx={{ borderBottom: '1px solid #e0e0e0', pb: 2 }}>
                <Grid item xs={12} md={6} container alignItems="center" spacing={3}>
                    <Grid item>
                        <AccountCircle sx={{ fontSize: 70 }} />
                    </Grid>
                    <Grid item>
                        <Typography variant="body1">Cliente</Typography>
                        <Typography variant="h6">{formData.name}</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6} container justifyContent="flex-end" alignItems="center">
                    <Chip label={`Criado em: ${new Date(formData.created_at).toLocaleString('pt-BR')}`}
                        sx={{ backgroundColor: '#F4F5F7', color: '#7E8388' }} />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <CustomFormLabel htmlFor="name">Nome Completo</CustomFormLabel>
                    <TextField name="name" value={formData.name} onChange={handleChange} fullWidth
                        InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircle /></InputAdornment>) }} />
                </Grid>

                <Grid item xs={12} sm={4}>
                    <TextField select name="type" label="Tipo" value={formData.type} onChange={handleChange} fullWidth>
                        <MenuItem value="PF">Pessoa Física</MenuItem>
                        <MenuItem value="PJ">Pessoa Jurídica</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <TextField select name="funnel" label="Funil" value={formData.funnel} onChange={handleChange} fullWidth>
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
        </Grid>
    );
}

export default EditLeadteste;
