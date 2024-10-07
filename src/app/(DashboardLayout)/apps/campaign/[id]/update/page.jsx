'use client';
import React, { useState } from 'react';
import { Grid, Button, Stack, FormControlLabel, Alert } from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/app/components/shared/ParentCard';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import FormDateTime from '@/app/components/forms/form-custom/FormDateTime';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import useCampaignForm from '@/hooks/campaign/useCampaignForm';
import useCampaign from '@/hooks/campaign/useCampaign';
import { useParams } from 'next/navigation';

export default function CampaignForm() {
  const { id } = useParams();
  const { loading, error, campaignData } = useCampaign(id);
  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success
  } = useCampaignForm(campaignData, id);
  const [bannerFile, setBannerFile] = useState(null);

  const handleBannerChange = (event) => {
    const file = event.target.files[0];
    setBannerFile(file);
    handleChange('banner', file);
  };

  const handleSaveForm = () => {
    if (!bannerFile && campaignData.banner) {
      handleChange('banner', campaignData.banner);
    }
    handleSave();
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PageContainer title="Edição de Campanha de Marketing" description="Editor de Campanhas de Marketing">
      <Breadcrumb title="Editar Campanha" />
      {success && <Alert severity="success" sx={{ marginBottom: 3 }}>A campanha foi atualizada com sucesso!</Alert>}
      <ParentCard title="Campanha de Marketing">
        <Grid container spacing={2}>

          {/* Nome da Campanha */}
          <Grid item xs={12} sm={12} lg={4}>
            <CustomFormLabel htmlFor="campaign">Campanha</CustomFormLabel>
            <CustomTextField
              name="campaign"
              placeholder="Digite o nome da campanha"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              {...(formErrors.name && { error: true, helperText: formErrors.name })}
            />
          </Grid>

          {/* Data de Início */}
          <Grid item xs={12} sm={12} lg={4}>
            <FormDateTime
              label="Data de Início"
              name="start_datetime"
              value={formData.start_datetime}
              onChange={(newValue) => handleChange('start_datetime', newValue)}
              {...(formErrors.start_datetime && { error: true, helperText: formErrors.start_datetime })}
            />
          </Grid>

          {/* Data de Término */}
          <Grid item xs={12} sm={12} lg={4}>
            <FormDateTime
              label="Data de Término"
              name="end_datetime"
              value={formData.end_datetime}
              onChange={(newValue) => handleChange('end_datetime', newValue)}
              {...(formErrors.end_datetime && { error: true, helperText: formErrors.end_datetime })}
            />
          </Grid>

          {/* Descrição */}
          <Grid item xs={12}>
            <CustomTextField
              label="Descrição"
              name="description"
              placeholder="Descrição da campanha"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              {...(formErrors.description && { error: true, helperText: formErrors.description })}
            />
          </Grid>

{/* Campo: Upload do Banner */}
<Grid item xs={12}>
  <CustomFormLabel htmlFor="banner">Banner</CustomFormLabel>
  
  {/* Container com borda cinza */}
  <Stack direction="row" spacing={2} alignItems="center" sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
    
    {/* Botão para upload */}
    <Button
      variant="contained"
      component="label"
      color="primary"
      sx={{ flexShrink: 0 }} // Garante que o botão não encolha
    >
      {bannerFile ? 'Alterar Banner' : 'Selecionar Banner'}
      <input
        type="file"
        accept="image/*"
        onChange={handleBannerChange}
        hidden
      />
    </Button>

    {/* Exibe o nome do arquivo ou o nome do banner existente */}
    <div style={{ flexGrow: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
      {bannerFile ? (
        <strong>{bannerFile.name}</strong>
      ) : formData.banner ? (
        <strong>{formData.banner.name || formData.banner}</strong>
      ) : (
        <span>Nenhum banner selecionado</span>
      )}
    </div>
  </Stack>
  
  {formErrors.banner && <Alert severity="error">{formErrors.banner}</Alert>}
</Grid>




          {/* Botão de Ação */}
          <Grid item xs={12} md={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
              <Button variant="contained" color="primary" onClick={handleSaveForm}>
                Editar
              </Button>
            </Stack>
          </Grid>

        </Grid>
      </ParentCard>
    </PageContainer>
  );
}
