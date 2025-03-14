import { Box, Divider, Grid, Typography } from '@mui/material';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';
import FormDate from '../../forms/form-custom/FormDate';
import FormSelect from '../../forms/form-custom/FormSelect';
import { useState } from 'react';
import AttachmentTable from '../attachment/attachmentTable';

const DetailsFundingRequest = ({ data, handleChangeStatus }) => {
  const [status, setStatus] = useState();
  return (
    <>
      <Box sx={{ marginBottom: 4, overflow: 'auto', height: '100vh', paddingBottom: 30 }}>
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5">Contratante</Typography>
          <Divider sx={{ marginTop: 2 }} />
          <Grid container spacing={3} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="complete_name">Nome Contratante</CustomFormLabel>
              <CustomTextField
                disabled={true}
                name="complete_name"
                variant="outlined"
                value={data.customer.complete_name}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="complete_name">E-mail</CustomFormLabel>
              <CustomTextField
                disabled={true}
                name="complete_name"
                variant="outlined"
                value={data.customer.email}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <FormDate
                disabled={true}
                label="Data de Nascimento"
                name="birth_date"
                value={data.customer.birth_date}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="complete_name">
                {data.person_type === 'PF' ? 'CPF' : 'CNPJ'}
              </CustomFormLabel>
              <CustomTextField
                disabled={true}
                name="complete_name"
                variant="outlined"
                value={data.customer.first_document}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <FormSelect
                disabled={true}
                name="gender"
                label="Gênero"
                options={[
                  { value: 'M', label: 'Masculino' },
                  { value: 'F', label: 'Feminino' },
                ]}
                value={data.customer.gender}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <CustomFormLabel htmlFor="complete_name">Natureza</CustomFormLabel>
              <CustomTextField
                disabled={true}
                name="complete_name"
                variant="outlined"
                value={data.customer.person_type}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
        {data.customer.person_type == 'PJ' && (
          <>
            <Box>
              <Typography variant="h5">Sócio Administrador</Typography>
              <Divider sx={{ marginTop: 2 }} />
              <Grid container spacing={3} sx={{ marginBottom: 2 }}>
                <Grid item xs={12} sm={12} lg={4}>
                  <CustomFormLabel htmlFor="complete_name">Nome Contratante</CustomFormLabel>
                  <CustomTextField
                    disabled={true}
                    name="complete_name"
                    variant="outlined"
                    value={data.customer.complete_name}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <CustomFormLabel htmlFor="complete_name">E-mail</CustomFormLabel>
                  <CustomTextField
                    disabled={true}
                    name="complete_name"
                    variant="outlined"
                    value={data.customer.email}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <FormDate
                    disabled={true}
                    label="Data de Nascimento"
                    name="birth_date"
                    value={data.customer.birth_date}
                  />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <CustomFormLabel htmlFor="complete_name">CPF</CustomFormLabel>
                  <CustomTextField
                    disabled={true}
                    name="complete_name"
                    variant="outlined"
                    value={data.customer.first_document}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <FormSelect
                    disabled={true}
                    name="gender"
                    label="Gênero"
                    options={[
                      { value: 'M', label: 'Masculino' },
                      { value: 'F', label: 'Feminino' },
                    ]}
                    value={data.customer.gender}
                  />
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <CustomFormLabel htmlFor="complete_name">Natureza</CustomFormLabel>
                  <CustomTextField
                    disabled={true}
                    name="complete_name"
                    variant="outlined"
                    value={data.customer.person_type}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ marginTop: 4 }}>
              <AttachmentTable
                appLabel={'financial'}
                model={'financialrecord'}
                objectId={data.id}
              />
            </Box>
          </>
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
          position: 'absolute',
          background: '#fff',
          borderTop: '1px solid #ccc',
          borderRadius: 0,
          bottom: 0,
          width: '85%',
          paddingBottom: '20px',
        }}
      >
        <Box
          sx={{
            minWidth: '20%',
          }}
        >
          <FormSelect
            name="status"
            label="Status"
            options={[
              { value: 'P', label: 'Em Análise' },
              { value: 'R', label: 'Reprovado' },
              { value: 'PA', label: 'Pré-Aprovado' },
              { value: 'A', label: 'Aprovado' },
            ]}
            value={status || data.status}
            onChange={(event) => {
              handleChangeStatus(event.target.value, data.id);
              setStatus(event.target.value);
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default DetailsFundingRequest;
