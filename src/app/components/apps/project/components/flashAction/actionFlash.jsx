import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import { FlashOn } from '@mui/icons-material';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import saleService from '@/services/saleService';
import { useContext } from 'react';
import { SaleDataContext } from '@/app/context/SaleContext';

export default function ActionFlash({ value }) {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { refreshData } = useContext(SaleDataContext);

  async function sendAll(value) {
    setLoading(true);
    const promises = value.map(async (id) => {
      try {
        await saleService.update(id, { status: selectedStatus });
        setError(false);
      } catch (error) {
        setError(true);
      }
    });

    await Promise.all(promises);
    setLoading(false);
    return !error;
  }

  const statusProject = [
    { value: '1', label: 'Soliticar TRT' },
    { value: '2', label: 'Parecer de Acesso' },
    { value: '3', label: 'Homologar' },
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAction = async () => {
    const success = await sendAll(value);
    if (success) {
      handleClose();
      refreshData();
    }
  };

  const handleChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  if (loading) {
    return <CircularProgress />;
  }

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
        <DialogContent>
          <DialogTitle sx={{ textAlign: 'center' }}>Ação Rápida</DialogTitle>

          {error && (
            <DialogContent sx={{ textAlign: 'center', padding: 0, margin: 0 }}>
              Ocorreu um erro ao atualizar as vendas.
            </DialogContent>
          )}

          <FormSelect
            label="A fazer Engenharia"
            options={statusProject}
            value={statusProject}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleAction}
            variant="contained"
            disabled={loading || !statusProject}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Enviando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
