'use client';
import {
  Grid,
  Typography,
  Box,
  useTheme,
  MenuItem,
  InputAdornment,
  TextField,
  CircularProgress,
} from '@mui/material';

import { useEffect, useState } from 'react';
import leadService from '@/services/leadService';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import ProductList from '@/app/components/kanban/Leads/components/ProposalProductsCard';
import LeadInfoHeader from '@/app/components/kanban/Leads/components/HeaderCard';
import Button from "@mui/material/Button";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import useProposalForm from '@/hooks/proposal/useProposalForm';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import CustomFieldMoney from '@/app/components/apps/invoice/components/CustomFieldMoney';
import CustomTextArea from '@/app/components/forms/theme-elements/CustomTextArea';
import { useSelector } from 'react-redux';
import { removeProductFromLead, selectProductsByLead } from '@/store/products/customProducts';
import { useDispatch } from 'react-redux';

function LeadProposalPage({ leadId = null }) {
  const router = useRouter();
  const theme = useTheme();
  const [lead, setLead] = useState(null);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    loading: formLoading,
    success,
  } = useProposalForm();

  const customProducts = useSelector(selectProductsByLead(leadId));

  formData.commercial_products_ids = customProducts.map((product) => product.id);
  formData.lead_id ? null : (formData.lead_id = leadId);
  formData.status ? null : (formData.status = 'P');
  user?.user ? (formData.created_by_id = user.user.id) : null;

  const discard_proposal = () => {
    dispatch(removeProductFromLead({ leadId, productIds: customProducts.map((product) => product.id) }));
    handleChange('due_date', null);
    handleChange('value', null);
    handleChange('observation', '');
  };
  

  useEffect(() => {
    if (success) {
      enqueueSnackbar('Proposta gerada com sucesso', { variant: 'success' });
      discard_proposal();
    }
  }, [success,formErrors]);


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
  }, []);

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sx={{ overflow: 'scroll' }}>
        <Box
          sx={{
            borderRadius: '20px',
            boxShadow: 13,
            p: 3,
            m: 0.1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* HEEEEEEEEEEEEADER */}
          <Grid item spacing={2} alignItems="center" xs={12}>
            <LeadInfoHeader leadId={leadId} />
          </Grid>

          {/* <Divider sx={{ my: 2 }} /> */}

          <Grid container spacing={4}>
            {/* LEEEEEEEEEEEFT */}
            <Grid
              item
              xs={12}
              md={5}
              sx={{ display: 'flex', flexDirection: 'column', marginTop: 2 }}
            >
              <Grid item xs={12} sm={4}>
                <Typography variant="h6">Nova proposta</Typography>
              </Grid>

              {/* first row */}
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="amount">Valor da proposta</CustomFormLabel>
                  <CustomFieldMoney
                    name="value"
                    fullWidth
                    value={formData.value}
                    onChange={(value) => handleChange('value', value)}
                    {...(formErrors.value && { error: true, helperText: formErrors.value })}
                  />
                </Grid>

                <Grid item xs={6}>
                  <FormDate
                    name="due_date"
                    label="Data de Vencimento"
                    value={formData.due_date}
                    onChange={(value) => handleChange('due_date', value)}
                    {...(formErrors.due_date && { error: true, helperText: formErrors.due_date })}
                  />
                </Grid>
              </Grid>

              {/* second row */}
              {/* <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="ref_amount">Valor de referência</CustomFormLabel>
                  <TextField
                    name="ref_amount"
                    value={formData.ref_amount}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="entry_amount">Valor de entrada</CustomFormLabel>
                  <TextField
                    name="entry_amount"
                    value={formData.entry_amount}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
              </Grid> */}

              {/* third row */}
              {/* <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="payment_method">Forma de pagamento</CustomFormLabel>
                  <TextField
                    select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                    fullWidth
                  >
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
              </Grid>

              {formData.payment_method === 'financing' && (
                <>
                  <CustomFormLabel htmlFor="financing_type">Financiadoras</CustomFormLabel>
                  <TextField
                    select
                    name="financing_type"
                    value={formData.financing_type}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value="2">Moon</MenuItem>
                    <MenuItem value="3">Sun</MenuItem>
                  </TextField>
                </>
              )}

              {formData.payment_method === 'credit' && (
                <>
                  <CustomFormLabel htmlFor="installments_num">Parcelas</CustomFormLabel>
                  <TextField
                    select
                    name="installments_num"
                    value={formData.installments_num}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value="2">2x</MenuItem>
                    <MenuItem value="3">3x</MenuItem>
                    <MenuItem value="4">4x</MenuItem>
                  </TextField>
                </>
              )} */}

              {/* fifth row */}
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="description">Descrição</CustomFormLabel>
                  <CustomTextArea
                    name="observation"
                    multiline
                    rows={4}
                    minRows={10}
                    value={formData.observation}
                    onChange={(e) => handleChange('observation', e.target.value)}
                    {...(formErrors.observation && { error: true, helperText: formErrors.observation })}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* RIIIIIIIIIIIIIIIIIIIGHT */}
            <Grid
              item
              xs={12}
              md={7}
              sx={{ display: 'flex', flexDirection: 'column', marginTop: 2, gap: 2 }}
            >
              <ProductList leadId={leadId} />
            </Grid>
          </Grid>

          {/* BUTTONS! */}
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'black',
                color: 'white',
                '&:hover': { backgroundColor: '#333' },
                px: 3,
              }}
            >
              <Typography variant="body1">Pré-visualizar proposta</Typography>
              <VisibilityIcon sx={{ ml: 1 }} />
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" color="error" sx={{ px: 3 }} onClick={discard_proposal}>
                <Typography variant="body1" sx={{ mr: 1 }}>Descartar</Typography>
                <DeleteOutlinedIcon />
              </Button>

              <Button variant="contained" sx={{ backgroundColor: theme.palette.primary.Button, color: '#303030', px: 3 }} onClick={handleSave} disabled={formLoading}
                endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}>
                <Typography variant="body1" color="white">
                  {formLoading ? 'Gerando proposta...' : 'Gerar proposta'}
                </Typography>
              </Button>
            </Box>
          </Grid>

        </Box>
      </Grid>
    </Grid>
  );
}

export default LeadProposalPage;
