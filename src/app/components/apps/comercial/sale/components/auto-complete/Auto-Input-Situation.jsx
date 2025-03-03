'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import situationEnergyService from '@/services/situationEnergyService';
import { debounce } from 'lodash';

export default function AutoCompleteSituation({
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
  const [selectedSituations, setSelectedSituations] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [valuesDefault, setValuesDefault] = useState(value);

  useEffect(() => {
    setValuesDefault(value);
  }, [value]);

  useEffect(() => {
    const fetchDefaultSituations = async () => {
      console.log('value', value);
      if (valuesDefault.length > 0) {
        try {
          const situations = await Promise.all(
            valuesDefault.map((id) => situationEnergyService.findOne(id)),
          );
          const formattedSituations = situations.map((situation) => ({
            id: situation.id,
            name: situation.name,
          }));
          setSelectedSituations(formattedSituations);
        } catch (error) {
          console.error('Erro ao buscar situações:', error);
        }
      }
    };

    fetchDefaultSituations();
  }, [valuesDefault, refresh]);

  const refreshSituations = () => {
    setRefresh(!refresh);
  };

  const handleChange = (event, newValue) => {
    setSelectedSituations(newValue);
    onChange(newValue.map((situation) => situation.id));
  };

  const fetchSituationsByName = useCallback(
    debounce(async (name) => {
      if (!name) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const situations = await situationEnergyService.getSituations({ name__icontains: name });
        if (situations && situations.results) {
          const formattedSituations = situations.results.map((situation) => ({
            id: situation.id,
            name: situation.name,
          }));
          setOptions(formattedSituations);
        }
      } catch (error) {
        console.error('Erro ao buscar situações:', error);
      }
      setLoading(false);
    }, 300),
    [],
  );

  const fetchInitialSituations = useCallback(async () => {
    setLoading(true);
    try {
      const situations = await situationEnergyService.getSituations({ limit: 5 });
      const formattedSituations = situations.results.map((situation) => ({
        id: situation.id,
        name: situation.name,
      }));
      setOptions(formattedSituations);
    } catch (error) {
      console.error('Erro ao buscar situações:', error);
    }
    setLoading(false);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    if (options.length === 0) {
      fetchInitialSituations();
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
        value={selectedSituations}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."  
        onInputChange={(event, newInputValue) => {
          fetchSituationsByName(newInputValue);
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
