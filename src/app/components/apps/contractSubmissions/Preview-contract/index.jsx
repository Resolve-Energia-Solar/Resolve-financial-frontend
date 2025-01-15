import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, Snackbar, Alert, Typography } from '@mui/material';
import usePreviewContract from '@/hooks/contract/usePreviewContract';

function PreviewContractModal({ saleId }) {
  const {
    loading,
    error,
    success,
    contractPDF,
    previewContract,
    snackbar,
    handleCloseSnackbar,
  } = usePreviewContract(saleId);

  console.log('contractPDF preview', contractPDF);

  // Estado para controle do modal
  const [open, setOpen] = useState(false);

  // Função para abrir o modal
  const handleOpen = () => {
    setOpen(true);
    previewContract(); 
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Visualizar Contrato
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogContent>
          {loading && <Typography>Carregando contrato...</Typography>}
          {error && <Alert severity="error">{error}</Alert>}
          {success && !loading && contractPDF && (
            <iframe 
              src={contractPDF} 
              height="100%" width="100%"></iframe>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PreviewContractModal;
