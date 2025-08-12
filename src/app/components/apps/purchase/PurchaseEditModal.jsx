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
import 'dayjs/locale/pt-br';

// Configurar dayjs para usar locale brasileiro
dayjs.locale('pt-br');
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

export default function PurchaseEditModal({ open, onClose, purchase, onSave, onDelete }) {
  const { formData, errors, loading, handleChange, handleSubmit, resetForm } =
    usePurchaseForm(purchase);

  const handleClose = () => {
    // Não chamar resetForm aqui, pois pode estar limpando os dados
    // resetForm();
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
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.purchase_date,
                  helperText: errors.purchase_date,
                  margin: 'dense',
                  placeholder: 'DD/MM/AAAA',
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
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.delivery_forecast,
                  helperText: errors.delivery_forecast,
                  margin: 'dense',
                  placeholder: 'DD/MM/AAAA',
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
          </Box>
        </DialogContent>
        <DialogActions>
          {/* {purchase && onDelete && (
            <Button
              onClick={() => {
                if (onDelete) {
                  onDelete();
                }
              }}
              disabled={loading}
              color="error"
              variant="outlined"
            >
              Excluir
            </Button>
          )} */}
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
