import React, { useState, useContext } from 'react';
import {
  Box,
  Drawer,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip
} from '@mui/material';
import { FilterAlt } from '@mui/icons-material';
import CheckboxesTags from './CheckboxesTags';
import FormDateRange from './DateRangePicker';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteUser from '../../../comercial/sale/components/auto-complete/Auto-Input-User';
import { ProjectDataContext } from '@/app/context/ProjectContext';
import NumberInputBasic, { CustomNumberInput, NumberInput } from '../NumberInput';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AutoCompleteSupplyAds from '../../../checklist/components/auto-complete/Auto-Input-SupplyAds';

export default function DrawerFiltersProject() {
  const [open, setOpen] = useState(false);
  const { filters, setFilters } = useContext(ProjectDataContext);

  const [tempFilters, setTempFilters] = useState({
    status: filters.status,
    customer: filters.customer,
    designer_status: filters.designer_status,
    is_released_to_engineering: filters.is_released_to_engineering ?? null,
    homologator: filters.homologator,
    signature_date: filters.signature_date,
    product_kwp: filters.product_kwp || null,
    material_list_is_completed: filters.material_list_is_completed,
    trt_status: filters.trt_status,
    new_contract_number: filters.new_contract_number,
    supply_adquance: filters.supply_adquance,
    access_opnion: filters.access_opnion,
  });


  const createFilterParams = (filters) => {
    const params = {};

    if (filters.signature_date && filters.signature_date[0] && filters.signature_date[1]) {
      const startDate = filters.signature_date[0].toISOString().split('T')[0];
      const endDate = filters.signature_date[1].toISOString().split('T')[0];
      params.signature_date = `${startDate},${endDate}`;
    }

    if (filters.new_contract_number) {
      params.new_contract_number = filters.new_contract_number;
    }

    if (filters.access_opnion) {
      params.access_opnion = filters.access_opnion;
    }

    if (filters.supply_adquance && filters.supply_adquance.length > 0) {
      params.supply_adquance = filters.supply_adquance.join(',');
    }

    if (filters.trt_status && filters.trt_status.length > 0) {
      params.trt_status = filters.trt_status.map((status) => status.value).join(',');
    }

    if (filters.material_list_is_completed !== null) {
      params.material_list_is_completed = filters.material_list_is_completed;
    }

    if (filters.status && filters.status.length > 0) {
      params.status__in = filters.status.map((status) => status.value).join(',');
    }

    if (filters.designer_status && filters.designer_status.length > 0) {
      params.designer_status__in = filters.designer_status.map((status) => status.value).join(',');
    }

    if (filters.customer) {
      params.customer = filters.customer;
    }

    if (filters.is_released_to_engineering !== null) {
      params.is_released_to_engineering = filters.is_released_to_engineering;
    }

    if (filters.homologator) {
      params.homologator = filters.homologator;
    }

    if (filters.product_kwp) {
      params.product_kwp = filters.product_kwp
    }

    return params;
  };

  const handleChange = (key, value) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  const statusOptions = [
    {value: 'P', label: 'Pendente'},
    {value: 'A', label: 'Aprovado'},
    {value: 'EA', label: 'Em Andamento'},
    {value: 'R', label: 'Recusado'},
  ];


  const accessOpinionOptions = [
    {value: 'liberado', label: 'Liberado'},
    {value: 'bloqueado', label: 'Bloqueado'},
  ]

  const clearFilters = () => {
    setTempFilters({
      status: [],
      designer_status: [],
      is_released_to_engineering: null,
      customer: null,
      homologator: null,
      signature_date: [null, null],
      product_kwp: null,
      material_list_is_completed: null,
      trt_status: [],
      new_contract_number: null,
      supply_adquance: null,
      access_opnion: null,
    });
  };

  const applyFilters = () => {
    setFilters(createFilterParams(tempFilters));
    setOpen(false);
  };

  const toggleDrawer = (inOpen) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(inOpen);
  };

  const handleStatusChange = (event, value) => {
  
    if (value.some((trt_status) => trt_status.value === 'P')) {
      setTempFilters((prev) => ({ ...prev, trt_status: [{ value: 'P', label: 'Pendente' }] }));
    } else {
      setTempFilters((prev) => ({
        ...prev,
        trt_status: value.filter((trt_status) => trt_status.value !== 'P'),
      }));
    }
  };
  

  return (
    <Box sx={{ display: 'flex' }}>
      <Button variant="outlined" onClick={toggleDrawer(true)} startIcon={<FilterAlt />}>
        Filtros
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
        <Box
          role="presentation"
          sx={{
            padding: 2,
            maxWidth: '600px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: '16px', flexShrink: 0 }}>
            Filtros
          </Typography>

          <Box
            sx={{
              overflowY: 'auto',
              flexGrow: 1,
              marginBottom: 2,
              paddingRight: '8px',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomFormLabel htmlFor="customer">Cliente</CustomFormLabel>
                <AutoCompleteUser
                  placeholder="Selecione o cliente"
                  value={tempFilters.customer}
                  onChange={(id) => handleChange('customer', id)}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="homologator">Homologador</CustomFormLabel>
                <AutoCompleteUser
                  placeholder="Selecione o homologator"
                  value={tempFilters.homologator}
                  onChange={(id) => handleChange('homologator', id)}
                />
              </Grid>

              <Grid item xs={12}>
                <FormDateRange
                  label="Data de Contrato"
                  value={tempFilters.signature_date}
                  onChange={(newValue) => handleChange('signature_date', newValue)}
                  error={false}
                  helperText=""
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="kwp">Kwp</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  placeholder="Digite o Kwp"
                  value={tempFilters.product_kwp}
                  onChange={(event) => {
                    const onlyNumbers = event.target.value.replace(/\D/g, '');
                    handleChange('product_kwp', onlyNumbers);
                  }}
                  inputProps={{
                    type: 'number',
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CustomFormLabel
                    htmlFor="Lista de Material"
                    sx={{
                      margin: 0,
                      padding: 0,
                      lineHeight: 4,
                    }}
                  >
                    Lista de Material
                  </CustomFormLabel>
                  <Tooltip title="Status necessário para o cliente prosseguir na esteira">
                    <HelpOutlineIcon />
                  </Tooltip>
                </Box>
                <FormControl fullWidth>
                  <Select
                    value={
                      tempFilters.material_list_is_completed == null
                        ? ''
                        : tempFilters.material_list_is_completed.toString()
                    }
                    onChange={(event) =>
                      handleChange(
                        'material_list_is_completed',
                        event.target.value === '' ? null : event.target.value === 'true'
                      )
                    }
                  >
                    <MenuItem value="">
                      <em>Todos</em>
                    </MenuItem>
                    <MenuItem value="true">Sim</MenuItem>
                    <MenuItem value="false">Não</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CustomFormLabel
                    htmlFor="Nova UC"
                    sx={{
                      margin: 0,
                      padding: 0,
                      lineHeight: 4,
                    }}
                  >
                    Nova UC
                  </CustomFormLabel>
                </Box>
                <FormControl fullWidth>
                  <Select
                    value={
                      tempFilters.new_contract_number == null
                        ? ''
                        : tempFilters.new_contract_number.toString()
                    }
                    onChange={(event) =>
                      handleChange(
                        'new_contract_number',
                        event.target.value === '' ? null : event.target.value === 'true'
                      )
                    }
                  >
                    <MenuItem value="">
                      <em>Todos</em>
                    </MenuItem>
                    <MenuItem value="true">Sim</MenuItem>
                    <MenuItem value="false">Não</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="Status">Status de Homologação</CustomFormLabel>
                <CheckboxesTags
                  options={[
                    { value: 'P', label: 'Pendente' },
                    { value: 'CO', label: 'Concluído' },
                    { value: 'EA', label: 'Em Andamento' },
                    { value: 'C', label: 'Cancelado' },
                    { value: 'D', label: 'Distrato' },
                  ]}
                  placeholder="Selecione o status"
                  value={tempFilters.status}
                  onChange={(event, value) => handleChange('status', value)}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="Parecer de Acesso">Parecer de Acesso</CustomFormLabel>
                <FormControl fullWidth>
                  <Select
                    value={tempFilters.access_opnion || ''}
                    onChange={(event) => handleChange('access_opnion', event.target.value)}
                  >
                    <MenuItem value="">
                      <em>Todos</em>
                    </MenuItem>
                    {accessOpinionOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="Status">Status de TRT</CustomFormLabel>
                <CheckboxesTags
                  options={statusOptions}
                  placeholder={'Selecione o status'}
                  value={tempFilters.trt_status}
                  onChange={handleStatusChange}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="supply_adquance">Adequação de Fornecimento</CustomFormLabel>
                <AutoCompleteSupplyAds
                  placeholder="Selecione a adequação de fornecimento"
                  value={tempFilters.supply_adquance}
                  onChange={(id) => handleChange('supply_adquance', id)}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CustomFormLabel
                      htmlFor="Lista de Material"
                      sx={{
                        margin: 0,
                        padding: 0,
                        lineHeight: 4,
                      }}
                    >
                      Status do Projeto
                    </CustomFormLabel>
                    <Tooltip title="Status necessário para o cliente prosseguir na esteira">
                      <HelpOutlineIcon />
                    </Tooltip>
                </Box>
                <CheckboxesTags
                  options={[
                    { value: 'P', label: 'Pendente' },
                    { value: 'CO', label: 'Concluído' },
                    { value: 'EA', label: 'Em Andamento' },
                    { value: 'C', label: 'Cancelado' },
                    { value: 'D', label: 'Distrato' },
                  ]}
                  placeholder="Selecione o Status do Projeto"
                  value={tempFilters.designer_status}
                  onChange={(event, value) => handleChange('designer_status', value)}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomFormLabel htmlFor="isReleased">Liberado para Engenharia</CustomFormLabel>
                <FormControl fullWidth>
                  <Select
                    labelId="is-released-label"
                    value={
                      tempFilters.is_released_to_engineering === null
                        ? ''
                        : tempFilters.is_released_to_engineering.toString()
                    }
                    onChange={(event) =>
                      handleChange(
                        'is_released_to_engineering',
                        event.target.value === '' ? null : event.target.value === 'true',
                      )
                    }
                  >
                    <MenuItem value="">
                      <em>Todos</em>
                    </MenuItem>
                    <MenuItem value="true">Sim</MenuItem>
                    <MenuItem value="false">Não</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{
              flexShrink: 0,
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button variant="outlined" fullWidth onClick={clearFilters}>
                  Limpar Filtros
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained" fullWidth onClick={applyFilters}>
                  Aplicar Filtros
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
