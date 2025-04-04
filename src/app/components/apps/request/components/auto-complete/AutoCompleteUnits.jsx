'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import unitService from '@/services/unitService';
import { debounce } from 'lodash';

export default function AutoCompleteUnits({ onChange, value, error, helperText, ...rest }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    const fetchDefaultUnit = async () => {
      if (value) {
        try {
          const unit = await unitService.find(value, {
            fields:
              'id,address,project.sale.customer.complete_name,project.homologator.complete_name',
            expand: 'address,project.sale.customer,project.homologator',
          });
          if (unit) {
            setSelectedUnit({
              id: unit.id,
              name: `${
                unit.project?.homologator?.complete_name ||
                unit.project?.sale?.customer?.complete_name
              } - ${unit.address.street}, ${unit.address.number} - ${unit.address.neighborhood}`,
            });
          }
        } catch (error) {
          console.error('Erro ao buscar unidade:', error);
        }
      }
    };

    fetchDefaultUnit();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedUnit(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const formatAddress = (unit) => {
    if (unit && unit.address) {
      return `${unit.address.street}, ${unit.address.number} - ${unit.address.neighborhood}`;
    }
    return '';
  };

  const fetchUnitsByName = useCallback(
    debounce(async (name) => {
      if (!name) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const units = await unitService.index({
          name__contains: name,
          fields:
            'id,address,project.sale.customer.complete_name,project.homologator.complete_name',
          expand: 'address,project.sale.customer,project.homologator',
          limit: 15,
          page: 1,
        });
        const formattedUnits = units.results.map((unit) => ({
          id: unit.id,
          name: `${
            unit.project?.homologator?.complete_name || unit.project?.sale?.customer?.complete_name
          } - ${formatAddress(unit)}`,
        }));
        setOptions(formattedUnits);
      } catch (error) {
        console.error('Erro ao buscar unidades:', error);
      }
      setLoading(false);
    }, 300),
    [],
  );

  const fetchInitialUnits = useCallback(async () => {
    setLoading(true);
    try {
      const units = await unitService.index({
        limit: 5,
        page: 1,
        fields: 'id,address,project.sale.customer.complete_name,project.homologator.complete_name',
        expand: 'address,project.sale.customer,project.homologator',
      });
      if (units && units.results) {
        const formattedUnits = units.results.map((unit) => ({
          id: unit.id,
          name: `${
            unit.project?.homologator?.complete_name || unit.project?.sale?.customer?.complete_name
          } - ${formatAddress(unit)}`,
        }));
        setOptions(formattedUnits);
      }
    } catch (error) {
      console.error('Erro ao buscar unidades:', error);
    }
    setLoading(false);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    if (options.length === 0) {
      fetchInitialUnits();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  return (
    <div>
      <Autocomplete
        sx={{ width: '100%' }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={selectedUnit}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."
        {...rest}
        onInputChange={(event, newInputValue) => {
          fetchUnitsByName(newInputValue);
        }}
        onChange={handleChange}
        renderInput={(params) => (
          <CustomTextField
            error={error}
            helperText={helperText}
            {...params}
            size="small"
            variant="outlined"
            {...rest}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            }}
          />
        )}
      />
    </div>
  );
}
