'use client';
import React from 'react';
import { styled } from '@mui/material/styles';
import { TextareaAutosize } from '@mui/material';

const CustomTextArea = styled((props) => <TextareaAutosize {...props} />)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.fontSize,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  width: '100%',
  resize: 'vertical',

  '&::placeholder': {
    color: theme.palette.text.secondary,
    opacity: 0.8,
  },
  '&:disabled::placeholder': {
    color: theme.palette.text.secondary,
    opacity: 1,
  },
  '&:disabled': {
    borderColor: theme.palette.grey[200],
    backgroundColor: theme.palette.grey[100],
  },
}));

export default CustomTextArea;

