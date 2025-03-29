'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import supplyService from '@/services/supplyAdequanceService';
import { debounce } from 'lodash';

export default function AutoCompleteSupplyAds({
  onChange,
  value = [],
  error,
  helperText,
  labeltitle,
  disabled,
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSupplies, setSelectedSupplies] = useState([]);

  useEffect(() => {
    const fetchDefaultSupplies = async () => {
      if (value && value.length > 0) {
        try {
          const supplies = await Promise.all(value.map((id) => supplyService.find(id)));
          const formattedSupplies = supplies.map((supply) => ({
            id: supply.id,
            name: supply.name,
          }));
          setSelectedSupplies(formattedSupplies);
        } catch (error) {
          console.error('Erro ao buscar adequações de fornecimento:', error);
        }
      }
    };

    fetchDefaultSupplies();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedSupplies(newValue);
    onChange(newValue.map((supply) => supply.id));
  };

  const fetchSuppliesByName = useCallback(
    debounce(async (name) => {
      if (!name) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const supplies = await supplyService.index({ name__icontains: name });
        console.log('supplies', supplies?.data?.results);
        if (supplies && supplies?.results) {
          const formattedSupplies = supplies?.results.map((supply) => ({
            id: supply.id,
            name: supply.name,
          }));
          setOptions(formattedSupplies);
        }
      } catch (error) {
        console.error('Erro ao buscar adequações de fornecimento:', error);
      }
      setLoading(false);
    }, 300),
    [],
  );

  const fetchInitialSupplies = useCallback(async () => {
    setLoading(true);
    try {
      const supplies = await supplyService.index({ limit: 5, page: 1 });
      const formattedSupplies = supplies.results.map((supply) => ({
        id: supply.id,
        name: supply.name,
      }));
      setOptions(formattedSupplies);
    } catch (error) {
      console.error('Erro ao buscar adequações de fornecimento:', error);
    }
    setLoading(false);
  }, []);

  const handleOpen = () => {
    console.log('handleOpen');
    setOpen(true);
    if (options.length === 0) {
      fetchInitialSupplies();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  return (
    <div>
      <Autocomplete
        multiple
        sx={{ width: '100%' }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={selectedSupplies}
        disabled={disabled}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."
        onInputChange={(event, newInputValue) => {
          fetchSuppliesByName(newInputValue);
        }}
        onChange={handleChange}
        renderInput={(params) => (
          <CustomTextField
            error={error}
            helperText={helperText}
            {...params}
            label={labeltitle}
            size="small"
            variant="outlined"
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
