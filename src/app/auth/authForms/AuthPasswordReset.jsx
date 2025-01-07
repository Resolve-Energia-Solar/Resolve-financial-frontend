'use client';

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';

import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import PasswordService from '@/services/PasswordService';

export default function AuthPasswordChange() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const uid = searchParams.get('uid');

  const handleNewPasswordChange = (event) => {
    const value = event.target.value;
    setNewPassword(value);
    setShowError(confirmPassword !== '' && value !== confirmPassword);
  };

  const handleConfirmPasswordChange = (event) => {
    const value = event.target.value;
    setConfirmPassword(value);
    setShowError(value !== '' && value !== newPassword);
  };

  const fetchPasswordReset = async () => {
    try {
      setIsSubmitting(true);
      const data = {
        token,
        uid,
        new_password: newPassword,
      };
      console.log('Data:', data);
      const response = await PasswordService.passwordReset(data);
      console.log('Senha resetada com sucesso:', response);
      setSuccessMessage('Senha alterada com sucesso! Redirecionando para o login...');
      setSnackbarOpen(true);

      // Redireciona para a página de login após 3 segundos
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error) {
      setError(error.response?.data || {});
      setSnackbarOpen(true); // Exibe o erro
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    if (newPassword && confirmPassword && !showError) {
      fetchPasswordReset();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Stack mt={4} spacing={2}>
        <CustomFormLabel htmlFor="new-password">Nova Senha</CustomFormLabel>
        <CustomTextField
          id="new-password"
          type="password"
          variant="outlined"
          fullWidth
          value={newPassword}
          onChange={handleNewPasswordChange}
          error={showError || !!error.new_password}
          helperText={showError ? 'As senhas não coincidem.' : error.new_password || ''}
        />

        <CustomFormLabel htmlFor="confirm-password">Confirmar Nova Senha</CustomFormLabel>
        <CustomTextField
          id="confirm-password"
          type="password"
          variant="outlined"
          fullWidth
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={showError}
          helperText={showError ? 'As senhas não coincidem.' : ''}
        />

        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          disabled={!newPassword || !confirmPassword || showError || isSubmitting}
          onClick={handleSubmit}
          endIcon={isSubmitting ? <CircularProgress size={24} color="inherit" /> : null}
        >
          {isSubmitting ? 'Alterando...' : 'Alterar Senha'}
        </Button>

        <Button color="primary" size="large" fullWidth component={Link} href="/auth/login">
          Voltar para o Login
        </Button>
      </Stack>

      {/* Snackbar para exibir mensagens de erro no topo */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {successMessage ? (
          <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
            {successMessage}
          </Alert>
        ) : (
          <Alert onClose={handleCloseSnackbar} severity="error" variant="filled">
            {error?.detail || 'Ocorreu um erro ao redefinir a senha.'}
          </Alert>
        )}
      </Snackbar>
    </>
  );
}
