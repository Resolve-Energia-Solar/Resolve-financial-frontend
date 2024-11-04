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
    </>
  );
};

export default FBTextType;
