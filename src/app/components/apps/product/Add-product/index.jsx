'use client';
import React, { useContext, useState, useEffect } from 'react';
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
  IconButton,
  Tooltip,
  Box,
  Stack,
  Divider,
  Grid,
  CircularProgress,
} from '@mui/material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import { IconSquareRoundedPlus, IconTrash } from '@tabler/icons-react';

import useProductForm from '@/hooks/products/useProductForm';
import AutoCompleteBranch from '../../comercial/sale/components/auto-complete/Auto-Input-Branch';
import AutoCompleteRoofType from '../../roof/autoCompleteRoof';
import AutoCompleteMaterial from '../../comercial/sale/components/auto-complete/Auto-Input-Material';
import CustomFieldMoney from '../../invoice/components/CustomFieldMoney';
import HasPermission from '@/app/components/permissions/HasPermissions';
import { useSelector } from 'react-redux';

const CreateProduct = ({
  sale = null,
  onClosedModal = null,
  onRefresh = null,
  onAddProduct = null,
}) => {
  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success,
    response,
    loading: formLoading,
    handleMaterialChange,
    handleAddMaterial,
    handleDeleteMaterial,
  } = useProductForm();

  const userPermissions = useSelector((state) => state.user.permissions);

  useEffect(() => {
    if (success) {
      if (onAddProduct) {
        onAddProduct(response);
      }

      if (onClosedModal) {
        onClosedModal();
        if (onRefresh) onRefresh();
      }
    }
  }, [success]);

  formData.sale_id = sale?.id || null;
  formData.default = 'N';

  return (
    <Box>
      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2, md: 4 }}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Criar Produto</Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={formLoading}
            endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Salvar Produto
          </Button>
        </Box>
      </Stack>
      <Divider></Divider>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={12} lg={6}>
          <CustomFormLabel htmlFor="name">Nome</CustomFormLabel>
          <CustomTextField
            name="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Nome do Produto"
            variant="outlined"
            fullWidth
            {...(formErrors.name && { error: true, helperText: formErrors.name })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={6}>
          <CustomFormLabel htmlFor="kwp">Kwp</CustomFormLabel>
          <CustomTextField
            name="kwp"
            value={formData.params}
            type="number"
            onChange={(e) => handleChange('params', e.target.value)}
            placeholder="Kwp"
            variant="outlined"
            fullWidth
            {...(formErrors.params && { error: true, helperText: formErrors.params })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={6}>
          <CustomFormLabel htmlFor="product_value">Valor do Produto</CustomFormLabel>
          <CustomFieldMoney
            name="product_value"
            value={formData.product_value}
            onChange={(value) => handleChange('product_value', value)}
            placeholder="R$ 3.000,00"
            variant="outlined"
            fullWidth
            {...(formErrors.product_value && { error: true, helperText: formErrors.product_value })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={6}>
          <CustomFormLabel htmlFor="reference_value">Valor de Referência</CustomFormLabel>
          <CustomFieldMoney
            name="reference_value"
            value={formData.reference_value}
            onChange={(value) => handleChange('reference_value', value)}
            placeholder="R$ 14.000,00"
            variant="outlined"
            fullWidth
            {...(formErrors.reference_value && {
              error: true,
              helperText: formErrors.reference_value,
            })}
          />
        </Grid>
        <HasPermission
          permissions={['logistics.view_product_cost_value']}
          userPermissions={userPermissions}
        >
          <Grid item xs={12} sm={12} lg={6}>
            <CustomFormLabel htmlFor="cost_value">Valor de Custo</CustomFormLabel>
            <CustomFieldMoney
              name="cost_value"
              value={formData.cost_value}
              onChange={(value) => handleChange('cost_value', value)}
              placeholder="R$ 10.000,00"
              variant="outlined"
              fullWidth
              {...(formErrors.cost_value && { error: true, helperText: formErrors.cost_value })}
            />
          </Grid>
        </HasPermission>
        <Grid item xs={12} sm={12} lg={6}>
          <CustomFormLabel htmlFor="branches_ids">Filial</CustomFormLabel>
          <AutoCompleteBranch
            name="branches_ids"
            value={formData.branches_ids}
            onChange={(value) => handleChange('branches_ids', value)}
            placeholder="Selecione a Filial"
            variant="outlined"
            fullWidth
            {...(formErrors.branches_ids && { error: true, helperText: formErrors.branches_ids })}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={12}>
          <CustomFormLabel htmlFor="roof_type_id">Tipo de Telhado</CustomFormLabel>
          <AutoCompleteRoofType
            name="roof_type_id"
            value={formData.roof_type_id}
            size="small"
            onChange={(value) => handleChange('roof_type_id', value)}
            placeholder="Selecione o Tipo de Telhado"
            variant="outlined"
            fullWidth
            {...(formErrors.roof_type_id && { error: true, helperText: formErrors.roof_type_id })}
          />
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
                <TableCell>
                  <Typography variant="h6" fontSize="14px">
                    Ações
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.materials_ids.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                    <Button variant="contained" color="primary" onClick={handleAddMaterial}>
                      Adicionar Novo Material
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                formData.materials_ids.map((material, index) => (
                  <TableRow key={material.id}>
                    <TableCell style={{ width: '40%' }}>
                      <AutoCompleteMaterial
                        name="material"
                        onChange={(value) => handleMaterialChange(index, 'material_id', value)}
                        variant="outlined"
                        fullWidth
                        value={material.material_id}
                        {...(formErrors.materials_ids &&
                          formErrors.materials_ids[index]?.material_id && {
                            error: true,
                            helperText: formErrors.materials_ids[index].material_id,
                          })}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomTextField
                        type="number"
                        value={material.amount}
                        onChange={(e) => handleMaterialChange(index, 'amount', e.target.value)}
                        {...(formErrors.materials_ids &&
                          formErrors.materials_ids[index]?.amount && {
                            error: true,
                            helperText: formErrors.materials_ids[index].amount,
                          })}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Add Item">
                        <IconButton onClick={handleAddMaterial} color="primary">
                          <IconSquareRoundedPlus width={22} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Item">
                        <IconButton color="error" onClick={() => handleDeleteMaterial(index)}>
                          <IconTrash width={22} />
                        </IconButton>
                      </Tooltip>
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

export default CreateProduct;
