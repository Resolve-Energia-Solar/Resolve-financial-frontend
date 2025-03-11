'use client';

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import PasswordService from '@/services/PasswordService';
import EmailIcon from '@mui/icons-material/Email';
import { InputAdornment } from '@mui/material';


export default function AuthForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async () => {
    if (!email) {
      setError('Por favor, insira seu e-mail.');
      setSnackbarOpen(true);
      return;
    }

    setError('');
    setSuccessMessage('');
    
    try {
      setIsSubmitting(true);
      await PasswordService.sendPasswordResetEmail({ email });
      setSuccessMessage('Se o e-mail informado estiver correto você receberá uma mensagem com as instruções para redefinir sua senha.');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erro ao enviar o e-mail:', error);
      setError('Ocorreu um erro ao enviar o e-mail. Tente novamente.');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Stack mt={4} spacing={2}>
        <CustomFormLabel htmlFor="reset-email" sx={{ fontWeight: "700", fontSize: "16px" }}>
          E-mail<span style={{ color: '#EA3209' }}>*</span>
        </CustomFormLabel>
        <CustomTextField
          id="reset-email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={handleEmailChange}
          error={!!error}
          helperText={error}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: '#ADADAD' }} />
              </InputAdornment>
            ),
          }}
        />

        <Button
          color="primary"
          variant="contained"
          size="medium"
          fullWidth
          disabled={isSubmitting || !email}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Enviar'
          )}
        </Button>

        <Button
          color="primary"
          size="medium"
          fullWidth
          component={Link}
          href="/auth/login"
        >
          Voltar para o Login
        </Button>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || successMessage}
        </Alert>
      </Snackbar>
    </>
  );
}