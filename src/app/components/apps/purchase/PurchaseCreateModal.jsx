// src/app/components/apps/purchase/PurchaseCreateModal.jsx
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  MenuItem,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { usePurchaseForm } from '@/hooks/purchase/usePurchaseForm';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';

const statusOptions = [
  { value: 'R', label: 'Compra realizada' },
  { value: 'C', label: 'Cancelada' },
  { value: 'D', label: 'Distrato' },
  { value: 'A', label: 'Aguardando pagamento' },
  { value: 'P', label: 'Pendente' },
  { value: 'F', label: 'Aguardando Previsão de Entrega' },
];

export default function PurchaseCreateModal({ open, onClose, onSave }) {
  const { formData, errors, loading, handleChange, handleSubmit, resetForm } = usePurchaseForm(); // null = modo criação

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
        <DialogTitle>Nova Compra</DialogTitle>
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

            <GenericAsyncAutocompleteInput
              label="Projeto *"
              value={formData.project || null}
              onChange={(option) => {
                handleChange('project', option?.value || null);
              }}
              endpoint="/api/projects/"
              queryParam="q"
              extraParams={{
                expand: ['sale.customer', 'product'],
                fields: ['id', 'project_number', 'sale.customer.complete_name', 'product.name'],
                limit: 15,
                page: 1,
              }}
              mapResponse={(data) =>
                data.results.map((p) => ({
                  label: `${p.project_number} - ${
                    p.sale?.customer?.complete_name || 'Cliente não informado'
                  } - ${p.product?.name || 'Produto não informado'}`,
                  value: p.id,
                }))
              }
              error={!!errors.project}
              helperText={errors.project}
              margin="dense"
            />

            <GenericAsyncAutocompleteInput
              label="Fornecedor *"
              value={formData.supplier || null}
              onChange={(option) => {
                handleChange('supplier', option?.value || null);
              }}
              endpoint="/api/users/"
              queryParam="complete_name__icontains"
              extraParams={{
                fields: ['id', 'complete_name'],
                limit: 15,
                page: 1,
              }}
              mapResponse={(data) =>
                data.results.map((u) => ({
                  label: u.complete_name,
                  value: u.id,
                }))
              }
              error={!!errors.supplier}
              helperText={errors.supplier}
              margin="dense"
            />

            <TextField
              select
              label="Status"
              fullWidth
              margin="dense"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              error={!!errors.status}
              helperText={errors.status}
            >
              <MenuItem value="">
                <em>Selecione um status</em>
              </MenuItem>
              {statusOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Valor da Compra"
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
              inputProps={{ maxLength: 50 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Criar Compra'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
