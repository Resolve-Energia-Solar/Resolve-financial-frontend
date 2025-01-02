'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import fbOptions from '../fbOptions';
import useFormBuilderForm from '@/hooks/inspections/form-builder/useFormBuilderForm';
import ParentCard from '@/app/components/shared/ParentCard';
import { Alert, Button, Grid, MenuItem, Stack } from '@mui/material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FBTextType from '../FBTextType';
import FBSelectType from '../FBSelectType';
import CustomSelect from '@/app/components/forms/theme-elements/CustomSelect';

const CreateForm = ({ onClosedModal = null, selectedFormId = null }) => {
  const optionsFB = fbOptions;
  const router = useRouter();

  const { formData, handleChange, handleSave, formErrors, success, dataReceived } =
    useFormBuilderForm();

  const [fields, setFields] = useState([]);

  const addField = () => {
    const newFields = {
      id: uuidv4(),
      label: '',
      description: '',
      placeholder: '',
      type: 'text',
      required: false,
      multiple: false,
      options: [],
    };
    setFields([...fields, newFields]);
  };

  const handleFieldChange = (id, event) => {
    const { name, value } = event.target;
    const updatedFields = fields.map((field) =>
      field.id === id ? { ...field, [name]: value } : field,
    );
    console.log(updatedFields);
    setFields(updatedFields);
  };

  useEffect(() => {
    handleChange('form_fields', fields);
  }, [fields]);

  const removeField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleClearFields = () => {
    setFields([]);
  };

  useEffect(() => {
    if (success) {
      if (onClosedModal) {
        onClosedModal();
        selectedFormId(dataReceived.id);
      } else {
        router.push('/apps/inspections/form-builder');
      }
    }
  }, [success]);

  return (
    <ParentCard
      title="Novo Formulário"
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
          <Button variant="contained" color="primary" onClick={handleSave}>
            Salvar
          </Button>
        </Stack>
      }
    >
      <Grid container spacing={3}>
        {/* Name */}
        <Grid item xs={12} sm={12} lg={6}>
          <CustomFormLabel htmlFor="form_name">Nome</CustomFormLabel>
          <CustomTextField
            name="form_name"
            variant="outlined"
            required
            fullWidth
            onChange={(e) => handleChange('form_name', e.target.value)}
            {...(formErrors.form_name && { error: true, helperText: formErrors.form_name })}
          />
        </Grid>

        {/* Add Field Button */}
        <Grid item xs={12} sm={12} lg={12} justifyContent="center" mt={2}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" color="primary" onClick={addField}>
              Adicionar Novo Campo
            </Button>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={12} lg={12}>
          <Alert severity="info">Pré visualização do Formulário</Alert>
        </Grid>

        {/* Fields Preview */}
        <Grid item xs={12} sm={12} lg={12}>
          {fields.map((field) => (
            <ParentCard title={`Novo Campo`} key={field.id}>
              <Grid container spacing={3} mb={3}>
                <Grid item lg={6} md={12} sm={12}>
                  {field.type === 'text' && (
                    <FBTextType onChange={handleFieldChange} field={field} />
                  )}
                  {field.type === 'ariaText' && (
                    <FBTextType onChange={handleFieldChange} field={field} />
                  )}
                  {field.type === 'number' && (
                    <FBTextType onChange={handleFieldChange} field={field} />
                  )}
                  {field.type === 'email' && (
                    <FBTextType onChange={handleFieldChange} field={field} />
                  )}
                  {field.type === 'date' && (
                    <FBTextType onChange={handleFieldChange} field={field} />
                  )}
                  {field.type === 'time' && (
                    <FBTextType onChange={handleFieldChange} field={field} />
                  )}
                  {field.type === 'select' && (
                    <FBSelectType onChange={handleFieldChange} field={field} />
                  )}
                  {field.type === 'file' && (
                    <FBTextType onChange={handleFieldChange} field={field} />
                  )}
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
          <Button variant="contained" color="primary" onClick={addField}>
            Adicionar Novo Campo
          </Button>
        </Stack>
      </Grid>
    </ParentCard>
  );
};

export default CreateForm;
