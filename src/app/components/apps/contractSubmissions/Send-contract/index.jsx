'use client';

import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import useSendContract from '@/hooks/contract/useSendContract';
import { CheckCircle, Error } from '@mui/icons-material';

export default function SendContractButton({ sale }) {
  const { sendContract, error: formErrors, loading } = useSendContract(sale?.id);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const formatFieldName = (fieldName) => {
    const fieldLabels = {
      detail: 'Detalhes',
      message: 'Detalhes',
    };

    return fieldLabels[fieldName] || fieldName;
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleConfirmSend = async () => {
    handleCloseDialog();
    await sendContract();
    setSnackbarOpen(true);
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleOpenDialog}
        disabled={loading}
        endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
      >
        Enviar Contrato
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="confirm-send-contract-title"
        aria-describedby="confirm-send-contract-description"
      >
        <DialogTitle id="confirm-send-contract-title">Confirmar envio de contrato</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-send-contract-description">
            Você tem certeza de que deseja enviar o contrato para{' '}
            {sale?.customer?.complete_name || 'este cliente'}? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmSend}
            color="secondary"
            autoFocus
            disabled={loading}
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={formErrors && Object.keys(formErrors).length > 0 ? 'error' : 'success'}
          sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
          iconMapping={{
            error: <Error style={{ verticalAlign: 'middle' }} />,
            success: <CheckCircle style={{ verticalAlign: 'middle' }} />,
          }}
        >
          {formErrors && Object.keys(formErrors).length > 0 ? (
            <ul
              style={{
                margin: '10px 0',
                paddingLeft: '20px',
                listStyleType: 'disc',
              }}
            >
              {Object.entries(formErrors).map(([field, messages]) => {
                console.log('Field:', field, 'Messages:', messages);
                return (
                  <li key={field} style={{ marginBottom: '8px' }}>
                    {`${formatFieldName(field)}: ${
                      Array.isArray(messages) ? messages.join(', ') : messages
                    }`}
                  </li>
                );
              })}
            </ul>
          ) : (
            'Contrato enviado com sucesso!'
          )}
        </Alert>
      </Snackbar>
    </>
  );
}
