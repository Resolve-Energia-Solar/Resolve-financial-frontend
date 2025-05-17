'use client';
import { Grid, Button, Stack } from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import useBranchForm from '@/hooks/branch/useBranchForm';
import { useRouter } from 'next/navigation';
import ParentCard from '@/app/components/shared/ParentCard';
import Alert from '@mui/material/Alert';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';
import CreateAddressPage from '@/app/components/apps/address/Add-address';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Unidades',
  },
];

export default function BranchForm() {
  const router = useRouter();

  const { formData, handleChange, handleSave, formErrors, success } = useBranchForm();

  if (success) {
    router.push('/apps/branch');
  }

  return (
    <PageContainer title="Criação de Franquias" description="Criador de Franquias">
      <Breadcrumb items={BCrumb} />
      {success && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          A franquia foi criada com sucesso!
        </Alert>
      )}
      <ParentCard title="Franquias">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel htmlFor="name">Franquia</CustomFormLabel>
            <CustomTextField
              name="name"
              placeholder="Nome da Franquia"
              fullWidth
              onChange={(e) => handleChange('name', e.target.value)}
              {...(formErrors.name && { error: true, helperText: formErrors.name })}
            />
          </Grid>

          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel htmlFor="address">Endereço</CustomFormLabel>
            <GenericAsyncAutocompleteInput
              label="Endereço"
              name="address"
              value={formData.address}
              onChange={(id) => handleChange('address', id)}
              endpoint="api/addresses"
              queryParam="q"
              extraParams={{ fields: ['id', 'complete_address'] }}
              mapResponse={data => data?.results.map(it => ({ label: it.complete_address || it.name, value: it.id }))}
              renderCreateModal={({ onClose, onCreate, newObjectData, setNewObjectData }) => (
                <CreateAddressPage onClose={onClose} onCreate={onCreate} newObjectData={newObjectData} setNewObjectData={setNewObjectData} />
              )}
              error={!!formErrors.address}
              helperText={formErrors.address?.[0]}
            />
          </Grid>

          <Grid item xs={12} sm={12} lg={12}>
            <CustomFormLabel htmlFor="owners">Proprietários</CustomFormLabel>
            <GenericAsyncAutocompleteInput
              label="Proprietários"
              name="owners"
              value={formData.owners || []}
              onChange={(ids) => handleChange('owners', ids)}
              endpoint="api/users"
              queryParam="complete_name__icontains"
              extraParams={{ fields: ['id', 'complete_name'], limit: 10 }}
              mapResponse={d => d.results.map(u => ({ label: u.complete_name, value: u.id }))}
              error={!!formErrors.owners}
              helperText={formErrors.owners?.[0]}
              multiselect
            />
          </Grid>

          <Grid item xs={12}>
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
}
