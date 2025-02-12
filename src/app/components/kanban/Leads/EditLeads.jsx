import { Grid, Typography, Chip, InputAdornment, Button } from '@mui/material';
import { AccountCircle, Phone, Email } from '@mui/icons-material';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import leadService from '@/services/leadService';
import { useEffect } from 'react';
import AutoCompleteOrigin from '../../apps/leads/auto-input-origin';
import FormSelect from '../../forms/form-custom/FormSelect';
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from 'notistack';

function EditLead({ leadId = null }) {

    const { enqueueSnackbar } = useSnackbar();


    const {
        register,
        handleSubmit,
        control,
        setValue,
        getValues,
        formState: { errors },
        setError } = useForm({
            defaultValues: {
                name: '',
                type: '',
                funnel: '',
                origin_id: '',
                first_document: '',
                phone: '',
                contact_email: ''
            }
        });



    useEffect(() => {
        const fetchLead = async () => {
            try {
                const response = await leadService.getLeadById(leadId);

                Object.keys(getValues()).forEach(key => {
                    setValue(key, response[key]);
                });
            } catch (error) {
                console.error(error);
            }
        };

        if (leadId) {
            fetchLead();
        }
    }, [leadId, setValue]);

    const onSubmit = async data => {
        console.log('Dados enviados:', data);
        try {
            await leadService.patchLead(leadId, data);
            enqueueSnackbar('Lead atualizado com sucesso', { variant: 'success' });
        } catch (error) {
            const formErrors = error?.response?.data || {};
            Object.entries(formErrors).forEach(([key, value]) => {
                setError(key, { type: 'manual', message: value.join(' ') });
                enqueueSnackbar(`${key}: ${value.join(' ')}`, { variant: 'error' });
            });
        }
    };
    

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
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Typography variant="h6" gutterBottom>
                                    {field.value}
                                </Typography>
                            )}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={6} container justifyContent="flex-end" alignItems="center">
                    <Chip
                        label={
                            <Controller
                                name="created_at"
                                control={control}
                                render={({ field }) =>
                                    field.value ? `Criado em: ${new Date(field.value).toLocaleString('pt-BR')}` : ''
                                }
                            />
                        }
                        sx={{ backgroundColor: '#F4F5F7', color: '#7E8388' }}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <CustomFormLabel htmlFor="name">Nome Completo</CustomFormLabel>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                placeholder="Nome"
                                variant="outlined"
                                size="normal"
                                fullWidth
                                {...(errors.name && { error: true, helperText: errors.name.message })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ mr: 0 }}>
                                            <AccountCircle />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            
                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <FormSelect
                                label="Tipo"
                                {...(errors.type && { error: true, helperText: errors.type.message })}
                                options={[
                                    { value: 'PF', label: 'Pessoa Física' },
                                    { value: 'PJ', label: 'Pessoa Jurídica' },
                                ]}
                                {...field}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Controller
                        name="funnel"
                        control={control}
                        render={({ field }) => (
                            <FormSelect
                                label="Funil"
                                options={[
                                    { value: 'N', label: 'Não Interessado' },
                                    { value: 'P', label: 'Pouco Interessado' },
                                    { value: 'I', label: 'Interessado' },
                                    { value: 'M', label: 'Muito Interessado' },
                                    { value: 'PC', label: 'Pronto para Comprar' },
                                ]}
                                {...field}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CustomFormLabel htmlFor="origin_id">Origem</CustomFormLabel>
                    <Controller
                        name="origin_id"
                        control={control}
                        {...(errors.origin_id && { error: true, helperText: errors.origin_id.message })}
                        render={({ field }) => (
                            <AutoCompleteOrigin {...field} />
                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CustomFormLabel htmlFor="first_document">CPF/CNPJ</CustomFormLabel>
                    <Controller
                        name="first_document"
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                placeholder="008.123.456-78"
                                variant="outlined"
                                fullWidth
                                {...(errors.first_document && { error: true, helperText: errors.first_document.message })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ mr: 0 }}>
                                            <AccountCircle />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CustomFormLabel htmlFor="phone">Telefone com DDD</CustomFormLabel>
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                placeholder="(91) 99999-9999"
                                variant="outlined"
                                fullWidth
                                {...(errors.phone && { error: true, helperText: errors.phone.message })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ mr: 0 }}>
                                            <Phone />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <CustomFormLabel htmlFor="contact_email">E-mail</CustomFormLabel>
                    <Controller
                        name="contact_email"
                        control={control}
                        render={({ field }) => (
                            <CustomTextField
                                {...field}
                                placeholder="example.resolve@gmail.com"
                                variant="outlined"
                                fullWidth
                                {...(errors.contact_email && { error: true, helperText: errors.contact_email.message })}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ mr: 0 }}>
                                            <Email />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </Grid>
            </Grid>

            {/* <Button variant="contained" onClick={handleSubmit(onSubmit)}>Salvar</Button> */}
        </Grid>
    );
}

export default EditLead;
