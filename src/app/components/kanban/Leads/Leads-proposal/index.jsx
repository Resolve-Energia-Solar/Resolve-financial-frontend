'use client';
import {
  Grid,
  Typography,
  Chip,
  Divider,
  Box,
  Rating,
  useTheme,
  IconButton,
  Card,
  MenuItem,
  InputAdornment,
  TextField,
} from '@mui/material';
import {
  AccountCircle,
  CalendarToday,
  CalendarViewWeek,
  Description,
  Email,
  Phone,
  WbSunny,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import leadService from '@/services/leadService';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import ProductList from './ProposalCard';
import LeadInfoHeader from '@/app/components/kanban/components/HeaderCard';
import Button from "@mui/material/Button";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

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
    installments_num: '',
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
    };
    fetchLead();
  }, []);

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sx={{ overflow: 'scroll' }}>
        <Box
          sx={{
            borderRadius: '20px',
            boxShadow: 3,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
          }}
        >
          {/* HEEEEEEEEEEEEADER */}
          <Grid container spacing={2} alignItems="center" xs={12}>
            <LeadInfoHeader leadId={leadId}/>
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
                  <CustomFormLabel htmlFor="proposal_name">Nome da Proposta</CustomFormLabel>
                  <TextField
                    select
                    name="proposal_name"
                    value={formData.proposal_name}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value="K1">Kit Solar 2034</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="amount">Valor da proposta</CustomFormLabel>
                  <TextField
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>

              {/* second row */}
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="ref_amount">Valor de referência</CustomFormLabel>
                  <TextField
                    name="ref_amount"
                    value={formData.ref_amount}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="entry_amount">Valor de entrada</CustomFormLabel>
                  <TextField
                    name="entry_amount"
                    value={formData.entry_amount}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                  />
                </Grid>
              </Grid>

              {/* third row */}
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
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
              )}

              {/* fourth row */}
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="seller_id">Vendedor Responsável</CustomFormLabel>
                  <TextField
                    select
                    name="seller_id"
                    value={formData.seller_id}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value="F">Fulano</MenuItem>
                    <MenuItem value="C">Ciclano</MenuItem>
                    <MenuItem value="B">Beltrano</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="proposal_validity">
                    Validade da proposta
                  </CustomFormLabel>
                  <TextField
                    name="proposal_validity"
                    value={formData.proposal_validity}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
              </Grid>

              {/* fifth row */}
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12}>
                  <CustomFormLabel htmlFor="description">Descrição</CustomFormLabel>
                  <TextField
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={2}
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
              <ProductList />
            </Grid>
          </Grid>

          {/* BUTTONS! */}
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'space-between', // ✅ Ensures buttons are on opposite sides
              alignItems: 'center',
              mt: 2,
              gap: 2,
            }}
          >
            {/* LEFT: Black Button */}
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

            {/* RIGHT: Red & Yellow Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" color="error" sx={{ px: 3 }}>
                <Typography variant="body1" sx={{ mr: 1 }}>Descartar</Typography>
                <DeleteOutlinedIcon />
              </Button>

              <Button variant="contained" sx={{ backgroundColor: '#FFC107', color: 'black', px: 3 }}>
                <Typography variant="body1">Gerar proposta</Typography>
              </Button>
            </Box>
          </Grid>

        </Box>
      </Grid>
    </Grid>
  );
}

export default LeadProposalPage;
