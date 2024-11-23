'use client';
import { 
  Fragment,
  useCallback,
  useEffect,
  useState
} from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import squadService from '@/services/squadService';
import { debounce } from 'lodash';

export default function AutoCompleteSquads({ onChange, value = [], error, helperText }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSquads, setSelectedSquads] = useState([]);

  useEffect(() => {
    const fetchDefaultSquads = async () => {
      if (value.length > 0) {
        try {
          const squads = await Promise.all(value.map(id => squadService.getSquadById(id)));
          const formattedSquads = squads.map(squad => ({
            id: squad.id,
            name: squad.name // Ajuste conforme o campo do nome do usuário
          }));
          setSelectedSquads(formattedSquads);
        } catch (error) {
          console.error('Erro ao buscar squads:', error);
        }
      }
    };

    fetchDefaultSquads();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedSquads(newValue);
    onChange(newValue.map(squad => squad.id));
  };

  const fetchSquadsByName = useCallback(
    debounce(async (name) => {
      if (!name) return;
      setLoading(true);
      try {
        const squads = await squadService.getSquadByName(name);
        const formattedSquads = squads.results.map(squad => ({
          id: squad.id,
          name: squad.name
        }));
        setOptions(formattedSquads);
      } catch (error) {
        console.error('Erro ao buscar squads:', error);
      }
      setLoading(false);
    }, 300), 
    []
  );

  const handleOpen = () => {
    setOpen(true);
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
        isOptionEqualToValue={(option, value) => option.id === value.id} // Compara pelos IDs
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={selectedSquads}
        onInputChange={(event, newInputValue) => {
          fetchSquadsByName(newInputValue);
        }}
        onChange={handleChange}
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
    </div>
  );
}
