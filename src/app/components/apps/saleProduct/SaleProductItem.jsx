'use client';

import React, { useEffect } from 'react';
import {
  Grid,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconTools } from '@tabler/icons-react';
import { useSnackbar } from 'notistack';
import useSaleProductForm from '@/hooks/salesProducts/useSaleProductForm';
import CustomFieldMoney from '../invoice/components/CustomFieldMoney';

export default function SaleProductItem({ initialData, productName, onUpdated }) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    loading
  } = useSaleProductForm(initialData, initialData.id);

  // dispara o refresh no pai somente após salvar com sucesso
  useEffect(() => {
    if (!loading && Object.keys(formErrors).length === 0) {
      onUpdated();
    }
  }, [loading, formErrors, onUpdated]);

  const onClickSave = async () => {
    await handleSave();

    if (Object.keys(formErrors).length > 0) {
      // concatena todas as mensagens de erro
      const errorMessages = Object.entries(formErrors)
        .map(
          ([field, messages]) =>
            `${field.replace(/_/g, ' ')}: ${messages.join(', ')}`
        )
        .join(' • ');
      enqueueSnackbar(errorMessages, { variant: 'error' });
    } else {
      enqueueSnackbar('Alterações salvas com sucesso!', {
        variant: 'success'
      });
    }
  };

  return (
    <Accordion sx={{ mb: 1, boxShadow: 3, borderRadius: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <IconTools size={20} style={{ marginRight: 8, color: '#7E8388' }} />
          <Box>
            <Typography fontWeight={700} fontSize={14}>Produto</Typography>
            <Typography fontWeight={500} fontSize={16} color="text.secondary">
              {productName || '— sem nome —'}
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        <Grid container spacing={2}>
          {['value', 'cost_value', 'reference_value'].map((field) => (
            <Grid item xs={12} md={4} key={field}>
              <Typography fontWeight={700} fontSize={14} gutterBottom>
                {{
                  value: 'Valor',
                  cost_value: 'Valor de custo',
                  reference_value: 'Valor de referência'
                }[field]}
              </Typography>
              <CustomFieldMoney
                name={field}
                fullWidth
                value={formData[field] || ''}
                onChange={(v) => handleChange(field, v)}
                error={!!formErrors[field]}
                helperText={formErrors[field]?.join(', ')}
                sx={{ input: { fontSize: 12, padding: '12px' } }}
              />
            </Grid>
          ))}

          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              onClick={onClickSave}
              disabled={loading}
              endIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
