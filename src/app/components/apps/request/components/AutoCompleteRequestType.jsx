'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import RequestTypeService from '@/services/requestTypeService';
import { debounce } from 'lodash';

export default function AutoCompleteRequestType({ onChange, value, error, helperText, ...rest }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState(null);

  useEffect(() => {
    const fetchDefaultRequestType = async () => {
      if (value) {
        try {
          const requestType = await RequestTypeService.getTypeById(value);
          if (requestType) {
            setSelectedRequestType({
              id: requestType.id,
              name: requestType.name,
            });
          }
        } catch (error) {
          console.error('Erro ao buscar tipo de solicitação:', error);
        }
      }
    };

    fetchDefaultRequestType();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedRequestType(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const fetchRequestTypesByName = useCallback(
    debounce(async (name) => {
      if (!name) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const requestTypes = await RequestTypeService.getTypeByName(name);
        if (requestTypes && requestTypes.results) {
          const formattedRequestTypes = requestTypes.results.map((requestType) => ({
            id: requestType.id,
            name: requestType.name,
          }));
          setOptions(formattedRequestTypes);
        }
      } catch (error) {
        console.error('Erro ao buscar tipos de solicitação:', error);
      }
      setLoading(false);
    }, 300),
    []
  );

  const fetchInitialRequestTypes = useCallback(async () => {
    setLoading(true);
    try {
      const requestTypes = await RequestTypeService.getTypes({ limit: 5, page: 1 });
      if (requestTypes && requestTypes.results) {
        const formattedRequestTypes = requestTypes.results.map((requestType) => ({
          id: requestType.id,
          name: requestType.name,
        }));
        setOptions(formattedRequestTypes);
      }
    } catch (error) {
      console.error('Erro ao buscar tipos de solicitação:', error);
    }
    setLoading(false);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    if (options.length === 0) {
      fetchInitialRequestTypes();
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
        value={selectedRequestType}
        {...rest}
        onInputChange={(event, newInputValue) => {
          fetchRequestTypesByName(newInputValue);
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
