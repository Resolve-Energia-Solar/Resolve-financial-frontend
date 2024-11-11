'use client';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import React, { useState } from 'react';

const FBTextType = ({ onChange, field }) => {

  const handleChange = (event) => {
    onChange(field.id, event);
  }

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
        htmlFor={`field_description_${field.id}`}
      >
        Informação do Campo
      </CustomFormLabel>
      <CustomTextField
        id={`field_description_${field.id}`}
        name="description"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={field.description}
        onChange={(e) => handleChange(e, field.id)}
      />
      <CustomFormLabel
        htmlFor={`field_placeholder_${field.id}`}
      >
        Dica do Campo (Placeholder)
      </CustomFormLabel>
      <CustomTextField
        id={`field_placeholder_${field.id}`}
        name="placeholder"
        variant="outlined"
        fullWidth
        value={field.placeholder}
        onChange={(e) => handleChange(e, field.id)}
      />
    </>
  );
};

export default FBTextType;
