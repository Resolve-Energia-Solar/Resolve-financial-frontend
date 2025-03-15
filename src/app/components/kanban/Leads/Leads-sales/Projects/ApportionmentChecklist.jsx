'use client';
import { Grid, Typography, Chip, Divider, Box, Rating, useTheme, IconButton, Card, MenuItem, InputAdornment, TextField, Checkbox, Radio, Button, CircularProgress } from '@mui/material';
import { Email, Person } from '@mui/icons-material';
import BlankCard from '@/app/components/shared/BlankCard';
import { useEffect, useState } from 'react';
import leadService from '@/services/leadService';
import { useSnackbar } from 'notistack';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import LeadInfoHeader from '../components/HeaderCard';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import useUser from '@/hooks/users/useUser';
import useUserForm from '@/hooks/users/useUserForm';

function ApportionmentChecklist({ leadId = null }) {
    const [lead, setLead] = useState(null);
    const [customerId, setCustomerId] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const data = await leadService.getLeadById(leadId, {
                    params: {
                        fields: 'id,customer,name,first_document,contact_email',
                    },
                })
                setLead(data);
                setCustomerId(data?.customer?.id);
            } catch (err) {
                enqueueSnackbar('Não foi possível carregar o lead', { variant: 'error' });
            }
        };
        fetchLead();
    }, [leadId]);


    const { loading, error, userData } = useUser(customerId);

    const {
        formData,
        handleChange,
        handleSave,
        formErrors,
        loading: formLoading,
        dataReceived,
        success,
    } = useUserForm(userData, customerId);

    formData.complete_name ? (formData.complete_name = formData.complete_name) : (formData.complete_name = lead?.name);
    formData.first_document ? (formData.first_document = formData.first_document) : (formData.first_document = lead?.first_document);
    formData.email ? (formData.email = formData.email) : (formData.email = lead?.contact_email);
    formData.phone_numbers_ids = []


    const handleSaveCustomer = async () => {
        const response = await handleSave(formData);
        if (response) {
            associateCustomerToLead(dataReceived.id);
            enqueueSnackbar('Cliente salvo com sucesso', { variant: 'success' });
        }
    };

    const associateCustomerToLead = async (customerId) => {
        try {
            await leadService.patchLead(leadId, { customer: customerId });
        } catch (err) {
            enqueueSnackbar('Não foi possível associar o cliente ao lead', { variant: 'error' });
        }
    }

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
                                fullWidth
                                value={formData.complete_name}
                                onChange={(e) => handleChange('complete_name', e.target.value)}
                                {...(formErrors.complete_name && { error: true, helperText: formErrors.complete_name })}
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
                                fullWidth
                                value={formData.first_document}
                                onChange={(e) => handleChange('first_document', e.target.value)}
                                {...(formErrors.first_document && {
                                    error: true,
                                    helperText: formErrors.first_document,
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CustomFormLabel htmlFor="contact_email">E-mail</CustomFormLabel>
                            <TextField
                                name="contact_email"
                                fullWidth
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                {...(formErrors.email && { error: true, helperText: formErrors.email })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} lg={4}>
                            <FormDate
                                label="Data de Nascimento"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={(newValue) => handleChange('birth_date', newValue)}
                                {...(formErrors.birth_date && { error: true, helperText: formErrors.birth_date })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={4}>
                            <FormSelect
                                label="Gênero"
                                options={[
                                    { value: 'M', label: 'Masculino' },
                                    { value: 'F', label: 'Feminino' },
                                    { value: 'O', label: 'Outro' },
                                ]}
                                value={formData.gender}
                                onChange={(e) => handleChange('gender', e.target.value)}
                                {...(formErrors.gender && { error: true, helperText: formErrors.gender })}
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
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CustomFormLabel htmlFor="logradouro">Logradouro</CustomFormLabel>
                            <TextField
                                name="logradouro"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CustomFormLabel htmlFor="numero">Nº</CustomFormLabel>
                            <TextField
                                name="numero"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <CustomFormLabel htmlFor="complemento">Complemento</CustomFormLabel>
                            <TextField
                                name="complemento"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <CustomFormLabel htmlFor="bairro">Bairro</CustomFormLabel>
                            <TextField
                                name="bairro"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <CustomFormLabel htmlFor="cidade">Cidade</CustomFormLabel>
                            <TextField
                                name="cidade"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <CustomFormLabel htmlFor="estado">Estado</CustomFormLabel>
                            <TextField
                                name="estado"
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
                                disabled={formLoading}
                                endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
                                onClick={handleSaveCustomer}
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

export default ApportionmentChecklist;