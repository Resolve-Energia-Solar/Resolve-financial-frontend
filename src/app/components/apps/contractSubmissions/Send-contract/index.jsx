'use client';

import React, { useState } from 'react';
import { Button, CircularProgress, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import useSendContract from '@/hooks/contract/useSendContract';

export default function SendContractButton({ sale }) {
  const {
    sendContract,
    sendingContractId,
    snackbarMessage,
    snackbarSeverity,
    snackbarOpen,
    handleCloseSnackbar,
  } = useSendContract();

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleConfirmSend = () => {
    sendContract(sale);
    handleCloseDialog();
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleOpenDialog}
        startIcon={sendingContractId === sale?.id ? <CircularProgress size={20} /> : <SendIcon />}
        disabled={sendingContractId === sale?.id}
        sx={{
          borderRadius: '8px',
          paddingX: 3,
        }}
      >
        Enviar Contrato
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="confirm-send-contract-title"
        aria-describedby="confirm-send-contract-description"
      >
        <DialogTitle id="confirm-send-contract-title">
          Confirmar envio de contrato
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-send-contract-description">
            Você tem certeza de que deseja enviar o contrato para {sale?.customer?.complete_name || 'este cliente'}? 
            Esta ação não pode ser desfeita.
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
            disabled={sendingContractId === sale?.id}
            startIcon={sendingContractId === sale?.id ? <CircularProgress size={20} /> : null}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
