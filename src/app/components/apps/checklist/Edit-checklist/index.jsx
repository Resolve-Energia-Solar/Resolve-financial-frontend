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
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import { useEffect, useState } from 'react';
import supplyService from '@/services/supplyAdequanceService';
import HasPermission from '@/app/components/permissions/HasPermissions';

const EditChecklistPage = ({ unitId = null, onClosedModal = null, onRefresh = null }) => {
  const id = unitId;
  const userPermissions = useSelector((state) => state.user.permissions);

  const [fileLoading, setFileLoading] = useState(false);

  const hasPermission = (permissions) => {
    if (!permissions) return true;
    return permissions.some((permission) => userPermissions.includes(permission));
  };

  const statusOptions = [
    { value: 'M', label: 'Monofásico' },
    { value: 'B', label: 'Bifásico' },
    { value: 'T', label: 'Trifásico' },
  ];

  const { loading, error, unitData } = useUnit(id);
  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    loading: formLoading,
    success,
  } = useUnitForm(unitData, id);

  useEffect(() => {
    if (success) {
      onRefresh();
      onClosedModal();
    }
  }, [success]);

  useEffect(() => {
    if (formData.bill_file) {
      setFileLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('bill_file', formData.bill_file);

      supplyService
        .getFieldsDocuments(formDataToSend)
        .then((response) => {
          handleChange('name', response.name);
          handleChange('account_number', response.account);
          handleChange('unit_number', response.uc);

          const typeInitial = response.type.toLowerCase().charAt(0);
          const statusMap = {
            m: 'M',
            b: 'B',
            t: 'T',
          };

          handleChange('type', statusMap[typeInitial] || 'Unknown');
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        })
        .finally(() => {
          setFileLoading(false);
        });
    }
  }, [formData.bill_file]);

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
              <Grid item xs={12} sm={12} lg={6}>
                <CustomFormLabel>Nova U.C</CustomFormLabel>
                <FormControlLabel
                  control={
                    <CustomSwitch
                      checked={formData.new_contract_number}
                      onChange={(e) => handleChange('new_contract_number', e.target.checked)}
                    />
                  }
                  label={formData.new_contract_number ? 'Sim' : 'Não'}
                />
              </Grid>

              <Grid item xs={12} sm={12} lg={6}>
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

              {!formData.new_contract_number && (
                <>

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
                    <CustomFormLabel htmlFor="unit_percentage">
                      Porcentagem de Rateio
                    </CustomFormLabel>
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
                    <FormSelect
                      label="Tipo de Fornecimento"
                      options={statusOptions}
                      onChange={(e) => handleChange('type', e.target.value)}
                      value={formData.type}
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
                </>
              )}

              <Grid item xs={12} sm={12} lg={6}>
                <CustomFormLabel htmlFor="name">Endereço</CustomFormLabel>
                <AutoCompleteAddress
                  onChange={(id) => handleChange('address', id)}
                  value={formData.address}
                  {...(formErrors.address && { error: true, helperText: formErrors.address })}
                />
              </Grid>

              {!formData.new_contract_number && (
                <>
                  <HasPermission
                    permissions={['engineering.change_status_supply_adequances_field']}
                    userPermissions={userPermissions}
                  >
                    <Grid item xs={12} sm={12} lg={6}>
                      <CustomFormLabel htmlFor="supply_adquance">
                        Adequação de Fornecimento
                      </CustomFormLabel>
                      <AutoCompleteSupplyAds
                        onChange={(ids) => handleChange('supply_adquance', ids)}
                        value={formData.supply_adquance}
                        {...(formErrors.supply_adquance && {
                          error: true,
                          helperText: formErrors.supply_adquance,
                        })}
                      />
                    </Grid>
                  </HasPermission>
                  <Grid item xs={12}>
                    <CustomFormLabel htmlFor="bill_file">Arquivo</CustomFormLabel>
                    <Box>
                      <Typography variant="body1" color="textSecondary">
                        Atualmente:{' '}
                        {formData.bill_file && formData.bill_file.length > 0 ? (
                          <Link
                            href={formData?.bill_file}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {formData.bill_file && formData.bill_file.length > 30
                              ? `${formData?.bill_file.slice(0, 30)}...`
                              : formData?.bill_file}
                          </Link>
                        ) : (
                          'Nenhum arquivo selecionado'
                        )}
                      </Typography>

                      {/* Loading do arquivo */}
                      {fileLoading && (
                        <Box display="flex" alignItems="center" mt={1}>
                          <CircularProgress size={20} color="inherit" />
                          <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                            Carregando documento...
                          </Typography>
                        </Box>
                      )}

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
                </>
              )}
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
