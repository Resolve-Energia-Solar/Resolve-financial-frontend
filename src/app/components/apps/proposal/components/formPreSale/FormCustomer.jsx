'use client';
import { Grid, Button, Stack } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import Alert from '@mui/material/Alert';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteUser from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-User';
import AutoCompleteBranch from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Branch';
import AutoCompleteAddresses from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Addresses';
import AutoCompleteDepartament from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Departament';
import AutoCompleteRole from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-Role';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import { useRouter } from 'next/navigation';

export default function FormCustomer() {

  const router = useRouter();

  const gender_options = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' },
    { value: 'O', label: 'Outro' },
  ];

  const status_options = [
    { value: true, label: 'Ativo' },
    { value: false, label: 'Inativo' },
  ];

  const contract_type_options = [
    { value: 'P', label: 'PJ' },
    { value: 'C', label: 'CLT' },
  ];

  return (
    <PageContainer title="Criação de usuário" description="Criador de Usuários">
      {false && (
        <Alert severity="success" sx={{ marginBottom: 3 }}>
          O usuário foi criado com sucesso!
        </Alert>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="username">Usuário</CustomFormLabel>
          <CustomTextField
            name="username"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="first_name">Nome</CustomFormLabel>
          <CustomTextField
            name="first_name"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
          <CustomTextField
            name="email"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <FormSelect
            label="Gênero"
            options={gender_options}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <FormSelect
            label="Tipo de Contrato"
            options={contract_type_options}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <FormDate
            label="Data de Nascimento"
            name="birth_date"
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="phone">Telefone</CustomFormLabel>
          <CustomTextField
            name="phone"
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="address">Endereço</CustomFormLabel>
          <AutoCompleteAddresses
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="branch">Filial</CustomFormLabel>
          <AutoCompleteBranch
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="department">Gestor</CustomFormLabel>
          <AutoCompleteUser
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="department">Departamento</CustomFormLabel>
          <AutoCompleteDepartament
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="role">Cargo</CustomFormLabel>
          <AutoCompleteRole
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="primary">
              Criar
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
