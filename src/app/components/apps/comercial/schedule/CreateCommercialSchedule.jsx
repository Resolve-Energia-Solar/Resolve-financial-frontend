'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Grid,
  Button,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import GenericAsyncAutocompleteInput from '@/app/components/filters/GenericAsyncAutocompleteInput';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import useSheduleForm from '@/hooks/inspections/schedule/useScheduleForm';
import { useSelector } from 'react-redux';
import CreateAddressPage from '../../address/Add-address';
import AddUser from '../../users/Add-user/addUser';

const timeOptions = [
  { value: '08:30:00', label: '08:30' },
  { value: '10:00:00', label: '10:00' },
  { value: '13:00:00', label: '13:00' },
  { value: '14:30:00', label: '14:30' },
  { value: '16:00:00', label: '16:00' },
];

const saleStatusMap = {
  P: 'Pendente',
  F: 'Finalizado',
  EA: 'Em Andamento',
  C: 'Cancelado',
  D: 'Distrato',
};

export default function CreateCommercialSchedule({ onClose, onRefresh }) {
  const router = useRouter();
  const {
    formData,
    handleChange,
    handleSave,
    loading: formLoading,
    formErrors,
    success,
  } = useSheduleForm();
  const userPermissions = useSelector(state => state.user.permissions);

  const [hasSale, setHasSale] = useState(null);
  const [clientSelected, setClientSelected] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedManualAddress, setSelectedManualAddress] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  useEffect(() => {
    if (success) {
      if (onClose) {
        onClose();
        onRefresh && onRefresh();
      } else {
        router.push('/apps/inspections/schedule');
      }
    }
  }, [success]);

  const handleAlertClose = () => setAlertOpen(false);
  const validateChange = (field, newValue) => handleChange(field, newValue);

  const handleSaleToggle = event => {
    const val = event.target.value === 'true';
    setHasSale(val);
    handleChange('project', null);
    handleChange('products', null);
    handleChange('address', null);
    setSelectedAddress(null);
    setSelectedManualAddress(null);
  };

  const handleProjectChange = option => {
    console.log('option', option);
    handleChange('project', option.value || null);
    handleChange('products', option?.product?.value);
    handleChange('branch', option?.branch?.value);
    if (option && option.address) {
      handleChange('address', option?.address?.value);
      setSelectedAddress(option.address);
    } else if (option) {
      setAlertOpen(true);
      setAlertMessage('Este projeto não possui endereço associado.');
      setAlertType('warning');
      handleChange('address', null);
      setSelectedAddress(null);
    } else {
      setSelectedAddress(null);
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        {/* Cliente */}
        <Grid item xs={12}>
          <CustomFormLabel htmlFor="customer">Cliente</CustomFormLabel>
          <GenericAsyncAutocompleteInput
            label="Cliente"
            endpoint="/api/users"
            queryParam="complete_name__icontains"
            extraParams={{ fields: 'complete_name,id' }}
            value={formData.customer}
            onChange={opt => {
              setClientSelected(opt ? opt?.value : '');
              handleChange('customer', opt?.value || null);
            }}
            mapResponse={data =>
              data.results.map(u => ({ label: u.complete_name, value: u.id }))
            }
            error={!!formErrors.customer}
            helperText={formErrors.customer}
            renderCreateModal={({ onClose }) => (
              <AddUser
                hideSaveButton={false}
                onClose={onClose}
                onUserSaved={user => {
                  setClientSelected(user.id);
                  handleChange('customer', user.id);
                  onClose();
                }}
              />
            )}
          />
        </Grid>

        {/* Serviço */}
        <Grid item xs={12}>
          <CustomFormLabel htmlFor="service">Serviço</CustomFormLabel>
          <GenericAsyncAutocompleteInput
            label="Serviço"
            endpoint="/api/services"
            queryParam="name__icontains"
            extraParams={{ fields: 'name,id' }}
            value={formData.service}
            debounceTime={500}
            onChange={opt => validateChange('service', opt || null)}
            mapResponse={data =>
              data.results.map(s => ({ label: s.name, value: s.id }))
            }
            error={!!formErrors.service}
            helperText={formErrors.service}
          />
        </Grid>

        {/* Data e Hora */}
        <Grid item xs={12} sm={6}>
          <FormDate
            label="Data do agendamento"
            name="schedule_date"
            value={formData.schedule_date}
            onChange={val => validateChange('schedule_date', val)}
            error={!!formErrors.schedule_date}
            helperText={formErrors.schedule_date}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormSelect
            label="Hora do agendamento"
            options={timeOptions}
            value={formData.schedule_start_time || ''}
            onChange={e => validateChange('schedule_start_time', e.target.value)}
            disabled={!formData.schedule_date}
            error={!!formErrors.schedule_start_time}
            helperText={formErrors.schedule_start_time}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl
            component="fieldset"
            disabled={
              !(
                formData.customer &&
                formData.service &&
                formData.schedule_date &&
                formData.schedule_start_time
              )
            }
          >
            <FormLabel component="legend">
              O cliente já possui Venda?
            </FormLabel>
            <RadioGroup
              row
              value={hasSale === null ? '' : hasSale.toString()}
              onChange={handleSaleToggle}
            >
              <FormControlLabel value="true" control={<Radio />} label="Sim" />
              <FormControlLabel value="false" control={<Radio />} label="Não" />
            </RadioGroup>
          </FormControl>
        </Grid>

        {hasSale === true && (
          <>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="project">Projeto</CustomFormLabel>
              <GenericAsyncAutocompleteInput
                label="Projeto"
                endpoint="/api/projects"
                queryParam="q"
                extraParams={{
                  expand: ['sale.branch', 'address', 'product'],
                  fields: ['id', 'project_number', 'address', 'product', 'sale.branch.name', 'sale.branch.id'],
                  customer: clientSelected,
                }}
                value={formData.project}
                onChange={handleProjectChange}
                mapResponse={data =>
                  data.results.map(p => ({
                    label: p.project_number,
                    value: p.id,
                    address: {
                      label: p.address?.complete_address || '',
                      value: p.address?.id || null,
                    },
                    product: {
                      label: p.product?.name || '',
                      value: p.product?.id || null,
                    },
                    branch: {
                      label: p.sale?.branch?.name || '',
                      value: p.sale?.branch?.id || null,
                    },
                  }))
                }
                error={!!formErrors.project}
                helperText={formErrors.project}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomFormLabel htmlFor="address">Endereço</CustomFormLabel>
              <GenericAsyncAutocompleteInput
                label="Endereço"
                endpoint="/api/addresses"
                queryParam="street__icontains"
                extraParams={{
                  customer_id: clientSelected,
                  fields: 'street,number,city,state,id',
                }}
                disabled={!formData.project}
                value={selectedAddress || formData.address}
                onChange={opt => {
                  setSelectedAddress(opt);
                  handleChange('address', opt);
                }}
                mapResponse={data =>
                  data.results.map(a => ({
                    label: `${a.street}, ${a.number} - ${a.city}, ${a.state}`,
                    value: a.id,
                  }))
                }
                error={!!formErrors.address}
                helperText={formErrors.address}
                renderCreateModal={({ open, onClose, onCreate, newObjectData, setNewObjectData }) =>
                  <CreateAddressPage
                    open={open}
                    onClose={onClose}
                    userId={clientSelected}
                    onAdd={created => {
                      console.log('created', created);
                      setSelectedAddress(created);
                      handleChange('address', created);
                      onClose();
                    }}
                  />
                }
              />
            </Grid>
          </>
        )}

        {hasSale === false && (
          <>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="product">Produto</CustomFormLabel>
              <GenericAsyncAutocompleteInput
                label="Produto"
                endpoint="/api/products"
                queryParam="name__icontains"
                extraParams={{ fields: 'name,id', default__in: 'S' }}
                value={formData.products}
                onChange={opt => handleChange('products', opt || null)}
                mapResponse={data =>
                  data.results.map(item => ({
                    label: item.name,
                    value: item.id,
                  }))
                }
                error={!!formErrors.products}
                helperText={formErrors.products}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomFormLabel htmlFor="address">Endereço</CustomFormLabel>
              <GenericAsyncAutocompleteInput
                label="Endereço"
                endpoint="/api/addresses"
                queryParam="q"
                extraParams={{
                  customer_id: clientSelected,
                  fields: 'street,number,city,state,id',
                }}
                value={selectedManualAddress || formData.address}
                onChange={opt => {
                  setSelectedManualAddress(opt);
                  handleChange('address', opt);
                }}
                mapResponse={data =>
                  data.results.map(a => ({
                    label: `${a.street}, ${a.number} - ${a.city}, ${a.state}`,
                    value: a.id,
                  }))
                }
                error={!!formErrors.address}
                helperText={formErrors.address}
                renderCreateModal={({ open, onClose }) =>
                  <CreateAddressPage
                    open={open}
                    onClose={onClose}
                    userId={clientSelected}
                    onAdd={created => {
                      console.log('created', created);
                      setSelectedManualAddress(created.id);
                      handleChange('address', created.id);
                      onClose();
                    }}
                  />
                }
              />
            </Grid>
          </>
        )}

        {/* Observação */}
        <Grid item xs={12}>
          <CustomFormLabel htmlFor="observation">Observação</CustomFormLabel>
          <CustomTextField
            name="observation"
            placeholder="Observação do agendamento"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={formData.observation}
            onChange={e => handleChange('observation', e.target.value)}
            error={!!formErrors.observation}
            helperText={formErrors.observation}
          />
        </Grid>

        {/* Botão Salvar */}
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSave()}
              disabled={formLoading}
              endIcon={formLoading ? <CircularProgress size={20} /> : null}
            >
              Salvar
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={alertType} onClose={handleAlertClose}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
