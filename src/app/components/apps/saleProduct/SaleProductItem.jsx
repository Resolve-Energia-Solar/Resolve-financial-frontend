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
import useSaleProductForm from '@/hooks/salesProducts/useSaleProductForm';
import CustomFieldMoney from '../invoice/components/CustomFieldMoney';

export default function SaleProductItem({ initialData, productName, onUpdated }) {
  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    loading
  } = useSaleProductForm(initialData, initialData.id);

  console.log('formData2', formData);

  useEffect(() => {
    if (!loading && Object.keys(formErrors).length === 0) {
      onUpdated();
    }
  }, [loading, formErrors, onUpdated]);

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
          {['value', 'cost_value', 'reference_value'].map((field, i) => (
            <Grid item xs={12} md={4} key={field}>
              <Typography fontWeight={700} fontSize={14} gutterBottom>
                {(() => {
                  switch (field) {
                    case 'value': return 'Valor';
                    case 'cost_value': return 'Valor de custo';
                    case 'reference_value': return 'Valor de referência';
                  }
                })()}
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
              onClick={handleSave}
              disabled={loading}
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
