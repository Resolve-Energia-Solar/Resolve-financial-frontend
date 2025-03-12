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
import { color } from 'framer-motion';

function AddProposalPage({ leadId = null, onRefresh = null, onClose = null }) {
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
    handleChange('proposal_description', '');
  };


  useEffect(() => {
    if (success) {
      enqueueSnackbar('Proposta gerada com sucesso', { variant: 'success' });
      discard_proposal();
    }
  }, [success]);


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


  const handleSaveForm = async () => {
    const response = await handleSave();
    if (response) {
      enqueueSnackbar('Agendamento salvo com sucesso', { variant: 'success' });
      if (onRefresh) onRefresh();
      if (onClose) onClose();
    } else {
      enqueueSnackbar('Erro ao salvar agendamento', { variant: 'error' });
      console.log('Form Errors:', formErrors);
    }
  }

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sx={{ overflow: 'scroll' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* HEEEEEEEEEEEEADER */}
          <Grid item spacing={2} alignItems="center" xs={12}>
            <LeadInfoHeader leadId={leadId} />
          </Grid>

          <Grid container spacing={4}>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flexDirection: 'column', marginTop: 2 }}
            >
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{color: "#000000", fontWeight: "700", fontSize: "18px"}}>Nova proposta</Typography>
              </Grid>

              {/* first row */}
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="proposal_name" sx={{color: "#092C4C", fontWeight: "700", fontSize: "14px"}}>Nome da Proposta</CustomFormLabel>
                  <TextField
                    select
                    name="proposal_name"
                    value={formData.proposal_name}
                    onChange={(e) => handleChange('proposal_name', e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="K1">Kit Solar 2034</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="amount" sx={{color: "#092C4C", fontWeight: "700", fontSize: "14px"}}>Valor da proposta</CustomFormLabel>
                  <TextField
                    name="amount"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ color: "#7E92A2", fontWeight: "400", fontSize: "12px" }}>
                            R$
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* add consumo energético dialog boz right here */}
              </Grid>

              {/* new row with geração de energia estimada and consumo médio */}
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="estimated_power_generation" sx={{color: "#092C4C", fontWeight: "700", fontSize: "14px"}}>Geração de energia estimada</CustomFormLabel>
                    <TextField
                      name="estimated_power_generation"
                      value={formData.estimated_power_generation}
                      onChange={(e) => handleChange('estimated_power_generation', e.target.value)}
                      fullWidth
                      placeholder='2500 kWh'
                    />
                </Grid>

                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="medium_energy_val" sx={{color: "#092C4C", fontWeight: "700", fontSize: "14px"}}>Consumo médio de energia</CustomFormLabel>
                  <TextField
                    name="medium_energy_val"
                    value={formData.medium_energy_val}
                    onChange={(e) => handleChange('medium_energy_val', e.target.value)}
                    fullWidth
                    placeholder='1800 kWh'
                  />
                </Grid>
              </Grid>


              {/* second row */}
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="ref_amount" sx={{color: "#092C4C", fontWeight: "700", fontSize: "14px"}}>Valor de referência</CustomFormLabel>
                  <TextField
                    name="ref_amount"
                    value={formData.ref_amount}
                    onChange={(e) => handleChange('ref_amount', e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ color: "#7E92A2", fontWeight: "400", fontSize: "12px" }}>
                            R$
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="entry_amount" sx={{color: "#092C4C", fontWeight: "700", fontSize: "14px"}}>Valor de entrada</CustomFormLabel>
                  <TextField
                    name="entry_amount"
                    value={formData.entry_amount}
                    onChange={(e) => handleChange('entry_amount', e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ color: "#7E92A2", fontWeight: "400", fontSize: "12px" }}>
                            R$
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              {/* third row */}
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="payment_method" sx={{color: "#092C4C", fontWeight: "700", fontSize: "14px"}}>Forma de pagamento</CustomFormLabel>
                  <TextField
                    select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={(e) => handleChange('payment_method', e.target.value)}
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
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="financing_type" sx={{color: "#092C4C", fontWeight: "700", fontSize: "14px"}}>Financiadoras</CustomFormLabel>
                  <TextField
                    select
                    name="financing_type"
                    value={formData.financing_type}
                    onChange={(e) => handleChange('financing_type', e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="2">Moon</MenuItem>
                    <MenuItem value="3">Sun</MenuItem>
                  </TextField>
                </Grid>
              )}

              {formData.payment_method === 'credit' && (
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="installments_num" sx={{color: "#092C4C", fontWeight: "700", fontSize: "14px"}}>Parcelas</CustomFormLabel>
                  <TextField
                    select
                    name="installments_num"
                    value={formData.installments_num}
                    onChange={(e) => handleChange('installments_num', e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="2">2x</MenuItem>
                    <MenuItem value="3">3x</MenuItem>
                    <MenuItem value="4">4x</MenuItem>
                  </TextField>
                </Grid>
              )}

              {/* fourth row */}
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="seller_id" sx={{color: "#092C4C", fontWeight: "700", fontSize: "14px"}}>Vendedor Responsável</CustomFormLabel>
                  <TextField
                    select
                    name="seller_id"
                    value={formData.seller_id}
                    onChange={(e) => handleChange('seller_id', e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="F">Fulano</MenuItem>
                    <MenuItem value="C">Ciclano</MenuItem>
                    <MenuItem value="B">Beltrano</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="proposal_validity" sx={{color: "#092C4C", fontWeight: "700", fontSize: "14px"}}>
                    Validade da proposta
                  </CustomFormLabel>
                  <TextField
                    name="proposal_validity"
                    value={formData.proposal_validity}
                    onChange={(e) => handleChange('proposal_validity', e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>

              {/* fifth row */}
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="description" sx={{color: "#092C4C", fontWeight: "700", fontSize: "14px"}}>Descrição</CustomFormLabel>
                  <CustomTextArea
                    name="proposal_description"
                    multiline
                    rows={4}
                    minRows={3}
                    value={formData.proposal_description}
                    onChange={(e) => handleChange('proposal_description', e.target.value)}
                    {...(formErrors.proposal_description && { error: true, helperText: formErrors.proposal_description })}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* RIIIIIIIIIIIIIIIIIIIGHT */}
            <Grid
              item
              xs={12}
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
              justifyContent: 'end',
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

              <Button variant="contained" sx={{ backgroundColor: theme.palette.primary.Button, color: '#303030', px: 3 }} onClick={handleSaveForm} disabled={formLoading}
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

export default AddProposalPage;
