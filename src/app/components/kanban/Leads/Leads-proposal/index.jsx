'use client';
import { Grid, Typography, Chip, Divider, Box, Rating, useTheme, IconButton, Card, MenuItem, InputAdornment, TextField } from '@mui/material';
import { AccountCircle, CalendarToday, CalendarViewWeek, Description, Email, Phone, WbSunny } from '@mui/icons-material';
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
        proposal_name: '',
        amount: '',
        ref_amount: '',
        entry_amount: '',
        payment_method: '',
        financing_type: '',
        seller_id: '',
        proposal_validity: '',
        proposal_status: '',
        description: '',
        created_at: '',
        installments_num: ''

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
                            <CustomFormLabel htmlFor="proposal_name">Nome da Proposta</CustomFormLabel>
                            {/* <TextField name="name" value={formData.name} onChange={handleChange} fullWidth
                                InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircle /></InputAdornment>) }} /> */}
                                <TextField select name="proposal_name"value={formData.proposal_name} onChange={handleChange} fullWidth>
                                <MenuItem value="K1">Kit Solar 2034</MenuItem>
                                {/* <MenuItem value=""></MenuItem> */}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <CustomFormLabel htmlFor="amount">Valor da proposta</CustomFormLabel>
                            <TextField name="amount"value={formData.amount} onChange={handleChange} fullWidth
                                InputProps={{ startAdornment: (<InputAdornment position="start">R$</InputAdornment>) }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <CustomFormLabel htmlFor="ref_amount">Valor da referência</CustomFormLabel>
                            <TextField name="ref_amount"value={formData.ref_amount} onChange={handleChange} fullWidth
                                InputProps={{ startAdornment: (<InputAdornment position="start">R$</InputAdornment>) }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <CustomFormLabel htmlFor="entry_amount">Valor de entrada</CustomFormLabel>
                            <TextField name="entry_amount"value={formData.entry_amount} onChange={handleChange} fullWidth
                                InputProps={{ startAdornment: (<InputAdornment position="start">R$</InputAdornment>) }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <CustomFormLabel htmlFor="payment_method">Forma de pagamento</CustomFormLabel>
                            <TextField select name="payment_method" value={formData.payment_method} onChange={handleChange} fullWidth>
                                <MenuItem value="credit">Crédito</MenuItem>
                                <MenuItem value="debit">Débito</MenuItem>
                                <MenuItem value="bank_slip">Boleto</MenuItem>
                                <MenuItem value="financing">Financiamento</MenuItem>
                                <MenuItem value="internal_installments">Parcelamento Interno</MenuItem>
                                <MenuItem value="pix">Pix</MenuItem>
                                <MenuItem value="bank_transfer">Transferência</MenuItem>
                                <MenuItem value="cash">Dinheiro</MenuItem>
                                <MenuItem value="auxiliar">Poste Auxiliar</MenuItem>
                                <MenuItem value="construction">Repasse de Obra</MenuItem>
                                </TextField>
                        </Grid>

                        {formData.payment_method === 'financing' && (
                            <Grid item xs={12} sm={6}>
                                <CustomFormLabel htmlFor="financing_type">Financiadoras</CustomFormLabel>
                                <TextField select name="financing_type" value={formData.financing_type} onChange={handleChange} fullWidth>
                                    <MenuItem value="2">2x</MenuItem>
                                    <MenuItem value="3">3x</MenuItem>
                                </TextField>
                            </Grid>
                        )}

                        {formData.payment_method === 'credit' && (
                            <Grid item xs={12} sm={6}>
                                <CustomFormLabel htmlFor="installments_num">Parcelas</CustomFormLabel>
                                <TextField select name="installments_num" value={formData.installments_num} onChange={handleChange} fullWidth>
                                    <MenuItem value="2">2x</MenuItem>
                                    <MenuItem value="3">3x</MenuItem>
                                    <MenuItem value="4">4x</MenuItem>
                                    <MenuItem value="5">5x</MenuItem>
                                    <MenuItem value="6">6x</MenuItem>
                                </TextField>
                            </Grid>
                        )}

                        <Grid item xs={12} sm={6}>
                            <CustomFormLabel htmlFor="seller_id">Vendedor Resonsável</CustomFormLabel>
                            <TextField select name="seller_id" value={formData.seller_id} onChange={handleChange} fullWidth>
                                <MenuItem value="F">Fulano</MenuItem>
                                <MenuItem value="C">Ciclano</MenuItem>
                                <MenuItem value="B">Beltrano</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <CustomFormLabel htmlFor="proposal_validity">Validade da proposta</CustomFormLabel>
                            <TextField name="proposal_validity" value={formData.proposal_validity} onChange={handleChange} fullWidth/>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <CustomFormLabel htmlFor="description">Descrição</CustomFormLabel>
                            <TextField name="description" value={formData.description} onChange={handleChange} fullWidth/>
                        </Grid>

                    </Grid>
                </BlankCard>
            </Grid>
        </Grid>
    );
}

export default LeadProposalPage;
