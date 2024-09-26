"use client";

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/user/userSlice';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AuthSocialButtons from './AuthSocialButtons';
import Cookies from 'js-cookie';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const AuthLogin = ({ title, subtitle, subtext }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false); // Para controlar o Snackbar
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false); // Para o erro
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login/`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Response Data:', data);

      Cookies.set('access_token', data.access, { expires: 1, sameSite: 'Strict' });

      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${data.id}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.access}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Falha ao obter os dados do usuário');
      }

      const userData = await userResponse.json();

      dispatch(setUser({
        user: userData,
        user_permissions: userData.user_permissions,
        last_login: userData.last_login,
        access_token: data.access,
      }));

      // Abrir Snackbar de sucesso
      setOpenSnackbar(true);

      // Redirecionar após 3 segundos
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error) {
      console.error('Login error:', error);
      setError('Falha no login. Verifique suas credenciais e tente novamente.');
      setOpenErrorSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleErrorSnackbarClose = () => {
    setOpenErrorSnackbar(false);
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <AuthSocialButtons title="Logar com" />
      <Box mt={3}>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={2}
          >
            ou logar com
          </Typography>
        </Divider>
      </Box>

      <Stack>
        <Box>
          <CustomFormLabel htmlFor="email">Usuário</CustomFormLabel>
          <CustomTextField
            id="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="password">Senha</CustomFormLabel>
          <CustomTextField
            id="password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
          <FormGroup>
            <FormControlLabel
              control={<CustomCheckbox defaultChecked />}
              label="Lembrar deste dispositivo"
            />
          </FormGroup>
          <Typography
            component={Link}
            href="/auth/auth1/forgot-password"
            fontWeight="500"
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
            }}
          >
            Mudar senha ?
          </Typography>
        </Stack>
      </Stack>
      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSubmit}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
        </Button>
      </Box>
      {subtitle}
      {error && <Typography color="error">{error}</Typography>}

      {/* Snackbar de sucesso */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: '100%' }}
          icon={<CheckCircleIcon fontSize="inherit" />}
        >
          Login efetuado com sucesso! Você será redirecionado em instantes...
        </Alert>
      </Snackbar>

      {/* Snackbar de erro */}
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={3000}
        onClose={handleErrorSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleErrorSnackbarClose}
          severity="error"
          sx={{ width: '100%' }}
        >
          Falha no login. Verifique suas credenciais e tente novamente.
        </Alert>
      </Snackbar>
    </>
  );
};

export default AuthLogin;
