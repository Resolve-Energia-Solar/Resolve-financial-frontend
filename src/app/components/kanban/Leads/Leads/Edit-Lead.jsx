'use client';
import {
  Grid,
  Typography,
  Box,
  useTheme,
  MenuItem,
  InputAdornment,
  TextField,
  Radio,
  Button,
  CircularProgress,
} from '@mui/material';
import { AccountCircle, Email, Phone } from '@mui/icons-material';
import BlankCard from '@/app/components/shared/BlankCard';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteOrigin from '@/app/components/apps/leads/auto-input-origin';
import LeadInfoHeader from '../components/HeaderCard';

import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import useLead from '@/hooks/leads/useLead';
import useLeadForm from '@/hooks/leads/useLeadtForm';
import { useSelector } from 'react-redux';
import AutoCompleteUser from '@/app/components/apps/invoice/components/auto-complete/Auto-Input-User';

function EditLeadPage({ leadId = null }) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state.user?.user);

  const { loading, error, leadData } = useLead(leadId);
  const {
    formData,
    handleChange,
    handleSave,
    loading: formLoading,
    formErrors,
    success,
  } = useLeadForm(leadData, leadId);

  formData?.seller ? null : handleChange('seller', user?.id);

  const handleSaveLead = async () => {
    const response = await handleSave(formData);
    if (response) {
      enqueueSnackbar('Lead salvo com sucesso', { variant: 'success' });
    }
  };

  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        <BlankCard
          sx={{
            borderRadius: '20px',
            boxShadow: 3,
            p: 0,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Grid container spacing={2} alignItems="center" sx={{ p: 3 }}>
            <LeadInfoHeader />
          </Grid>

          <Grid container spacing={1} sx={{ padding: '0px 20px 20px 20px' }}>
            <Grid item xs={12}>
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Tipo de Lead</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="type"
                  value={formData.type}
                  defaultValue="pf"
                  sx={{ display: 'flex', flexDirection: 'row' }}
                  onChange={(e) => handleChange('type', e.target.value)}
                >
                  <FormControlLabel
                    value="PF"
                    control={
                      <Radio
                        sx={{
                          color: '#E4B400',
                          '&.Mui-checked': {
                            color: '#E4B400',
                          },
                        }}
                      />
                    }
                    label="Pessoa Física"
                  />
                  <FormControlLabel
                    value="PJ"
                    control={
                      <Radio
                        sx={{
                          color: '#E4B400',
                          '&.Mui-checked': {
                            color: '#E4B400',
                          },
                        }}
                      />
                    }
                    label="Pessoa Jurídica"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="name">Nome Completo</CustomFormLabel>
              <TextField
                name="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="funnel">Funil</CustomFormLabel>
              <TextField
                select
                name="funnel"
                value={formData.funnel}
                onChange={(e) => handleChange('funnel', e.target.value)}
                fullWidth
              >
                <MenuItem value="N">Não Interessado</MenuItem>
                <MenuItem value="P">Pouco Interessado</MenuItem>
                <MenuItem value="I">Interessado</MenuItem>
                <MenuItem value="M">Muito Interessado</MenuItem>
                <MenuItem value="PC">Pronto para Comprar</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="origin">Origem</CustomFormLabel>
              <AutoCompleteOrigin
                onChange={(id) => handleChange('origin', id)}
                value={formData.origin}
                {...(formErrors.origin && { error: true, helperText: formErrors.origin })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="first_document">CPF/CNPJ</CustomFormLabel>
              <TextField
                name="first_document"
                value={formData.first_document}
                onChange={(e) => handleChange('first_document', e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="phone">Telefone com DDD</CustomFormLabel>
              <TextField
                name="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="contact_email">E-mail</CustomFormLabel>
              <TextField
                name="contact_email"
                value={formData.contact_email}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomFormLabel htmlFor="name">Vendedor</CustomFormLabel>
              <AutoCompleteUser
                onChange={(id) => handleChange('seller', id)}
                value={formData.seller}
                {...(formErrors.seller && { error: true, helperText: formErrors.seller })}
              />
            </Grid>

            {/* Add a Save Button */}
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
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: theme.palette.primary.Button, color: '#303030', px: 3 }}
                  onClick={handleSaveLead}
                  disabled={formLoading}
                  endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  <Typography variant="body1" color="white">
                    {formLoading ? 'Salvando...' : 'Salvar'}
                  </Typography>
                </Button>
              </Box>
            </Grid>
          </Grid>
        </BlankCard>
      </Grid>
    </Grid>
  );
}

export default EditLeadPage;
