import {
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';
import ProposalForm from './Add-proposal';
import { useState } from 'react';

const ProposalManager = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleAddProposal = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const closeSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="flex-start" mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddProposal}
            startIcon={<AddIcon />}
          >
            Adicionar Proposta
          </Button>
        </Box>
      </Grid>

      {!isFormVisible && (
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" mt={4}>
            <Typography variant="h6" gutterBottom>
              Nenhuma proposta encontrada
            </Typography>
          </Box>
        </Grid>
      )}

      {isFormVisible && (
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ p: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Adicionar Proposta
              </Typography>
              <ProposalForm
                handleCloseForm={handleCloseForm}
                setSnackbarMessage={setSnackbarMessage}
                setSnackbarSeverity={setSnackbarSeverity}
                setIsSnackbarOpen={setIsSnackbarOpen}
              />
            </CardContent>
          </Card>
        </Grid>
      )}

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ProposalManager;

