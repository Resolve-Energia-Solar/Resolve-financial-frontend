'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import serviceCatalogService from '@/services/serviceCatalogService';
import { debounce } from 'lodash';

export default function AutoCompleteServiceCatalog({
  onChange,
  value,
  error,
  helperText,
  noOptionsText = 'Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa.',
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedServiceCatalog, setSelectedServiceCatalog] = useState(null);

  console.log('value', value);

  useEffect(() => {
    const fetchDefaultServiceCatalog = async () => {
      if (value) {
        try {
          const serviceCatalogValue = await serviceCatalogService.getServiceCatalogById(value);
          if (serviceCatalogValue) {
            setSelectedServiceCatalog({
              id: serviceCatalogValue.id,
              name: serviceCatalogValue.name,
            });
          }
        } catch (error) {
          console.error('Erro ao buscar catálogo de serviço:', error);
        }
      }
    };

    fetchDefaultServiceCatalog();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedServiceCatalog(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const fetchServiceCatalogsByName = useCallback(
    debounce(async (name) => {
      setLoading(true);
      try {
        const response = await serviceCatalogService.getServiceCatalogByName(name);
        const formattedServiceCatalogs = response.results.map((serviceCatalog) => ({
          id: serviceCatalog.id,
          name: serviceCatalog.name, // Mantendo o mesmo formato do selectedServiceCatalog
        }));
        setOptions(formattedServiceCatalogs);
      } catch (error) {
        console.error('Erro ao buscar catálogos de serviço:', error);
      }
      setLoading(false);
    }, 300),
    [],
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  return (
    <Fragment>
      <Autocomplete
        sx={{ width: '100%' }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) => option.id === value.id} // Comparação pelo id
        getOptionLabel={(option) => option.name || ''} // Usa "name"
        options={options}
        loading={loading}
        value={selectedServiceCatalog}
        loadingText="Carregando..."
        noOptionsText={noOptionsText}
        onInputChange={(event, newInputValue) => {
          fetchServiceCatalogsByName(newInputValue);
        }}
        onChange={handleChange}
        onFocus={() => fetchServiceCatalogsByName('')}
        renderInput={(params) => (
          <CustomTextField
            error={error}
            helperText={helperText}
            {...params}
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
    </Fragment>
  );
}
