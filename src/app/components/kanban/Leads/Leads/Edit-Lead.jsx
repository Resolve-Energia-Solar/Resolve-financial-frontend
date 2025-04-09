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

import {
  IconMapPin,
  IconId,
  IconMail,
  IconPhone,
  IconUserCircle,
  IconBuildingStore,
  IconCake,
  IconSun,
  IconMessageCircleDown
} from '@tabler/icons-react';

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
import { LeadModalTabContext } from '../context/LeadModalTabContext';
import { useContext, useState } from 'react';
import GenericAutocomplete from '@/app/components/auto-completes/GenericAutoComplete';
import CreateAddressPage from '@/app/components/apps/address/Add-address';

function EditLeadPage({ leadId = null }) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state.user?.user);

  const { lead } = useContext(LeadModalTabContext);
  const {
    formData,
    handleChange,
    handleSave,
    loading: formLoading,
    formErrors,
    success,
  } = useLeadForm(lead, leadId);

  formData?.seller ? null : handleChange('seller', user?.id);

  const handleSaveLead = async () => {
    const response = await handleSave(formData);
    if (response) {
      enqueueSnackbar('Lead salvo com sucesso', { variant: 'success' });
    }
  };

  const [leadType, setLeadType] = useState('');
  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const fetchAddress = async (search) => {
    try {
      const response = await addressService.index({
        q: search,
        limit: 40,
        fields: 'id,street,number,city,state',
      });
      return response.results;
    } catch (error) {
      console.error('Erro na busca de endereços:', error);
      return [];
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
          <Grid container spacing={1} alignItems="center" sx={{ p: 3, m: 0.1 }}>
            <LeadInfoHeader />
          </Grid>

          <Grid container sx={{ px: 5 }}>
            <Grid item xs={12} sx={{ mb: "24px" }}>
              <Typography sx={{ fontWeight: "400", fontSize: "18px" }}>Cadastro de Lead | <strong>Dados Pessoais</strong></Typography>
            </Grid>
            <Grid item xs={12} sx={{ mb: "8px" }}>
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label" sx={{ fontWeight: "700", fontSize: "14px", mb: "8px" }}>Tipo de Lead</FormLabel>
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
                    onClick={() => setLeadType('PF')}
                    control={
                      <Radio
                        sx={{
                          color: theme.palette.primary.Radio,
                          '&.Mui-checked': {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    }
                    label="Pessoa Física"
                  />
                  <FormControlLabel
                    value="PJ"
                    onClick={() => setLeadType('PJ')}
                    control={
                      <Radio
                        sx={{
                          color: theme.palette.primary.Radio,
                          '&.Mui-checked': {
                            color: theme.palette.primary.main,
                          },
                          '.MuiFormControlLabel-label': {
                            color: "#303030",
                            fontWeight: 400,
                            fontSize: "16px"
                          },
                          ml: 2,
                        }}
                      />
                    }
                    label="Pessoa Jurídica"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {leadType === 'PF' ? (
              <Grid container rowSpacing={0.5} columnSpacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={5}>
                  <CustomFormLabel htmlFor="name" sx={{ color: '#303030', fontWeight: '700', fontSize: '14px' }}>Nome Completo</CustomFormLabel>
                  <TextField
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconUserCircle size={"20px"} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      input: {
                        color: '#7E92A2',
                        fontWeight: '400',
                        fontSize: '12px',
                        opacity: 1,
                      },
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #3E3C41',
                        borderRadius: '9px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px',
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <CustomFormLabel htmlFor="first_document" sx={{ color: '#303030', fontWeight: '700', fontSize: '14px' }}>CPF</CustomFormLabel>
                  <TextField
                    name="first_document"
                    value={formData.first_document}
                    onChange={(e) => handleChange('first_document', e.target.value)}
                    fullWidth
                    sx={{
                      input: {
                        color: '#7E92A2',
                        fontWeight: '400',
                        fontSize: '12px',
                        opacity: 1,
                      },
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #3E3C41',
                        borderRadius: '9px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconId size={"20px"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <CustomFormLabel htmlFor="phone" sx={{ color: '#303030', fontWeight: '700', fontSize: '14px' }}>Telefone com DDD</CustomFormLabel>
                  <TextField
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconPhone size={"20px"} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      input: {
                        color: '#7E92A2',
                        fontWeight: '400',
                        fontSize: '12px',
                        opacity: 1,
                      },
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #3E3C41',
                        borderRadius: '9px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px',
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <CustomFormLabel htmlFor="birth_date" sx={{ color: '#303030', fontWeight: '700', fontSize: '14px' }}>Data de Nascimento</CustomFormLabel>
                  <TextField
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={(e) => handleChange('birth_date', e.target.value)}
                    fullWidth
                    sx={{
                      input: {
                        color: '#7E92A2',
                        fontWeight: '400',
                        fontSize: '12px',
                        opacity: 1,
                      },
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #3E3C41',
                        borderRadius: '9px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconCake size={"20px"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomFormLabel htmlFor="contact_email" sx={{ color: '#303030', fontWeight: '700', fontSize: '14px' }} >E-mail</CustomFormLabel>
                  <TextField
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconMail size={"20px"} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      input: {
                        color: '#7E92A2',
                        fontWeight: '400',
                        fontSize: '12px',
                        opacity: 1,
                      },
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #3E3C41',
                        borderRadius: '9px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px',
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={12} lg={6}>
                  <CustomFormLabel
                    htmlFor="address"
                    sx={{ color: '#303030', fontWeight: '700', fontSize: '14px' }}
                  >
                    Endereço
                  </CustomFormLabel>
                  <GenericAutocomplete
                    fetchOptions={fetchAddress}
                    multiple
                    label=''
                    size="small"
                    AddComponent={CreateAddressPage}
                    getOptionLabel={(option) =>
                      `${option.street}, ${option.number} - ${option.city}, ${option.state}`
                    }
                    onChange={(selected) => {
                      setSelectedAddresses(selected);
                      console.log(selected);
                      const ids = Array.isArray(selected) ? selected.map((item) => item.id) : [];
                      handleChange('addresses_ids', ids);
                    }}
                    value={selectedAddresses}
                    {...(formErrors.addresses && {
                      error: true,
                      helperText: formErrors.addresses,
                    })}
                    sx={{
                      input: {
                        color: '#7E92A2',
                        fontWeight: '400',
                        fontSize: '12px',
                        opacity: 1,
                      },
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #3E3C41',
                        borderRadius: '9px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ ml: 1 }}>
                          <IconMapPin size={"20px"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <CustomFormLabel htmlFor="funnel" sx={{ color: '#303030', fontWeight: '700', fontSize: '14px' }}>Funil</CustomFormLabel>
                  <TextField
                    select
                    name="funnel"
                    value={formData.funnel}
                    onChange={(e) => handleChange('funnel', e.target.value)}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#3E3C41',
                        borderRadius: '9px',
                        
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px',
                        color: '#7E92A2',
                        fontWeight: '400',
                        fontSize: '12px',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconSun size={"20px"} />
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="N">Não Interessado</MenuItem>
                    <MenuItem value="P">Pouco Interessado</MenuItem>
                    <MenuItem value="I">Interessado</MenuItem>
                    <MenuItem value="M">Muito Interessado</MenuItem>
                    <MenuItem value="PC">Pronto para Comprar</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <CustomFormLabel htmlFor="origin" sx={{ color: '#303030', fontWeight: '700', fontSize: '14px', mb: 0 }}>Origem</CustomFormLabel>
                  <AutoCompleteOrigin
                    onChange={(id) => handleChange('origin', id)}
                    value={formData.origin}
                    {...(formErrors.origin && { error: true, helperText: formErrors.origin })}
                    sx={{
                      mt: 0.5,
                      mb: 0,
                      height: "45px",
                      input: {
                        color: '#7E92A2',
                        fontWeight: '400',
                        fontSize: '12px',
                        opacity: 1,
                      },
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #3E3C41',
                        borderRadius: '9px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconMessageCircleDown size={"20px"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <CustomFormLabel htmlFor="name" sx={{ color: '#303030', fontWeight: '700', fontSize: '14px', mb: 0 }}>Vendedor</CustomFormLabel>
                  <AutoCompleteUser
                    onChange={(id) => handleChange('seller', id)}
                    value={formData.seller}
                    {...(formErrors.seller && { error: true, helperText: formErrors.seller })}
                    sx={{
                      input: {
                        color: '#7E92A2',
                        fontWeight: '400',
                        fontSize: '12px',
                        opacity: 1,
                      },
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #3E3C41',
                        borderRadius: '9px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px',
                      },
                    }}
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container rowSpacing={0.5} columnSpacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel htmlFor="company_name" sx={{ color: '#303030', fontWeight: '700', fontSize: '14px' }}>Nome da empresa</CustomFormLabel>
                  <TextField
                    name="company_name"
                    value={formData.company_name}
                    onChange={(e) => handleChange('company_name', e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconBuildingStore size={"20px"} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      input: {
                        color: '#7E92A2',
                        fontWeight: '400',
                        fontSize: '12px',
                        opacity: 1,
                      },
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #3E3C41',
                        borderRadius: '9px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px',
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <CustomFormLabel htmlFor="second_document" sx={{ color: '#303030', fontWeight: '700', fontSize: '14px' }}>CNPJ</CustomFormLabel>
                  <TextField
                    name="second_document"
                    value={formData.second_document}
                    onChange={(e) => handleChange('second_document', e.target.value)}
                    fullWidth
                    sx={{
                      input: {
                        color: '#7E92A2',
                        fontWeight: '400',
                        fontSize: '12px',
                        opacity: 1,
                      },
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #3E3C41',
                        borderRadius: '9px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconId size={"20px"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <CustomFormLabel htmlFor="phone" sx={{ color: '#303030', fontWeight: '700', fontSize: '14px' }}>Telefone com DDD</CustomFormLabel>
                  <TextField
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconPhone size={"20px"} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      input: {
                        color: '#7E92A2',
                        fontWeight: '400',
                        fontSize: '12px',
                        opacity: 1,
                      },
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #3E3C41',
                        borderRadius: '9px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px',
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomFormLabel htmlFor="contact_email" sx={{ color: '#303030', fontWeight: '700', fontSize: '14px' }} >E-mail</CustomFormLabel>
                  <TextField
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconMail size={"20px"} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      input: {
                        color: '#7E92A2',
                        fontWeight: '400',
                        fontSize: '12px',
                        opacity: 1,
                      },
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #3E3C41',
                        borderRadius: '9px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px',
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={12} lg={6}>
                  <CustomFormLabel
                    htmlFor="address"
                    sx={{ color: '#303030', fontWeight: '700', fontSize: '14px' }}
                  >
                    Endereço
                  </CustomFormLabel>
                  <GenericAutocomplete
                    fetchOptions={fetchAddress}
                    multiple
                    label=''
                    size="small"
                    AddComponent={CreateAddressPage}
                    getOptionLabel={(option) =>
                      `${option.street}, ${option.number} - ${option.city}, ${option.state}`
                    }
                    onChange={(selected) => {
                      setSelectedAddresses(selected);
                      console.log(selected);
                      const ids = Array.isArray(selected) ? selected.map((item) => item.id) : [];
                      handleChange('addresses_ids', ids);
                    }}
                    value={selectedAddresses}
                    {...(formErrors.addresses && {
                      error: true,
                      helperText: formErrors.addresses,
                    })}
                    sx={{
                      input: {
                        color: '#7E92A2',
                        fontWeight: '400',
                        fontSize: '12px',
                        opacity: 1,
                      },
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #3E3C41',
                        borderRadius: '9px',
                      },
                      '& .MuiInputBase-input': {
                        padding: '12px',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ ml: 1 }}>
                          <IconMapPin size={"20px"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                
              </Grid>
            )}

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
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: theme.palette.primary.Button, color: '#303030', px: 7 }}
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
