'use client';

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import BlankCard from '@/app/components/shared/BlankCard';
import SideDrawer from '@/app/components/shared/SideDrawer';
import requestSicoob from '@/services/requestSicoobService';
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Solicicitações de Financiamento',
  },
];

export default function Sicoob() {
  const [rows, setRows] = useState([]);
  const [row, setRow] = useState();
  const [openSideDrawer, setOpenSideDrawer] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchRequestSicoob();
  }, []);

  const fetchRequestSicoob = async () => {
    try {
      const response = await requestSicoob.index({
        expand: ['customer', 'managing_partner'],
        fields: [
          '*',
          'customer.complete_name',
          'customer.person_type',
          'customer.email',
          'customer.first_document',
          'customer.gender',
          'customer.birth_date',
          'managing_partner.complete_name',
        ],
        format: 'json',
      });

      setRows(response.results);
    } catch (error) {
      console.log(error);
    }
  };

  const itemSelected = (row) => {
    console.log(row);
    setRow(row);
    setOpenSideDrawer(true);
  };

  const handleChange = (event) => {
    setFormData((prevData) => ({ ...prevData, [event.target.name]: event.target.value }));
  };

  const handleChangeStatus = async (status, id) => {
    try {
      const response = await requestSicoob.update(id, {
        status,
      });
      fetchRequestSicoob();
      enqueueSnackbar(`Salvo com sucesso`, { variant: 'success' });
    } catch (error) {
      console.log(error);
      enqueueSnackbar(`Erro ao salvar contate o suporte: ${error}`, { variant: 'error' });
    }
  };

  const getStatus = (status) => {
    switch (status) {
      case 'PA':
        return <Chip label="Em análise" color="warning" />;
      case 'approved':
        return <Chip label="Pendente" color="warning" />;
      case 'rejected':
        return <Chip label="Pendente" color="warning" />;
      default:
        return <Chip label="Pendente" color="warning" />;
    }
  };
  return (
    <Box>
      <Breadcrumb items={BCrumb} />
      <BlankCard>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Contratante</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Natureza</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Sócio Administrador</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Status</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} onClick={() => itemSelected(row)}>
                  <TableCell>{row.customer.complete_name}</TableCell>
                  <TableCell>{row.customer.person_type}</TableCell>
                  <TableCell>{row.customer.complete_name}</TableCell>
                  <TableCell>{getStatus(row.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </BlankCard>
      <SideDrawer open={openSideDrawer} onClose={() => setOpenSideDrawer(false)} title="Detalhes">
        {row && (
          <>
            <Box sx={{ marginBottom: 4, overflow: 'auto', height: '100vh', paddingBottom: 30 }}>
              <Box sx={{ marginBottom: 4 }}>
                <Typography variant="h5">Contratante</Typography>
                <Divider sx={{ marginTop: 2 }} />
                <Grid container spacing={3} sx={{ marginBottom: 2 }}>
                  <Grid item xs={12} sm={12} lg={4}>
                    <CustomFormLabel htmlFor="complete_name">Nome Contratante</CustomFormLabel>
                    <CustomTextField
                      disabled={disabled}
                      name="complete_name"
                      variant="outlined"
                      value={formData.complete_name || row.customer.complete_name}
                      fullWidth
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={4}>
                    <CustomFormLabel htmlFor="complete_name">E-mail</CustomFormLabel>
                    <CustomTextField
                      disabled={disabled}
                      name="complete_name"
                      variant="outlined"
                      value={formData.email || row.customer.email}
                      fullWidth
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={4}>
                    <FormDate
                      disabled={disabled}
                      label="Data de Nascimento"
                      name="birth_date"
                      value={formData.birth_date || row.customer.birth_date}
                      onChange={(newValue) =>
                        handleChange({ target: { value: newValue, name: 'birth_date' } })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={4}>
                    <CustomFormLabel htmlFor="complete_name">
                      {row.person_type === 'PF' ? 'CPF' : 'CNPJ'}
                    </CustomFormLabel>
                    <CustomTextField
                      disabled={disabled}
                      name="complete_name"
                      variant="outlined"
                      value={formData.first_document || row.customer.first_document}
                      fullWidth
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={4}>
                    <FormSelect
                      disabled={disabled}
                      name="gender"
                      label="Gênero"
                      options={[
                        { value: 'M', label: 'Masculino' },
                        { value: 'F', label: 'Feminino' },
                      ]}
                      value={formData.gender || row.customer.gender}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} lg={4}>
                    <CustomFormLabel htmlFor="complete_name">Natureza</CustomFormLabel>
                    <CustomTextField
                      disabled={disabled}
                      name="complete_name"
                      variant="outlined"
                      value={formData.person_type || row.customer.person_type}
                      fullWidth
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </Box>
              {row.customer.person_type == 'PJ' && (
                <Box>
                  <Typography variant="h5">Sócio Administrador</Typography>
                  <Divider sx={{ marginTop: 2 }} />
                  <Grid container spacing={3} sx={{ marginBottom: 2 }}>
                    <Grid item xs={12} sm={12} lg={4}>
                      <CustomFormLabel htmlFor="complete_name">Nome Contratante</CustomFormLabel>
                      <CustomTextField
                        disabled={disabled}
                        name="complete_name"
                        variant="outlined"
                        value={formData.complete_name || row.customer.complete_name}
                        fullWidth
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4}>
                      <CustomFormLabel htmlFor="complete_name">E-mail</CustomFormLabel>
                      <CustomTextField
                        disabled={disabled}
                        name="complete_name"
                        variant="outlined"
                        value={formData.email || row.customer.email}
                        fullWidth
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4}>
                      <FormDate
                        disabled={disabled}
                        label="Data de Nascimento"
                        name="birth_date"
                        value={formData.birth_date || row.customer.birth_date}
                        onChange={(newValue) =>
                          handleChange({ target: { value: newValue, name: 'birth_date' } })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4}>
                      <CustomFormLabel htmlFor="complete_name">CPF</CustomFormLabel>
                      <CustomTextField
                        disabled={disabled}
                        name="complete_name"
                        variant="outlined"
                        value={formData.first_document || row.customer.first_document}
                        fullWidth
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4}>
                      <FormSelect
                        disabled={disabled}
                        name="gender"
                        label="Gênero"
                        options={[
                          { value: 'M', label: 'Masculino' },
                          { value: 'F', label: 'Feminino' },
                        ]}
                        value={formData.gender || row.customer.gender}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4}>
                      <CustomFormLabel htmlFor="complete_name">Natureza</CustomFormLabel>
                      <CustomTextField
                        disabled={disabled}
                        name="complete_name"
                        variant="outlined"
                        value={formData.person_type || row.customer.person_type}
                        fullWidth
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                </Box>
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
                  value={formData.status || row.status}
                  onChange={(event) => handleChangeStatus(event.target.value, row.id)}
                />
              </Box>
            </Box>
          </>
        )}
      </SideDrawer>
    </Box>
  );
}
