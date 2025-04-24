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
  Box,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconTools } from '@tabler/icons-react';
import { useSnackbar } from 'notistack';
import useSaleProductForm from '@/hooks/salesProducts/useSaleProductForm';
import CustomFieldMoney from '../invoice/components/CustomFieldMoney';
import HasPermission from '../../permissions/HasPermissions';
import { useSelector } from 'react-redux';
import { ca } from 'date-fns/locale';

export default function SaleProductItem({ initialData, productName, onUpdated }) {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const userPermissions = useSelector((state) => state.user.permissions);
  const canChangeCostValue = userPermissions.includes('resolve_crm.can_change_fineshed_sale');

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    loading
  } = useSaleProductForm(initialData, initialData.id);

  useEffect(() => {
    if (!loading && Object.keys(formErrors).length === 0) {
      onUpdated();
    }
  }, [loading, formErrors, onUpdated]);

  const onClickSave = async () => {
    await handleSave();

    if (Object.keys(formErrors).length > 0) {
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
    <Grid item xs={12} sm={12} lg={12}>
      <Accordion
        sx={{
          borderRadius: '12px',
          mb: 1,
          boxShadow: 3,
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
            <Grid
              item
              xs={1}
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <IconTools size={20} style={{ color: '#7E8388' }} />
            </Grid>
            <Grid
              item
              xs={11}
              sx={{ justifyContent: 'flex-start', display: 'flex', flexDirection: 'column', ml: 1 }}
            >
              <Typography fontWeight={700} fontSize={14}>Produto</Typography>
              <Typography fontWeight={500} fontSize={16} color={'rgba(48, 48, 48, 0.5)'}>
                {productName || 'sem nome'}
              </Typography>
            </Grid>
          </Box>
        </AccordionSummary>

        <AccordionDetails>
          <Grid container spacing={2}>
            {['value', 'cost_value', 'reference_value'].map((field) => {
              const isCostValue = field === 'cost_value';
              const disabled = isCostValue && !canChangeCostValue;
              const fieldValue = disabled ? ' ' : formData[field] || '';
              return (
                <Grid item xs={12} sm={12} lg={4} key={field}>
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
                    value={fieldValue}
                    onChange={(v) => handleChange(field, v)}
                    error={!!formErrors[field]}
                    helperText={formErrors[field]?.join(', ')}
                    disabled={disabled}
                    sx={{
                      input: { fontSize: 12, padding: '12px' },
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid #3E3C41',
                        borderRadius: '9px',
                      },
                      '& .MuiInputBase-input': { padding: '12px' },
                    }}
                  />
                </Grid>
              );
             
            })}
          </Grid>
          <HasPermission
            permissions={['resolve_crm.can_change_fineshed_sale']}
            userPermissions={userPermissions}
          >
            <Grid container xs={12} sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Grid item xs={12} sm={12} lg={4} sx={{ textAlign: 'right' }}>
                <Button
                  variant="contained"
                  onClick={onClickSave}
                  disabled={loading}
                  endIcon={
                    loading ? <CircularProgress size={20} color="inherit" /> : null
                  }
                  fullWidth
                  sx={{
                    px: 8,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.main,
                      border: `1px solid ${theme.palette.primary.main}`,
                    },
                  }}
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </Grid>
            </Grid>
          </HasPermission>

        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
