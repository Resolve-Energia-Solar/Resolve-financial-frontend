'use client';
import React from 'react';
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Stack,
  Divider,
  Grid,
  CircularProgress,
} from '@mui/material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import useProduct from '@/hooks/products/useProduct';
import FormPageSkeleton from '../../comercial/sale/components/FormPageSkeleton';

const DetailProduct = ({ productId = null }) => {
  const { loading, error, productData } = useProduct(productId);

  console.log('productData', productData);

  if (loading) {
    return <FormPageSkeleton />;
  }

  if (error) {
    return <Typography color="error">Erro ao carregar o produto.</Typography>;
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Box>
      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2, md: 4 }}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Detalhes do Produto</Typography>
      </Stack>
      <Divider />

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel>Nome</CustomFormLabel>
          <Typography
            sx={{
              fontStyle: 'italic',
              fontWeight: 'light',
              borderBottom: `1px dashed`,
            }}
          >
            {productData?.name}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel>Valor do Produto</CustomFormLabel>
          <Typography
            sx={{
              fontStyle: 'italic',
              fontWeight: 'light',
              borderBottom: `1px dashed`,
            }}
          >
            {formatCurrency(productData?.product_value)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel>Valor de Referência</CustomFormLabel>
          <Typography
            sx={{
              fontStyle: 'italic',
              fontWeight: 'light',
              borderBottom: `1px dashed`,
            }}
          >
            {formatCurrency(productData?.reference_value)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel>Valor de Custo</CustomFormLabel>
          <Typography
            sx={{
              fontStyle: 'italic',
              fontWeight: 'light',
              borderBottom: `1px dashed`,
            }}
          >
            {formatCurrency(productData?.cost_value)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel>Filial</CustomFormLabel>
          <Typography
            sx={{
              fontStyle: 'italic',
              fontWeight: 'light',
              borderBottom: `1px dashed`,
            }}
          >
            {productData?.branch.name}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomFormLabel>Tipo de Telhado</CustomFormLabel>
          <Typography
            sx={{
              fontStyle: 'italic',
              fontWeight: 'light',
              borderBottom: `1px dashed`,
            }}
          >
            {productData?.roof_type.name}
          </Typography>
        </Grid>
      </Grid>

      <Paper variant="outlined">
        <TableContainer sx={{ whiteSpace: { xs: 'nowrap', md: 'unset' } }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6" fontSize="14px">
                    Material
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" fontSize="14px">
                    Quantidade
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productData?.materials?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                    Nenhum material associado.
                  </TableCell>
                </TableRow>
              ) : (
                productData.materials.map((material, index) => (
                  <TableRow key={material.id}>
                    <TableCell style={{ width: '40%' }}>
                      <Typography>{material?.material?.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{Math.floor(material?.amount)}</Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DetailProduct;

