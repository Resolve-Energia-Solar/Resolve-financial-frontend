"use client"

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PageContainer from '@/app/components/container/PageContainer';
import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo';
import AuthLogin from '../authForms/AuthLogin';
import Image from 'next/image';

export default function Login() {
  return (
    <PageContainer title="Login Page" description="this is Sample page">
      <Grid container spacing={0} sx={{ height: '100vh', posistion: "relative" }}>
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
              position: "absolute",
              width: "100%",
              height: "100%",
              left: 0,
              top: 0,
              backgroundImage: 'url("/images/backgrounds/login-bg-img-handshake-yellow.svg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              zIndex: 1,
              borderRadius: 0
            }}
          />
          <Box
            component="div"
            sx={{
              position: "absolute",
              width: "99px",
              height: "27.4px",
              left: 128,
              top: 57,
              backgroundImage: 'url("/images/logos/black-resolve-logo.svg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              zIndex: 1,
              borderRadius: 0
            }}
          />


        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          lg={5}
          xl={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            width: "400px",
            backgroundColor: "#FFFFFF",
            borderRadius: 2,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)"

          }}
        >
          <Box sx={{ p: 4, width: "527px", height: "491px", gap: 10}}>
            <AuthLogin
              title="Entrar"
            />
          </Box>
        </Grid>
      </Grid>
    </PageContainer>
  )
};


