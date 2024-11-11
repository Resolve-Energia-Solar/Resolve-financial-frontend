'use client';

import {
  Alert,
  Button,
  Grid,
  Stack,
} from '@mui/material';
import { useParams } from 'next/navigation';

/* components */
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import PageContainer from '@/app/components/container/PageContainer';
import ParentCard from '@/app/components/shared/ParentCard';

/* hooks */
import useRoofType from '@/hooks/inspections/roof-type/useRoofType';
import useRoofTypeForm from '@/hooks/inspections/roof-type/useRoofTypeForm';

const RoofTypeForm = () => {
  const params = useParams();
  const { id } = params;

  const { loading, error, roofTypeData } = useRoofType(id);

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success
  } = useRoofTypeForm(roofTypeData, id);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PageContainer title="Edição de Tipo de Telhado" description="Editor de Tipo de Telhado">
      <Breadcrumb title="Editar Tipo de Telhado" />
      { success && <Alert severity="success" sx={{ marginBottom: 3 }}>O tipo de telhado foi atualizado com sucesso!</Alert>}
      <ParentCard title='Tipo de Telhado'>
        <Grid container spacing={3}>
          {/* Nome do Tipo de Telhado */}
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="rooftype">Tipo de Telhado</CustomFormLabel>
            <CustomTextField
              name="rooftype"
              placeholder="Digite o tipo de telhado"
              fullWidth
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              {...(formErrors.name && { error: true, helperText: formErrors.name })}
            />
          </Grid>

          {/* Botão de Salvar */}
          <Grid item xs={12} sm={12} lg={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
              >
                Editar
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
}

export default RoofTypeForm;
