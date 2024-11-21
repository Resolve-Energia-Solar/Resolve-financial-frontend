'use client';
import React from "react";
import { useParams } from "next/navigation";

import { Box, Button, Chip, Divider, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";

import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import fbOptions from "@/app/components/apps/inspections/form-builder/fbOptions";
import PageContainer from "@/app/components/container/PageContainer";

/* hooks */
import useFormBuilder from "@/hooks/inspections/form-builder/useFormBuilder";
import useFormBuilderForm from "@/hooks/inspections/form-builder/useFormBuilderForm";
import ParentCard from "@/app/components/shared/ParentCard";
import { formatDate, formatDateTime } from "@/utils/inspectionFormatDate";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import FormDateTime from "@/app/components/forms/form-custom/FormDateTime";
import FormTimePicker from "@/app/components/forms/form-custom/FormTimePicker";

const FormBuilderView = () => {
  const params = useParams();
  const { id } = params;

  const { loading, error, formBuilderData } = useFormBuilder(id);

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success,
  } = useFormBuilderForm(formBuilderData, id);

  const optionsFB = fbOptions;

  const handleSubmit = (event) => {
    console.log('Formulário enviado');
  };

  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      to: '/apps/inspections/form-builder',
      title: 'Formulários',
    },
    {
      title: 'Visualizar Formulário',
    },
  ];

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PageContainer title="Visualização de Formulário" description="Página de visualização de formulários">
      <Breadcrumb title="Formulário" items={BCrumb} />
      <ParentCard
        title="Visualização de Formulário"
        footer={
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Salvar
            </Button>
          </Box>
        }
      >
        <Box sx={{ padding: 3 }}>
          <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems="center"
              justifyContent="space-between"
              mb={2}
          >
            <Box sx={{
                textAlign: {
                    xs: "center",
                    sm: "left"
                }
            }}>
              <Typography variant="h5"># {id}</Typography>
              <Box mt={1}>
                  <Chip
                      size="small"
                      color="secondary"
                      variant="outlined"
                      label={formatDateTime(formData.created_at)}
                  ></Chip>
              </Box>
            </Box>
            <Logo />
          </Stack>
          <Divider></Divider>
          <Grid container spacing={3} mt={2} mb={4}>
            <Grid item xs={12} sm={12}>
              <Paper variant="outlined">
                <Box p={3} display="flex" flexDirection="column" gap="4px">
                  <Typography variant="h4" gutterBottom>
                    {formData.form_name}
                  </Typography>
                  <Typography variant="body1">
                      Serviço: { formData.service?.name || 'Serviço não disponível' }
                  </Typography>
                  <Typography variant="body1">
                      Categoria: { formData.service?.category?.name || 'Categoria não disponível' }
                  </Typography>
                  <Typography variant="body1">
                      Prazo: { formData.service?.deadline?.name || 'Prazo não disponível' }
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          <Divider></Divider>
          <Box mt={4}>
            <form onSubmit={handleSubmit}>
              {formData.form_fields.map((campo) => {
                switch (campo.type) {
                  case 'text':
                  case 'ariaText':
                  case 'email':
                  case 'number':
                    return (
                      <Grid item xs={12} sm={12} lg={6} key={campo.id}>
                        <CustomFormLabel htmlFor={campo.label}>{campo.label}</CustomFormLabel>
                        <TextField
                          name={campo.label}
                          fullWidth
                          required={campo.required}
                          placeholder={campo.placeholder}
                          type={campo.type === 'ariaText' ? 'text' : campo.type}
                          multiline={campo.type === 'ariaText'}
                          rows={campo.type === 'ariaText' ? 4 : 1}
                          variant="outlined"
                          helperText={campo.description}
                          InputProps={{
                            'aria-label': campo.description,
                          }}
                        />
                      </Grid>
                    );
                  case 'select':
                    return (
                      <Grid item xs={12} sm={12} lg={6} key={campo.id}>
                        <FormControl fullWidth required={campo.required} variant="outlined">
                          <CustomFormLabel htmlFor={campo.label} sx={{ mt: 0 }}>
                            {campo.label}
                          </CustomFormLabel>
                          <CustomSelect
                            id={campo.label}
                            name={campo.label}
                            variant="outlined"
                          >
                            {campo.options.map(option => (
                              <MenuItem key={option.id} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </CustomSelect>
                        </FormControl>
                      </Grid>
                    );
                  case 'date':
                    return (
                      <Grid item xs={12} sm={12} lg={6} key={campo.id}>
                        <FormDateTime
                          label={campo.label}
                          name={campo.label}
                          onChange={() => {}}
                        />
                      </Grid>
                    );
                  case 'time':
                    return (
                      <Grid item xs={12} sm={12} lg={6} key={campo.id}>
                        <FormTimePicker
                          label={campo.label}
                          name={campo.label}
                          helperText={campo.description}
                          onChange={() => {}}
                        />
                      </Grid>
                    );
                  case 'file':
                    return (
                      <Grid item xs={12} sm={12} lg={6} key={campo.id}>
                        <CustomFormLabel htmlFor={campo.label}>{campo.label}</CustomFormLabel>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
                          <Button
                            variant="contained"
                            component="label"
                            color="primary"
                            sx={{ flexShrink: 0 }}
                          >
                            {campo.file ? 'Alterar' : 'Selecionar'}
                            <input
                              type="file"
                              onChange={(event) => {
                                const file = event.target.files[0];
                              }}
                              hidden
                            />
                          </Button>
                          <div style={{ flexGrow: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            {campo.file ? (
                              <strong>{campo.file.name}</strong>
                            ) : formData.banner ? (
                              <strong>{formData.banner.name || formData.banner}</strong>
                            ) : (
                              <span>Nenhum banner selecionado</span>
                            )}
                          </div>
                        </Stack>
                      </Grid>
                    );
                  default:
                    return null;
                }
              })}
            </form>
          </Box>
        </Box>
      </ParentCard>
    </PageContainer>
  );
};

export default FormBuilderView;
