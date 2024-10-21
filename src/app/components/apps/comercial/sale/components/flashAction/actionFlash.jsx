import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { FlashOn } from '@mui/icons-material';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';

export default function ActionFlash() {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const StatusDocument = [
    { value: 'F', label: 'Finalizado' },
    { value: 'EA', label: 'Em Andamento' },
    { value: 'C', label: 'Cancelado' },
    { value: 'D', label: 'Distrato' },
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Button variant="outlined" startIcon={<FlashOn />} onClick={handleClickOpen}>
          Ação Rápida
        </Button>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: '400px' } }}
      >
        <DialogTitle sx={{ textAlign: 'center'}}>Ação Rápida</DialogTitle>
        <DialogContent>
        <FormSelect
                  label="Status da Venda"
                  options={StatusDocument}
                  value={selectedStatus}
                  onChange={handleChange}
                  fullWidth

                />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleClose} variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
