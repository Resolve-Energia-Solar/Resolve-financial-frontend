'use client';
import React, {
  useState,
  useEffect,
} from "react";
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

/* material */
import {
  Grid,
  Button,
  Stack,
  Alert,
  MenuItem
} from '@mui/material';

/* components */
import AutoCompleteServiceCatalog from "@/app/components/apps/inspections/auto-complete/Auto-input-Service";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import PageContainer from "@/app/components/container/PageContainer";
import ParentCard from "@/app/components/shared/ParentCard";
import fbOptions from "@/app/components/apps/inspections/form-builder/fbOptions";
import FBTextType from "@/app/components/apps/inspections/form-builder/FBTextType";
import FBSelectType from "@/app/components/apps/inspections/form-builder/FBSelectType";

/* hooks */
import useFormBuilderForm from "@/hooks/inspections/form-builder/useFormBuilderForm";

const FormBuilderForm = () => {
  const router = useRouter();

  const optionsFB = fbOptions;

  const [fields, setFields] = useState([]);

  const addField = () => {
    const newFields = {
      id: uuidv4(),
      label: '',
      description: '',
      placeholder: '',
      type: 'text',
      required: false,
      options: [],
    };
    setFields([...fields, newFields]);
  }

  const removeField = (id) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleFieldChange = (id, event) => {
    const { name, value } = event.target;
    const updatedFields = fields.map(field => 
      field.id === id ? { ...field, [name]: value } : field
    );
    console.log(updatedFields);
    setFields(updatedFields);
  };

  const handleClearFields = () => {
    setFields([]);
  };

  const handleSubmit = () => {
    const formJSON = JSON.stringify(fields);
    console.log(formJSON);
  };

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success
  } = useFormBuilderForm();

  useEffect(() => {
    if (success) {
      router.push('/apps/inspections/form-builder');
    }
  }, [success, router]);

  useEffect(() => {
    handleChange('form_fields', fields);
  }, [fields]);

  return (
    <PageContainer title='Criação de Formulário'>
      <Breadcrumb
        title="Criar Formulário"
        description="Criador de Formulários"
      />
      {success && <Alert severity="success" sx={{ marginBottom: 3 }}>Formulário criado com sucesso!</Alert>}
      <ParentCard
        title='Novo Formulário'
        footer={
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="error"
              sx={{
                mr: 1,
              }}
              onClick={handleClearFields}
            >
              Limpar Campos
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
            >
              Salvar
            </Button>
          </Stack>
        }
      >
        <Grid container spacing={3}>

          {/* Name */}
          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel
              htmlFor="form_name"
            >
              Nome
            </CustomFormLabel>
            <CustomTextField
              name="form_name"
              variant="outlined"
              required
              fullWidth
              onChange={(e) => handleChange('form_name', e.target.value)}
              {...(formErrors.form_name && { error: true, helperText: formErrors.form_name })}
            />
          </Grid>

          {/* Service */}
          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel
              htmlFor="service_id"
            >
              Serviço
            </CustomFormLabel>
            <AutoCompleteServiceCatalog
              onChange={(id) => handleChange('service_id', id)}
              value={formData.service_id}
              fullWidth
              {...(formErrors.service_id && {
                error: true,
                helperText: formErrors.service_id,
              })}
            />
          </Grid>
          
          {/* Add Field Button */}
          <Grid item xs={12} sm={12} lg={12} justifyContent="center" mt={2}>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                onClick={addField}
              >
                Adicionar Novo Campo
              </Button>
            </Stack>
          </Grid>
          
          <Grid item xs={12} sm={12} lg={12}>
            <Alert severity="info">
              Pré visualização do Formulário
            </Alert>
          </Grid>

          {/* Fields Preview */}
          <Grid item xs={12} sm={12} lg={12}>
            {fields.map((field) => (
              <ParentCard
                title={`Novo Campo`}
                key={field.id}
              >
                <Grid container spacing={3} mb={3}>
                  <Grid item lg={6} md={12} sm={12}>
                    {field.type === 'text' && ( <FBTextType onChange={handleFieldChange} field={field} /> )}
                    {field.type === 'ariaText' && ( <FBTextType onChange={handleFieldChange} field={field} /> )}
                    {field.type === 'number' && ( <FBTextType onChange={handleFieldChange} field={field} /> )}
                    {field.type === 'email' && ( <FBTextType onChange={handleFieldChange} field={field} /> )}
                    {field.type === 'date' && ( <FBTextType onChange={handleFieldChange} field={field} /> )}
                    {field.type === 'time' && ( <FBTextType onChange={handleFieldChange} field={field} /> )}
                    {field.type === 'select' && ( <FBSelectType onChange={handleFieldChange} field={field} /> )}
                  </Grid>
                  <Grid item lg={6} md={12} sm={12}>
                    <Grid item xs={12}>
                      <CustomFormLabel htmlFor="field_select_type">Tipo do Campo</CustomFormLabel>
                      <CustomSelect
                        id={'field_select_type'}
                        name="type"
                        value={field.type}
                        onChange={(e) => handleFieldChange(field.id, e)}
                        fullWidth
                        variant="outlined"
                      >
                        {optionsFB.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </CustomSelect>
                    </Grid>
                    <Grid item xs={12}>
                      <CustomFormLabel htmlFor="field_required">Campo Obrigatório?</CustomFormLabel>
                      <CustomSelect
                        id={'field_required'}
                        name="required"
                        value={field.required}
                        onChange={(e) => handleFieldChange(field.id, e)}
                        fullWidth
                        variant="outlined"
                      >
                        <MenuItem value={true}>Sim</MenuItem>
                        <MenuItem value={false}>Não</MenuItem>
                      </CustomSelect>
                    </Grid>
                    <Grid item xs={12} marginTop={3}>
                      <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => removeField(field.id)}
                        >
                          Remover Campo
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </ParentCard>
            ))}
          </Grid>
        </Grid>
        {/* Add Field Button */}
        <Grid item xs={12} sm={12} lg={12} justifyContent="center" mt={2}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={addField}
            >
              Adicionar Novo Campo
            </Button>
          </Stack>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default FormBuilderForm;
