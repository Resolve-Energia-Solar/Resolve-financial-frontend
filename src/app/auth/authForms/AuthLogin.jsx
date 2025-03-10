'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, IconButton, InputAdornment } from '@mui/material';
import Button from '@mui/material/Button';
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
import useLoginForm from '@/hooks/users/useLoginForm';
import Cookies from 'js-cookie';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import EmailIcon from '@mui/icons-material/Email';
import GppGoodIcon from '@mui/icons-material/GppGood';

const AuthLogin = ({ title, subtitle, subtext }) => {
  const dispatch = useDispatch();

  const { formData, formErrors, success, loading, error, handleInputChange, handleSubmit } =
    useLoginForm();

  const handleFormSubmit = async (event) => {
    console.log('handleFormSubmit', event, dispatch, Cookies);
    await handleSubmit(event, dispatch, Cookies);
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <>
      {title && (
        <Typography fontWeight="700" fontSize="24px" >
          {title}
        </Typography>
      )}
      {subtext}

      <Stack>
        <Box>
          <CustomFormLabel htmlFor="email" sx={{ fontWeight: "700", fontSize: "16px" }} >
            E-mail<span style={{ color: '#EA3209' }}>*</span>
          </CustomFormLabel>
          <CustomTextField
            id="email"
            name="email"
            variant="outlined"
            placeholder="Ex: fulano@email.com"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: '#ADADAD' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box>
          <CustomFormLabel htmlFor="password" sx={{ fontWeight: "700", fontSize: "16px" }} >
            Senha<span style={{ color: '#EA3209' }}>*</span>
          </CustomFormLabel>
          <CustomTextField
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            placeholder="******"
            fullWidth
            value={formData.password}
            onChange={handleInputChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GppGoodIcon sx={{ color: '#ADADAD' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff sx={{ color: '#ADADAD' }} /> : <Visibility sx={{ color: '#ADADAD' }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}

          />
        </Box>

        <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
          <Typography
            sx={{
              textDecoration: 'none',
              color: '#EA3209',
              fontWeight: "500",
              fontSize: "12px"
            }}
          >
            *Obrigatório
          </Typography>

          <Typography
            component={Link}
            href="/auth/forgot-password"
            
            sx={{
              textDecoration: 'underline',
              color: 'primary.main',
              fontWeight: "500",
              fontSize: "12px"
            }}
          >
            Esqueci a senha
          </Typography>
        </Stack>

        <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
          <FormGroup>
            <FormControlLabel
              control={<CustomCheckbox defaultChecked />}
              label="Lembrar deste dispositivo"
            />
          </FormGroup>
          
        </Stack>
      </Stack>

      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleFormSubmit}
          type="submit"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
        </Button>
      </Box>

      {subtitle}
      {error && <Typography color="error">{error}</Typography>}

      <Snackbar
        open={success}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          sx={{ width: '100%' }}
          icon={<CheckCircleIcon fontSize="inherit" />}
        >
          Login efetuado com sucesso! Você será redirecionado em instantes...
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          Falha no login. Verifique suas credenciais e tente novamente.
        </Alert>
      </Snackbar>


      {success && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="rgba(255, 255, 255)"
          zIndex={9999}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h6" color="success.main" mb={2}>
              Autenticado com sucesso! Redirecionando...
            </Typography>
            <CircularProgress color="success" size={48} />
          </Box>
        </Box>
      )}
    </>
  );
};

export default AuthLogin;
