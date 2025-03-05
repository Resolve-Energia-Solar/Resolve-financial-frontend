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

  // Mantém localmente a prop "value" (array de IDs)
  const [valuesDefault, setValuesDefault] = useState(value);

  // Atualiza o state local sempre que "value" mudar externamente
  useEffect(() => {
    setValuesDefault(value);
  }, [value]);

  // Busca as razões padrão pelo ID para popular o "selectedReasons"
  useEffect(() => {
    const fetchDefaultReasons = async () => {
      console.log('value', value);
      if (valuesDefault.length > 0) {
        try {
          // Utiliza findOne para buscar um único registro
          const reasons = await Promise.all(
            valuesDefault.map((id) => serviceReason.findReason(id))
          );
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

  // Função para forçar atualização, se necessário
  const refreshReasons = () => {
    setRefresh(!refresh);
  };

  // Atualiza a seleção e retorna somente os IDs para o componente pai
  const handleChange = (event, newValue) => {
    setSelectedReasons(newValue);
    onChange(newValue.map((reason) => reason.id));
  };

  // Busca razões pelo nome com debounce
  const fetchReasonsByName = useCallback(
    debounce(async (name) => {
      if (!name) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const reasons = await serviceReason.getReason({ name__icontains: name });
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
    []
  );

  // Busca inicial ao abrir o dropdown (limitado a 5 itens)
  const fetchInitialReasons = useCallback(async () => {
    setLoading(true);
    try {
      const reasons = await serviceReason.getReason({ limit: 5 });
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
