'use client';
import { Grid, Button, Stack, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/app/components/shared/ParentCard';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import useDocumentTypeForm from '@/hooks/document-types/useDocumentTypeForm';
import { useRouter } from 'next/navigation';

export default function FormCustom() {
  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success
  } = useDocumentTypeForm();

  const router = useRouter();


  const appLabels = [
    { label: 'Contas', value: 'accounts' },
    { label: 'Contratos', value: 'contracts' },
    { label: 'Inspeções', value: 'inspections' },
    { label: 'Logística', value: 'logistics' },
    { label: 'Engenharia', value: 'engineering' },
    { label: 'Financeiro', value: 'financial' },
  ];

  if (success) {
    router.push('/apps/document-types');
  }

  return (
    <PageContainer title="Criação de Cargo" description="Editor de Cargos">
      <Breadcrumb title="Criar Cargo" />
      {success && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          O Tipo de document foi criado com sucesso!
        </Alert>
      )}
      <ParentCard title="Tipo de Documento">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} lg={12}>
            <CustomFormLabel htmlFor="name">Nome</CustomFormLabel>
            <CustomTextField
              name="name"
              variant="outlined"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              {...(formErrors.name && { error: true, helperText: formErrors.name })}
            />
          </Grid>

          <Grid item xs={12} sm={12} lg={12}>
            <FormControl fullWidth>
              <CustomFormLabel id="app_label" htmlFor="Setor">Setor</CustomFormLabel>
              <Select
                labelId="app-label"
                id="app_label"
                value={formData.app_label}
                label="App Label"
                onChange={(e) => handleChange('app_label', e.target.value)}
              >
                {appLabels.map((label) => (
                  <MenuItem key={label.value} value={label.value}>
                    {label.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} lg={12}>
  <CustomFormLabel htmlFor="isReusable">É Reutilizável?</CustomFormLabel>
  <Stack direction="row" spacing={2}>
    <Button
      variant={formData.reusable ? "contained" : "outlined"}
      color="success"
      startIcon={<CheckCircle />}
      onClick={() => handleChange('reusable', true)}
      sx={{
        minWidth: 120, // Para garantir que os botões tenham tamanho consistente
      }}
    >
      Sim
    </Button>
    <Button
      variant={!formData.reusable ? "contained" : "outlined"}
      color="error"
      startIcon={<Cancel />}
      onClick={() => handleChange('reusable', false)}
      sx={{
        minWidth: 120,
      }}
    >
      Não
    </Button>
  </Stack>
          </Grid>

          <Grid item xs={12} sm={12} lg={12}>
            <CustomFormLabel htmlFor="isRequired">É Obrigatório?</CustomFormLabel>
            <Stack direction="row" spacing={2}>
              <Button
                variant={formData.required ? "contained" : "outlined"}
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => handleChange('required', true)}
                sx={{
                  minWidth: 120,
                }}
              >
                Sim
              </Button>
              <Button
                variant={!formData.required ? "contained" : "outlined"}
                color="error"
                startIcon={<Cancel />}
                onClick={() => handleChange('required', false)}
                sx={{
                  minWidth: 120,
                }}
              >
                Não
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={12} lg={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Criar
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};
