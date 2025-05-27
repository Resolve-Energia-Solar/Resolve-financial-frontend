import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import userService from '@/services/userService';

// Limite de agentes a retornar
const DEFAULT_LIMIT = 25;

export default function AutoCompleteUserSchedule({
  onChange,
  value,
  error,
  helperText,
  disabled,
  query,
  label = 'Agentes Disponíveis',
}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);

  // 1) Carrega o agente atual em modo edição (apenas nome, sem count)
  React.useEffect(() => {
    let active = true;
    const fetchCurrent = async () => {
      if (!value) {
        setSelectedUser(null);
        return;
      }
      setLoading(true);
      try {
        const user = await userService.find(value, { fields: 'id,complete_name' });
        const current = {
          id: user.id,
          name: user.complete_name,
          // não exibe schedule_count para usuário avulso
        };
        if (active) {
          setSelectedUser(current);
          setOptions((prev) => prev.some((o) => o.id === current.id) ? prev : [current]);
        }
      } catch (err) {
        console.error('Erro ao carregar agente atual:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchCurrent();
    return () => { active = false; };
  }, [value]);

  // 2) Busca todos os agentes disponíveis ao abrir o dropdown
  const fetchAllAgents = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        date: query.scheduleDate,
        start_time: query.scheduleStartTime,
        end_time: query.scheduleEndTime,
        service: query.service,
        limit: DEFAULT_LIMIT,
      };
      const res = await userService.getAvailableAgents(params);
      const formatted = (res || []).map((u) => ({
        id: u.id,
        name: u.complete_name,
        schedule_count: u.schedule_count,
      }));
      setOptions((prev) => {
        // inclui o selecionado caso não esteja na lista
        if (selectedUser && !formatted.some((o) => o.id === selectedUser.id)) {
          return [selectedUser, ...formatted];
        }
        return formatted;
      });
    } catch (err) {
      console.error('Erro ao buscar agentes disponíveis:', err);
    } finally {
      setLoading(false);
    }
  }, [query, selectedUser]);

  const handleOpen = () => {
    setOpen(true);
    fetchAllAgents();
  };
  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  const handleChange = (e, newValue) => {
    setSelectedUser(newValue);
    onChange(newValue ? newValue.id : null);
  };

  return (
    <Autocomplete
      fullWidth
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      disabled={disabled}
      value={selectedUser}
      options={options}
      loading={loading}
      isOptionEqualToValue={(option, val) => option.id === val?.id}
      getOptionLabel={(option) =>
        option.schedule_count != null
          ? `${option.name} (Agendamentos: ${option.schedule_count})`
          : option.name
      }
      onChange={handleChange}
      noOptionsText="Nenhum agente disponível para os filtros selecionados."
      loadingText="Carregando..."
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <Box>
            <Typography variant="body1">{option.name}</Typography>
            {option.schedule_count != null && (
              <Typography variant="body2" color="textSecondary">
                {`Agendamentos: ${option.schedule_count}`}
              </Typography>
            )}
          </Box>
        </li>
      )}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          size="small"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress size={20} />} 
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
