'use client';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { Alert, Button, Grid, } from '@mui/material';
import React, { useEffect, useState } from 'react';

const FBSelectType = ({ onChange, field }) => {
  const [options, setOptions] = useState([{ value: '0', label: '' }]);

  const handleChange = (event) => {
    onChange(field.id, event);
  }

  const handleOptionChange = (index, event) => {
    const newOptions = [...options];
    newOptions[index] = { value: `${index}`, label: event.target.value };
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { value: `${options.length + 1}`, label: '' }]);
  };

  const removeOption = (index) => {
    if (options.length === 1) return;
    const newOptions = [...options];
    newOptions.splice(index, 1);
    newOptions.forEach((option, index) => {
      option.value = `${index}`;
    });
    setOptions(newOptions);
  };

  useEffect(() => {
    handleChange({ target: { name: 'options', value: options } });
  }, [options]);

  return (
    <>
      <CustomFormLabel
        htmlFor={`field_label_${field.id}`}
      >
        Rótulo do Campo
      </CustomFormLabel>
      <CustomTextField
        id={`field_label_${field.id}`}
        name="label"
        variant="outlined"
        fullWidth
        value={field.label}
        onChange={(e) => handleChange(e, field.id)}
      />
      <CustomFormLabel
        htmlFor={`field_label_${field.id}`}
      >
        Descrição do Campo
      </CustomFormLabel>
      <CustomTextField
        id={`field_label_${field.id}`}
        name="description"
        variant="outlined"
        fullWidth
        value={field.description}
        onChange={(e) => handleChange(e, field.id)}
      />
      <Grid item xs={12} sm={12} lg={12} marginTop={2}>
        <Alert severity="info">
          Opções do Campo
        </Alert>
      </Grid>
      {options.map((option, index) => (
        <div key={index} style={{ display: 'flex', marginTop: '10px' }}>
          <CustomTextField
            name="label"
            label="Rótulo da Opção"
            variant="outlined"
            fullWidth
            value={option.label}
            onChange={(e) => handleOptionChange(index, e)}
          />
          <Button onClick={removeOption} variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
            Remover
          </Button>
        </div>
      ))}
      <Button onClick={addOption} variant="contained" color="primary" style={{ marginTop: '10px' }}>
        Adicionar Opção
      </Button>
    </>
  );
};

export default FBSelectType;
