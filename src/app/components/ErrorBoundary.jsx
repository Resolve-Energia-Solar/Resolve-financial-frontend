import React from 'react';
import { Box, Typography } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          textAlign="center"
          sx={{ backgroundColor: '#fff' }}
        >
          <img
            src="https://res.cloudinary.com/dyykoh8t4/image/upload/v1725114122/Resolve/Logo_R_grande_com_fundo_amarelo_1_gbxfez.png"
            alt="Página em manutenção"
            style={{ width: '100px', marginBottom: '20px' }}
          />
          <Typography variant="h4" gutterBottom>
            Estamos em manutenção. Tente novamente mais tarde.
          </Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
