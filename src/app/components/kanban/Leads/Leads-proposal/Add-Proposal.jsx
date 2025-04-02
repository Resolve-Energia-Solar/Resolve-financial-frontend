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
  Chip,
} from '@mui/material';

import { useEffect, useState } from 'react';
import leadService from '@/services/leadService';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
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
import ProductsCard from '../components/ProductsCard';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import useEnergyConsumptionForm from '@/hooks/energyConsumption/useEnergyConsumptionForm';

function AddProposalPage({ leadId = null, onRefresh = null, onClose = null }) {
  const router = useRouter();
  const theme = useTheme();
  const [lead, setLead] = useState(null);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [mediumConsumption, setMediumConsumption] = useState("");
  const [openEnergyConsumption, setOpenEnergyConsumption] = useState(false);
  const [openProposalLayout, setOpenProposalLayout] = useState(false);

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    loading: formLoading,
    success,
  } = useProposalForm();

  const customProducts = useSelector(selectProductsByLead(leadId));

  formData.products_ids = customProducts.map((product) => product.id);
  formData.lead ? null : (formData.lead = leadId);
  formData.status ? null : (formData.status = 'P');
  user?.user ? (formData.created_by = user.user.id) : null;

  const discard_proposal = () => {
    dispatch(
      removeProductFromLead({ leadId, productIds: customProducts.map((product) => product.id) }),
    );
    // handleChange('due_date', null);
    // handleChange('value', null);
    // handleChange('observation', '');
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
        const data = await leadService.find(leadId);
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

  }

  const handleMediumConsumptionFieldUpdate = (newValue) => {
    setMediumConsumption(newValue);
    // handleChange
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
          <Grid container spacing={4}>
            {/* <LeadInfoHeader leadId={leadId} /> */}
            <Grid item xs={12} sx={{ display: 'flex', alignItems: "center", flexDirection: 'row', marginTop: 2 }}>
              <Grid item xs={8} >
                <Typography
                  variant="h6"
                  sx={{ color: '#000000', fontWeight: '700', fontSize: '18px' }}
                >
                  Nova proposta
                </Typography>
              </Grid>

              <Grid item xs={4} sx={{ display: "flex", justifyContent: "flex-end", flexDirection: 'column'}}>
                <Typography
                  variant="h6"
                  sx={{ color: '#7E8388', fontWeight: '500', fontSize: '14px' }}
                >
                  Status da proposta
                </Typography>
                <Chip
                  label={lead?.column?.name}
                  variant="outlined"
                  sx={{
                    color: 'gray',
                    backgroundColor: "#FFEBE4",
                    border: "transparent",
                    px: 1,
                    width: "163px"
                  }}
                >
                  <Typography
                  variant="h6"
                  sx={{ color: '#7E8388', fontWeight: '500', fontSize: '12px' }}
                  >
                    Aguardando retorno
                  </Typography>
                </Chip>
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', marginTop: 2 }}>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="seller_id" sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}>Tipo de Projeto</CustomFormLabel>
                  <TextField
                    select
                    name="seller_id"
                    value={formData.seller_id}
                    onChange={(e) => handleChange('seller_id', e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="C">Comercial</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="value">Valor da proposta</CustomFormLabel>
                  <CustomFieldMoney
                    name="value"
                    fullWidth
                    value={formData.value}
                    onChange={(value) => handleChange('value', value)}
                    {...(formErrors.value && { error: true, helperText: formErrors.value })}
                  />
                </Grid>

                <Grid item xs={8}>
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

                <Grid item xs={4}>
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

              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="observation" sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}>Descrição</CustomFormLabel>
                  <CustomTextArea
                    name="observation"
                    multiline
                    rows={4}
                    minRows={3}
                    value={formData.observation}
                    onChange={(e) => handleChange('observation', e.target.value)}
                    {...(formErrors.observation && { error: true, helperText: formErrors.observation })}
                  />
                </Grid>
              </Grid>


              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={4}>
                  <CustomFormLabel
                    htmlFor="estimated_power_generation"
                    sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}
                  >
                    Consumo energético
                  </CustomFormLabel>
                  <Button
                    variant="contained"
                    onClick={() => setOpenEnergyConsumption(true)}
                    sx={{
                      backgroundColor: '#F4F5F7',
                      color: '#303030',
                      border: "1px solid",
                      borderColor: "#ADADAD",
                      px: 3,
                      width: "100%",
                      height: "39px",
                      justifyContent: "space-between",
                      alignItems: "center",
                      '&:hover': { backgroundColor: theme.palette.primary.main, border: "transparent", boxShadow: '0', '& .MuiSvgIcon-root': { color: '#303030' } },
                    }}
                    endIcon={<ManageSearchIcon sx={{ ml: 1, color: "#7E8388" }} />}
                  >
                    <Typography variant="body1">Consumo Energético</Typography>
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <CustomFormLabel
                    htmlFor="medium_consumption"
                    sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}
                  >
                    Geração de energia estimada
                  </CustomFormLabel>
                  <TextField
                    name="medium_consumption"
                    value={mediumConsumption}
                    // onChange={(e) => handleChange('medium_consumption', e.target.value)}
                    fullWidth
                    disabled
                    // placeholder="2500 kWh"
                    InputProps={{
                      sx: {
                        input: {
                          color: "#7E92A2",
                          fontWeight: "400",
                          fontSize: "12px",
                          opacity: 1,

                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={4}>
                  <CustomFormLabel htmlFor="medium_energy_val" sx={{ color: "#092C4C", fontWeight: "700", fontSize: "14px" }}>Consumo médio de energia</CustomFormLabel>
                  <TextField
                    name="medium_energy_val"
                    value={formData.medium_energy_val}
                    onChange={(e) => handleChange('medium_energy_val', e.target.value)}
                    fullWidth
                    disabled
                    // placeholder='1800 kWh'
                    InputProps={{
                      sx: {
                        input: {
                          color: "#7E92A2",
                          fontWeight: "400",
                          fontSize: "12px",
                          opacity: 1,

                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flexDirection: 'column', marginTop: 2, gap: 2 }}
            >
              <ProductsCard leadId={leadId} />
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
              startIcon={<PictureAsPdfIcon sx={{ color: '#1C1B1F' }} />}
              variant="outlined"
              onClick={handleOpenProposalPdf}
              sx={{
                borderColor: 'black',
                color: '#303030',
                '&:hover': { backgroundColor: '#333', borderColor: 'black', '& .MuiSvgIcon-root': { color: "white" } },
                px: 3,
              }}
            >
              <Typography sx={{ fontWeight: "400", fontSize: "14px" }} >Visualizar PDF</Typography>
            </Button>

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
                  {formLoading ? 'Gerando proposta...' : 'Gerar proposta'}
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
                mediumConsumption={mediumConsumption}
                onUpdate={handleMediumConsumptionFieldUpdate}
                onRefresh={onRefresh}
              />
            </DialogContent>
          </Dialog>
        </Box>
      </Grid>
    </Grid>
  );
}

export default AddProposalPage;
