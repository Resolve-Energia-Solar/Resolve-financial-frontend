'use client';

import { useSystemConfig } from '@/context/SystemConfigContext';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PageContainer from '@/app/components/container/PageContainer';
import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo';
import AuthLogin from '../authForms/AuthLogin';
import Image from 'next/image';

export default function Login() {
  const theme = useTheme();
  const { config } = useSystemConfig();
  const bgImage = config?.configs?.login_bg_img || '/images/login-bg.png';
  const logoImage = config?.configs?.login_logo_img || '/images/logos/black-resolve-logo.svg';

  return (
    <PageContainer title="Login Page" description="this is Sample page" sx={{ p: 0, m: 0 }}>
      <Grid container spacing={0} sx={{ height: '100vh', position: 'relative' }}>
        <Grid
          item
          xs={12}
          sm={12}
          lg={7}
          xl={8}
          sx={{
            position: 'relative',
            height: '100%',

            '&:before': {
              background: '#F9F9F9',
              backgroundSize: '400% 400%',
              animation: 'gradient 15s ease infinite',
              position: 'absolute',
              height: '100%',
              width: '100%',
            },
          }}
        >
          <Box
            component="div"
            sx={{
              position: 'absolute',
              width: '100vw',
              height: '100vh',
              backgroundImage: `url(${bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'transparent',
                zIndex: 1,
                pointerEvents: 'none',
              },
            }}
          />
          <Box
            component="div"
            sx={{
              position: 'absolute',
              width: '120px',
              height: '30.4px',
              left: 128,
              top: 57,
              backgroundImage: `url(${logoImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              zIndex: 1,
            }}
          />
        </Grid>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              width: '527px',
              height: '491px',
              backgroundColor: '#FFFFFF',
              borderRadius: 2,
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
              padding: '48px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <AuthLogin title="Entrar" />
          </Box>
        </Box>
      </Grid>
    </PageContainer>
  );
}
