import { useState } from 'react';
import useSendContract from '@/hooks/contract/useSendContract';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function SendContractButton({ saleId }) {
  const { loading, snackbar, sendContract, handleCloseSnackbar } = useSendContract(saleId);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleConfirmSend = () => {
    handleDialogClose();
    sendContract();
  };

  return (
    <>
      {/* Botão principal */}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleDialogOpen}
        disabled={loading}
        endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {loading ? 'Enviando...' : 'Enviar Contrato'}
      </Button>

      {/* Dialog de confirmação */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirmar Envio</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Tem certeza de que deseja enviar o contrato? Essa ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmSend} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
