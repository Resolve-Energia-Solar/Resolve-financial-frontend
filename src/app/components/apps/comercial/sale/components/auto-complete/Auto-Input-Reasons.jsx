'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import serviceReason from '@/services/serviceReason';
import { debounce } from 'lodash';

export default function AutoCompleteReasonMultiple({
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
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [valuesDefault, setValuesDefault] = useState(value);

  useEffect(() => {
    setValuesDefault(value);
  }, [value]);

  useEffect(() => {
    const fetchDefaultReasons = async () => {
      if (valuesDefault.length > 0) {
        try {
          const reasons = await Promise.all(valuesDefault.map((id) => serviceReason.find(id)));
          const formattedReasons = reasons.map((reason) => ({
            id: reason.id,
            name: reason.name,
          }));
          setSelectedReasons(formattedReasons);
        } catch (error) {
          console.error('Erro ao buscar reasons:', error);
        }
      }
    };

    fetchDefaultReasons();
  }, [valuesDefault, refresh]);

  const refreshReasons = () => {
    setRefresh(!refresh);
  };

  const handleChange = (event, newValue) => {
    setSelectedReasons(newValue);
    onChange(newValue.map((reason) => reason.id));
  };

  const fetchReasonsByName = useCallback(
    debounce(async (name) => {
      if (!name) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const reasons = await serviceReason.index({ name__icontains: name, limit: 30, page: 1 });
        if (reasons && reasons.results) {
          const formattedReasons = reasons.results.map((reason) => ({
            id: reason.id,
            name: reason.name,
          }));
          setOptions(formattedReasons);
        }
      } catch (error) {
        console.error('Erro ao buscar razões:', error);
      }
      setLoading(false);
    }, 300),
    [],
  );

  const fetchInitialReasons = useCallback(async () => {
    setLoading(true);
    try {
      const reasons = await serviceReason.index({ limit: 30, page: 1 });
      if (reasons && reasons.results) {
        const formattedReasons = reasons.results.map((reason) => ({
          id: reason.id,
          name: reason.name,
        }));
        setOptions(formattedReasons);
      }
    } catch (error) {
      console.error('Erro ao buscar razões:', error);
    }
    setLoading(false);
  }, []);

  // Abre o Autocomplete e busca as razões iniciais, se necessário
  const handleOpen = () => {
    setOpen(true);
    if (options.length === 0) {
      fetchInitialReasons();
    }
  };

  // Fecha o Autocomplete e limpa as opções
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
        value={selectedReasons}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado. Tente digitar algo."
        onInputChange={(event, newInputValue) => {
          fetchReasonsByName(newInputValue);
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
        disabled={disabled}
      />
    </div>
  );
}
