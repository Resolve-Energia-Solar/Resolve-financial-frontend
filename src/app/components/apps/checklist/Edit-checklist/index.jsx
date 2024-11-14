'use client';
import {
  Grid,
  Button,
  Stack,
  FormControlLabel,
  Tabs,
  Tab,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Input,
  Link,
} from '@mui/material';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import { useParams } from 'next/navigation';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import FormDateTime from '@/app/components/forms/form-custom/FormDateTime';
import useCurrencyFormatter from '@/hooks/useCurrencyFormatter';
import { useSelector } from 'react-redux';
import FormPageSkeleton from '@/app/components/apps/comercial/sale/components/FormPageSkeleton';

import useUnit from '@/hooks/units/useUnit';
import useUnitForm from '@/hooks/units/useUnitForm';
import AutoCompleteAddress from '../../comercial/sale/components/auto-complete/Auto-Input-Address';
import AutoCompleteSupplyAds from '../components/auto-complete/Auto-Input-SupplyAds';

const EditChecklistPage = ({ unitId = null, onClosedModal = null }) => {
  const params = useParams();
  let id = unitId;
  if (!unitId) id = params.id;

  const userPermissions = useSelector((state) => state.user.permissions);

  const hasPermission = (permissions) => {
    if (!permissions) return true;
    return permissions.some((permission) => userPermissions.includes(permission));
  };

  const { loading, error, unitData } = useUnit(id);
  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    loading: formLoading,
    success,
  } = useUnitForm(unitData, id);

  return (
    <Box>
      {loading ? (
        <FormPageSkeleton />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box>
          <>
            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Unidade salva com sucesso!
              </Alert>
            )}
            <Grid container spacing={3}>
            <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="account_number">Número do medidor</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  variant="outlined"
                  value={formData.account_number}
                  onChange={(e) => handleChange('account_number', e.target.value)}
                  {...(formErrors.account_number && {
                    error: true,
                    helperText: formErrors.account_number,
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="name">Nome</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  variant="outlined"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  {...(formErrors.name && { error: true, helperText: formErrors.name })}
                />
              </Grid>

              <Grid item xs={12} sm={12} lg={4}>
                <CustomFormLabel htmlFor="unit_percentage">Porcentagem de Rateio</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  variant="outlined"
                  value={formData.unit_percentage}
                  onChange={(e) => handleChange('unit_percentage', e.target.value)}
                  {...(formErrors.unit_percentage && {
                    error: true,
                    helperText: formErrors.unit_percentage,
                  })}
                />
              </Grid>

              <Grid item xs={12} sm={12} lg={6}>
                <CustomFormLabel htmlFor="type">Tipo de Fornecimento</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  variant="outlined"
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  {...(formErrors.type && { error: true, helperText: formErrors.type })}
                />
              </Grid>

              <Grid item xs={12} sm={12} lg={6}>
                <CustomFormLabel htmlFor="unit_number">Conta contrato</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  variant="outlined"
                  value={formData.unit_number}
                  onChange={(e) => handleChange('unit_number', e.target.value)}
                  {...(formErrors.unit_number && {
                    error: true,
                    helperText: formErrors.unit_number,
                  })}
                />
              </Grid>


              <Grid item xs={12} sm={12} lg={6}>
                <CustomFormLabel htmlFor="name">Endereço</CustomFormLabel>
                <AutoCompleteAddress
                  onChange={(id) => handleChange('address_id', id)}
                  value={formData.address_id}
                  {...(formErrors.address_id && { error: true, helperText: formErrors.address_id })}
                />
              </Grid>

              <Grid item xs={12} sm={12} lg={6}>
                <CustomFormLabel htmlFor="supply_adquance_ids">Adequação de Fornecimento</CustomFormLabel>
                <AutoCompleteSupplyAds
                  onChange={(ids) => handleChange('supply_adquance_ids', ids)}
                  value={formData.supply_adquance_ids}
                  {...(formErrors.supply_adquance_ids && {
                    error: true,
                    helperText: formErrors.supply_adquance_ids,
                  })}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="bill_file">Arquivo</CustomFormLabel>
                <Box>
                  <Typography variant="body1" color="textSecondary">
                    Atualmente:{' '}
                      <Link href={formData.bill_file} target="_blank" rel="noopener noreferrer">
                        {formData.bill_file?.length > 30
                          ? `${formData.bill_file.slice(0, 30)}...`
                          : formData.bill_file}
                      </Link>
                  </Typography>
                  <Box mt={1}>
                    Modificar:
                    <Input
                      type="file"
                      onChange={(e) => handleChange('bill_file', e.target.files[0])}
                      {...(formErrors.bill_file && { error: true })}
                    />
                  </Box>
                  <Typography variant="caption" color="error">
                    {formErrors.bill_file && formErrors.bill_file}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={12} lg={12}>
                <CustomFormLabel>Geradora</CustomFormLabel>
                <FormControlLabel
                  control={
                    <CustomSwitch
                      checked={formData.main_unit}
                      onChange={(e) => handleChange('main_unit', e.target.checked)}
                    />
                  }
                  label={formData.main_unit ? 'Geradora' : 'Beneficiária'}
                />
              </Grid>
            </Grid>
          </>

          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            {onClosedModal && (
              <Button variant="contained" color="primary" onClick={onClosedModal}>
                Fechar
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={formLoading}
              endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {formLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default EditChecklistPage;
