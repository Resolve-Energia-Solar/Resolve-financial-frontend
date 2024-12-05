'use client';
import {
  Grid,
  Button,
  Stack,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import { useParams } from 'next/navigation';

import AutoCompleteUser from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-User';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import FormPageSkeleton from '../../comercial/sale/components/FormPageSkeleton';

import useLead from '@/hooks/leads/useLead';
import useLeadForm from '@/hooks/leads/useLeadtForm';
import AutoCompleteAddresses from '../../comercial/sale/components/auto-complete/Auto-Input-Addresses';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import AutoCompleteOrigin from '../auto-input-origin';

const EditLeadPage = ({ leadId = null, onClosedModal = null }) => {
  const params = useParams();
  let id = leadId;
  if (!leadId) id = params.id;

  const { loading, error, leadData } = useLead(id);
  const {
    formData,
    handleChange,
    handleSave,
    loading: formLoading,
    formErrors,
    success,
  } = useLeadForm(leadData, id);

  console.log('formData', formData);

  const typeOptions = [
    { value: 'PF', label: 'Pessoa Física' },
    { value: 'PJ', label: 'Pessoa Jurídica' },
  ];

  const genderOptions = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' },
  ];

  const funnelOptions = [
    { value: 'N', label: 'Não Interessado' },
    { value: 'P', label: 'Pouco Interessado' },
    { value: 'I', label: 'Interessado' },
    { value: 'M', label: 'Muito Interessado' },
    { value: 'PC', label: 'Pronto para Comprar' },
  ];

  const qualificationOptions = [
    { value: 0, label: '0 - Ruim' },
    { value: 1, label: '1 - Muito Baixa' },
    { value: 2, label: '2 - Baixa' },
    { value: 3, label: '3 - Média' },
    { value: 4, label: '4 - Boa' },
    { value: 5, label: '5 - Excelente' },
  ];

  return (
    <Box>
      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2, md: 4 }}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5"># {formData.name}</Typography>
      </Stack>
      <Divider></Divider>
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Lead atualizado com sucesso!
        </Alert>
      )}
      {loading ? (
        <FormPageSkeleton />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="name">Nome</CustomFormLabel>
              <CustomTextField
                name="name"
                placeholder="Nome"
                variant="outlined"
                fullWidth
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                {...(formErrors.name && { error: true, helperText: formErrors.name })}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <FormSelect
                label="Tipo"
                options={typeOptions}
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="name">Apelido</CustomFormLabel>
              <CustomTextField
                name="byname"
                placeholder="Apelido"
                variant="outlined"
                fullWidth
                value={formData.byname}
                onChange={(e) => handleChange('byname', e.target.value)}
                {...(formErrors.byname && { error: true, helperText: formErrors.byname })}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="name">CPF/CNPJ</CustomFormLabel>
              <CustomTextField
                name="first_document"
                placeholder="CPF/CNPJ"
                variant="outlined"
                fullWidth
                value={formData.first_document}
                onChange={(e) => handleChange('first_document', e.target.value)}
                {...(formErrors.first_document && {
                  error: true,
                  helperText: formErrors.first_document,
                })}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="name">RG/IE</CustomFormLabel>
              <CustomTextField
                name="second_document"
                placeholder="RG"
                variant="outlined"
                fullWidth
                value={formData.second_document}
                onChange={(e) => handleChange('second_document', e.target.value)}
                {...(formErrors.second_document && {
                  error: true,
                  helperText: formErrors.second_document,
                })}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="name">Telefone</CustomFormLabel>
              <CustomTextField
                name="phone"
                placeholder="Telefone"
                variant="outlined"
                fullWidth
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                {...(formErrors.phone && { error: true, helperText: formErrors.phone })}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <FormDate
                label="Data de Nascimento"
                name="birth_date"
                value={formData.birth_date}
                onChange={(newValue) => handleChange('birth_date', newValue)}
                {...(formErrors.birth_date && { error: true, helperText: formErrors.birth_date })}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <FormSelect
                label="Genero"
                options={genderOptions}
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="name">E-mail</CustomFormLabel>
              <CustomTextField
                name="contact_email"
                placeholder="E-mail"
                variant="outlined"
                fullWidth
                value={formData.contact_email}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                {...(formErrors.contact_email && {
                  error: true,
                  helperText: formErrors.contact_email,
                })}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="kwp">Potência (kWp)</CustomFormLabel>
              <CustomTextField
                name="kwp"
                placeholder="Potência (kWp)"
                type="number"
                variant="outlined"
                fullWidth
                value={formData.kwp}
                onChange={(e) => handleChange('kwp', e.target.value)}
                {...(formErrors.kwp && { error: true, helperText: formErrors.kwp })}
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={4}>
              <FormSelect
                label="Qualificação"
                options={qualificationOptions}
                value={formData.qualification}
                onChange={(e) => handleChange('qualification', e.target.value)}
                {...(formErrors.qualification && {
                  error: true,
                  helperText: formErrors.qualification,
                })}
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="branch">Endereço Principal</CustomFormLabel>
              <AutoCompleteAddresses
                onChange={(ids) => handleChange('addresses_ids', ids)}
                value={formData.addresses_ids}
                {...(formErrors.addresses_ids && {
                  error: true,
                  helperText: formErrors.addresses_ids,
                })}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="branch">Vendedor</CustomFormLabel>
              <AutoCompleteUser
                onChange={(id) => handleChange('seller_id', id)}
                value={formData.seller_id}
                {...(formErrors.seller_id && { error: true, helperText: formErrors.seller_id })}
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="branch">SDR</CustomFormLabel>
              <AutoCompleteUser
                onChange={(id) => handleChange('sdr_id', id)}
                value={formData.sdr_id}
                {...(formErrors.sdr_id && { error: true, helperText: formErrors.sdr_id })}
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={4}>
              <FormSelect
                label="Funil"
                options={funnelOptions}
                value={formData.funnel}
                onChange={(e) => handleChange('funnel', e.target.value)}
                {...(formErrors.funnel && { error: true, helperText: formErrors.funnel })}
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="branch">Origem</CustomFormLabel>
              <AutoCompleteOrigin
                onChange={(id) => handleChange('origin_id', id)}
                value={formData.origin_id}
                {...(formErrors.origin_id && { error: true, helperText: formErrors.origin_id })}
              />
            </Grid>

            <Grid item xs={12} sm={12} lg={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                {onClosedModal && (
                  <Button variant="contained" color="primary" onClick={onClosedModal}>
                    Fechar
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={formLoading}
                  endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {formLoading ? 'Salvando...' : 'Salvar Alterações'}{' '}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default EditLeadPage;
