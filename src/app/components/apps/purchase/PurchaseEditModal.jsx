// src/app/components/PurchaseEditModal.jsx
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { usePurchaseForm } from '@/hooks/purchase/usePurchaseForm';

const statusOptions = [
  { value: 'R', label: 'Compra realizada' },
  { value: 'C', label: 'Cancelada' },
  { value: 'D', label: 'Distrato' },
  { value: 'A', label: 'Aguardando pagamento' },
  { value: 'P', label: 'Pendente' },
  { value: 'F', label: 'Aguardando Previsão de Entrega' },
];

export default function PurchaseEditModal({ open, onClose, purchase, onSave, onDelete }) {
  console.log('PurchaseEditModal props:', {
    purchase: !!purchase,
    onDelete: !!onDelete,
    purchaseId: purchase?.id,
  });

  const {
    formData,
    errors,
    loading,
    suppliers,
    projects,
    loadingSuppliers,
    loadingProjects,
    handleChange,
    handleSubmit,
    resetForm,
  } = usePurchaseForm(purchase);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    const success = await handleSubmit();
    if (success) {
      onSave();
      handleClose();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{purchase ? 'Editar Compra' : 'Nova Compra'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
            <DatePicker
              label="Data da Compra *"
              value={formData.purchase_date ? dayjs(formData.purchase_date) : null}
              onChange={(newValue) => handleChange('purchase_date', newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.purchase_date,
                  helperText: errors.purchase_date,
                  margin: 'dense',
                },
              }}
            />

            <FormControl fullWidth margin="dense" error={!!errors.status}>
              <InputLabel>Status *</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                label="Status *"
              >
                {statusOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.status && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.status}
                </Typography>
              )}
            </FormControl>

            <TextField
              label="Valor da Compra *"
              fullWidth
              margin="dense"
              type="number"
              value={formData.purchase_value}
              onChange={(e) => handleChange('purchase_value', e.target.value)}
              error={!!errors.purchase_value}
              helperText={errors.purchase_value}
              inputProps={{ min: 0, step: 0.01 }}
            />

            <DatePicker
              label="Previsão de Entrega"
              value={formData.delivery_forecast ? dayjs(formData.delivery_forecast) : null}
              onChange={(newValue) => handleChange('delivery_forecast', newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.delivery_forecast,
                  helperText: errors.delivery_forecast,
                  margin: 'dense',
                },
              }}
            />

            <TextField
              label="Número de Entrega"
              fullWidth
              margin="dense"
              value={formData.delivery_number}
              onChange={(e) => handleChange('delivery_number', e.target.value)}
            />

            <FormControl fullWidth margin="dense" error={!!errors.project}>
              <InputLabel>Projeto *</InputLabel>
              <Select
                value={formData.project}
                onChange={(e) => handleChange('project', e.target.value)}
                label="Projeto *"
                disabled={loadingProjects}
              >
                {loadingProjects ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                    <Typography sx={{ ml: 1 }}>Carregando projetos...</Typography>
                  </MenuItem>
                ) : (
                  projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name} -{' '}
                      {project.sale?.customer?.complete_name || 'Cliente não informado'}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.project && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.project}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth margin="dense" error={!!errors.supplier}>
              <InputLabel>Fornecedor *</InputLabel>
              <Select
                value={formData.supplier}
                onChange={(e) => handleChange('supplier', e.target.value)}
                label="Fornecedor *"
              >
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.complete_name}
                  </MenuItem>
                ))}
              </Select>
              {errors.supplier && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.supplier}
                </Typography>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          {purchase && onDelete && (
            <Button
              onClick={() => {
                console.log('🔴 Botão excluir clicado no modal!');
                console.log('🔴 onDelete function:', onDelete);
                if (onDelete) {
                  console.log('🔴 Chamando onDelete...');
                  onDelete();
                } else {
                  console.error('🔴 onDelete não está definido!');
                }
              }}
              disabled={loading}
              color="error"
              variant="outlined"
            >
              Excluir
            </Button>
          )}
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
