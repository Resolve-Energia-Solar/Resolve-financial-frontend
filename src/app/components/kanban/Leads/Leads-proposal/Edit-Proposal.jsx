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
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';

import { useEffect, useState } from 'react';
import leadService from '@/services/leadService';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import ProjectCard from '@/app/components/kanban/Leads/components/ProjectSmallListCard';
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
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

function EditProposalPage({ leadId = null, onRefresh = null, onClose = null }) {
  const router = useRouter();
  const theme = useTheme();
  const [lead, setLead] = useState(null);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [openEnergyConsumption, setOpenEnergyConsumption] = useState(false);

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
      enqueueSnackbar('Proposta atualizada com sucesso', { variant: 'success' });
      if (onRefresh) onRefresh();
      if (onClose) onClose();
    } else {
      enqueueSnackbar('Erro ao atualizar proposta', { variant: 'error' });
      console.log('Form Errors:', formErrors);
    }
  }

  const [paymentMethods, setPaymentMethods] = useState([
    { id: Date.now(), method: '', financing_type: '', installments_num: '' }
  ]);

  const handleMethodChange = (id, field, value) => {
    setPaymentMethods((prevMethods) =>
      prevMethods.map((method) =>
        method.id === id ? { ...method, [field]: value } : method
      )
    );
  };

  const addPaymentMethod = () => {
    setPaymentMethods([...paymentMethods, { id: Date.now(), method: '', financing_type: '', installments_num: '' }]);
  };

  const removePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
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
                <Typography variant="h6" sx={{ color: "#000000", fontWeight: "700", fontSize: "18px" }}>Atualizar proposta</Typography>
              </Grid>


              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="proposal_name" sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}>Nome da Proposta</CustomFormLabel>
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
                  <CustomFormLabel htmlFor="amount" sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}>Valor da proposta</CustomFormLabel>
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

                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    onButtonClick={() => setOpenEnergyConsumption(true)}
                    sx={{
                      backgroundColor: '#F4F5F7',
                      color: '#303030',
                      border: "1px solid",
                      borderColor: "#ADADAD",
                      px: 3,
                      width: "483px",
                      justifyContent: "space-between",
                      alignItems: "center",
                      '&:hover': { boxShadow: '0', '& .MuiSvgIcon-root': { color: '#303030' } },
                    }}
                    endIcon={<ManageSearchIcon sx={{ ml: 1, color: "#7E8388" }} />}
                  >
                    <Typography variant="body1">Consumo Energético</Typography>
                  </Button>
                </Grid>
              </Grid>

              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                  <CustomFormLabel
                    htmlFor="estimated_power_generation"
                    sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}
                  >
                    Geração de energia estimada
                  </CustomFormLabel>
                  <TextField
                    name="estimated_power_generation"
                    value={formData.estimated_power_generation}
                    onChange={(e) => handleChange('estimated_power_generation', e.target.value)}
                    fullWidth
                    placeholder="2500 kWh"
                    InputProps={{
                      sx: {
                        input: {
                          '::placeholder': {
                            color: "#7E92A2",
                            fontWeight: "400",
                            fontSize: "12px",
                            opacity: 1,
                          },
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="medium_energy_val" sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}>Consumo médio de energia</CustomFormLabel>
                  <TextField
                    name="medium_energy_val"
                    value={formData.medium_energy_val}
                    onChange={(e) => handleChange('medium_energy_val', e.target.value)}
                    fullWidth
                    placeholder='1800 kWh'
                    InputProps={{
                      sx: {
                        input: {
                          '::placeholder': {
                            color: "#7E92A2",
                            fontWeight: "400",
                            fontSize: "12px",
                            opacity: 1,
                          },
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>


              <Grid container rowSpacing={1} xs={12}>
                {paymentMethods.map((payment, index) => (
                  <Grid container spacing={2} key={payment.id} alignItems="center">
                    <Grid item xs={6}>
                      <CustomFormLabel
                        htmlFor={`payment_method_${payment.id}`}
                        sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}
                      >
                        Forma de pagamento {index + 1}
                      </CustomFormLabel>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField
                          select
                          name={`payment_method_${payment.id}`}
                          value={payment.method}
                          onChange={(e) => handleMethodChange(payment.id, 'method', e.target.value)}
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

                        {index > 0 && (
                          <IconButton
                            onClick={() => removePaymentMethod(payment.id)}
                            sx={{
                              color: '#FF5A5F',
                              '&:hover': {
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <RemoveCircleIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>

                    {payment.method === 'financing' && (
                      <Grid item xs={6}>
                        <CustomFormLabel
                          htmlFor={`financing_type_${payment.id}`}
                          sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}
                        >
                          Financiadoras
                        </CustomFormLabel>
                        <TextField
                          select
                          name={`financing_type_${payment.id}`}
                          value={payment.financing_type}
                          onChange={(e) => handleMethodChange(payment.id, 'financing_type', e.target.value)}
                          fullWidth
                        >
                          <MenuItem value="1">Sol Agora</MenuItem>
                          <MenuItem value="2">BV</MenuItem>
                          <MenuItem value="3">Sicoob</MenuItem>
                          <MenuItem value="4">Bradesco</MenuItem>
                          <MenuItem value="5">BanPará</MenuItem>
                          <MenuItem value="6">SICREDI</MenuItem>
                          <MenuItem value="7">BTG</MenuItem>
                          <MenuItem value="8">Sol Fácil</MenuItem>
                          <MenuItem value="9">Santander</MenuItem>
                          <MenuItem value="10">Itaú</MenuItem>
                          <MenuItem value="11">Banco do Brasil</MenuItem>
                          <MenuItem value="12">Losango</MenuItem>
                        </TextField>
                      </Grid>
                    )}

                    {payment.method === 'credit' && (
                      <Grid item xs={6}>
                        <CustomFormLabel
                          htmlFor={`installments_num_${payment.id}`}
                          sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}
                        >
                          Parcelas
                        </CustomFormLabel>
                        <TextField
                          select
                          name={`installments_num_${payment.id}`}
                          value={payment.installments_num}
                          onChange={(e) => handleMethodChange(payment.id, 'installments_num', e.target.value)}
                          fullWidth
                        >
                          <MenuItem value="2">2x</MenuItem>
                          <MenuItem value="3">3x</MenuItem>
                          <MenuItem value="4">4x</MenuItem>
                        </TextField>
                      </Grid>
                    )}
                  </Grid>
                ))}

                <Grid item xs={4}>
                  <IconButton
                    sx={{
                      mt: 2,
                      color: '#7E8388',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: 0.5,
                      transition: '0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        backgroundColor: 'rgba(0, 0, 0, 0.00)',
                      },
                    }}
                    onClick={addPaymentMethod}
                  >
                    <AddOutlinedIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                      Adicionar forma de pagamento
                    </Typography>
                  </IconButton>
                </Grid>
              </Grid>





              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="seller_id" sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}>Vendedor Responsável</CustomFormLabel>
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
                  <CustomFormLabel htmlFor="proposal_validity" sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}>
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


              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="description" sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}>Descrição</CustomFormLabel>
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


            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flexDirection: 'column', marginTop: 2, gap: 2 }}
            >
              <ProjectCard leadId={leadId} />
            </Grid>
          </Grid>


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

              <Button variant="contained" sx={{ backgroundColor: theme.palette.primary.Button, color: '#303030', px: 3 }} onClick={handleSaveForm} disabled={formLoading}
                endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}>
                <Typography variant="body1" color="white">
                  {formLoading ? 'Atualizando proposta...' : 'Atualizar proposta'}
                </Typography>
              </Button>
            </Box>
          </Grid>

          <Dialog
            open={openEnergyConsumption}
            onClose={() => setOpenEnergyConsumption(false)}
            maxWidth="lg"
            fullWidth
          >
            <DialogContent>
              {/* add consumo energético dialog */}
              {/* <EditProposalPage
                leadId={leadId}
                onClose={() => setOpenEditProposal(false)}
                onRefresh={onRefresh} /> */}
            </DialogContent>
          </Dialog>

        </Box>
      </Grid>
    </Grid>
  );
}

export default EditProposalPage;
