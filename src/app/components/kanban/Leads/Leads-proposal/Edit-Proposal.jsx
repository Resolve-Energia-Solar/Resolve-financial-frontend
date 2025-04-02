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
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import ProjectCard from '@/app/components/kanban/Leads/components/ProjectSmallListCard';
import LeadInfoHeader from '@/app/components/kanban/Leads/components/HeaderCard';
import Button from '@mui/material/Button';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import useProposalForm from '@/hooks/proposal/useProposalForm';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import CustomFieldMoney from '@/app/components/apps/invoice/components/CustomFieldMoney';
import CustomTextArea from '@/app/components/forms/theme-elements/CustomTextArea';
import { useSelector } from 'react-redux';
import { removeProductFromLead, selectProductsByLead } from '@/store/products/customProducts';
import { useDispatch } from 'react-redux';
import EnergyConsumptionCalc from '../components/EnergyConsumption/CalculateEnergyConsumption';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ProposalLayout from '../components/ProposalLayout';

function EditProposalPage({ proposalData = null, leadId = null, onRefresh = null, onClose = null }) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [openEnergyConsumption, setOpenEnergyConsumption] = useState(false);
  const [openProposalLayout, setOpenProposalLayout] = useState(false);

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    loading: formLoading,
    success,
  } = useProposalForm(proposalData, proposalData?.id);

  formData.lead ? null : (formData.lead = leadId);

  console.log('Form Data:', formData);


  const discard_proposal = () => {
    // dispatch(
    //   removeProductFromLead({ leadId, productIds: customProducts?.map((product) => product.id) }),
    // );
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


  const handleSaveForm = async () => {
    const response = await handleSave();
    if (response) {
      enqueueSnackbar('Proposta salva com sucesso', { variant: 'success' });
      if (onRefresh) onRefresh();
      if (onClose) onClose();
    } else {
      enqueueSnackbar('Erro ao salvar proposta', { variant: 'error' });
      console.log('Form Errors:', formErrors);
    }
  };

  const handleOpenProposalPdf = () => {
    // const queryParams = new URLSearchParams(formData).toString();
    // window.open(`apps/leads/${leadId}/proposal-layout?${queryParams}`, "_blank", "width=800,height=600");
    setOpenProposalLayout(true);
  };

  const [paymentMethods, setPaymentMethods] = useState([
    { id: Date.now(), method: '', financing_type: '', installments_num: '' },
  ]);

  const handleMethodChange = (id, field, value) => {
    setPaymentMethods((prevMethods) =>
      prevMethods.map((method) => (method.id === id ? { ...method, [field]: value } : method)),
    );
  };

  const addPaymentMethod = () => {
    setPaymentMethods([
      ...paymentMethods,
      { id: Date.now(), method: '', financing_type: '', installments_num: '' },
    ]);
  };

  const removePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
  };

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
            <LeadInfoHeader />
          </Grid>

          <Grid container spacing={4}>
            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', marginTop: 2 }}>
              <Grid item xs={12} sm={4}>
                <Typography
                  variant="h6"
                  sx={{ color: '#000000', fontWeight: '700', fontSize: '18px' }}
                >
                  Nova proposta
                </Typography>
              </Grid>

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

                {/* <Grid item xs={4}>
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
                </Grid> */}

                <Grid item xs={6}>
                  <FormDate
                    name="due_date"
                    label="Data de Vencimento"
                    fullWidth
                    value={formData.due_date}
                    onChange={(value) => handleChange('due_date', value)}
                    {...(formErrors.due_date && { error: true, helperText: formErrors.due_date })}
                  />
                </Grid>
              </Grid>

              {/* <Grid container rowSpacing={1} xs={12}>
                {paymentMethods.map((payment, index) => (
                  <Grid container spacing={2} key={payment.id} alignItems="center">
                    <Grid item xs={12}>
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
                      <Grid item xs={12}>
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
                      <Grid item xs={12}>
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
              </Grid> */}

              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="description">Descrição</CustomFormLabel>
                  <CustomTextArea
                    name="observation"
                    multiline
                    rows={4}
                    minRows={3}
                    value={formData.observation}
                    onChange={(e) => handleChange('observation', e.target.value)}
                    {...(formErrors.observation && {
                      error: true,
                      helperText: formErrors.observation,
                    })}
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
              justifyContent: 'end',
              alignItems: 'center',
              mt: 2,
              gap: 2,
            }}
          >
            {/* <Button
              startIcon={<PictureAsPdfIcon sx={{ color: '#1C1B1F' }} />}
              variant="outlined"
              onClick={handleOpenProposalPdf}
              sx={{
                borderColor: 'black',
                color: '#303030',
                '&:hover': {
                  backgroundColor: '#333',
                  borderColor: 'black',
                  '& .MuiSvgIcon-root': { color: 'white' },
                },
                px: 3,
              }}
            >
              <Typography sx={{ fontWeight: '400', fontSize: '14px' }}>Visualizar PDF</Typography>
            </Button> */}

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="error"
                sx={{ px: 3 }}
                onClick={discard_proposal}
                endIcon={<DeleteOutlinedIcon />}
              >
                <Typography variant="body1" sx={{ mr: 1 }}>
                  Descartar
                </Typography>
              </Button>

              <Button
                variant="contained"
                sx={{ backgroundColor: theme.palette.primary.Button, color: '#303030', px: 3 }}
                onClick={handleSaveForm}
                disabled={formLoading}
                endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                <Typography variant="body1" color="white">
                  {formLoading ? 'Salvando...' : 'Salvar alterações'}
                </Typography>
              </Button>
            </Box>
          </Grid>

          <Dialog
            open={openProposalLayout}
            onClose={() => setOpenProposalLayout(false)}
            maxWidth="lg"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: '20px',
                padding: '24px',
                gap: '24px',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#FFFFFF',
              },
            }}
          >
            <DialogContent>
              <ProposalLayout formData={formData} />
            </DialogContent>
          </Dialog>

          <Dialog
            open={openEnergyConsumption}
            onClose={() => setOpenEnergyConsumption(false)}
            maxWidth="lg"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: '20px',
                padding: '24px',
                gap: '24px',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#FFFFFF',
              },
            }}
          >
            <DialogContent>
              <EnergyConsumptionCalc
                leadId={leadId}
                onClose={() => setOpenEnergyConsumption(false)}
                onRefresh={onRefresh}
              />
            </DialogContent>
          </Dialog>
        </Box>
      </Grid>
    </Grid>
  );
}

export default EditProposalPage;
