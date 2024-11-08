'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import leadService from '@/services/leadService';
import { debounce } from 'lodash';

export default function AutoCompleteLead({ onChange, value, error, helperText, ...props }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    const fetchDefaultLead = async () => {
      if (value) {
        try {
          const lead = await leadService.getLeadById(value);
          if (lead) {
            setSelectedLead({ id: lead.id, name: lead.name });
          }
        } catch (error) {
          console.error('Erro ao buscar lead:', error);
        }
      }
    };

    fetchDefaultLead();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedLead(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const fetchLeadsByName = useCallback(
    debounce(async (name) => {
      if (!name) return;
      setLoading(true);
      try {
        const leads = await leadService.getLeadByName(name);
        const formattedLeads = leads.results.map(lead => ({
          id: lead.id,
          name: lead.name,
        }));
        setOptions(formattedLeads);
      } catch (error) {
        console.error('Erro ao buscar leads:', error);
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
        sx={{ width: '100%' }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={selectedLead}
        {...props}
        onInputChange={(event, newInputValue) => {
          fetchLeadsByName(newInputValue);
        }}
        onChange={handleChange}
        renderInput={(params) => (
          <CustomTextField
            {...params}
            error={error}
            helperText={helperText}
            size="small"
            variant="outlined"
            {...props}
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
