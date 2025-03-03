'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import branchService from '@/services/branchService';
import { debounce } from 'lodash';

export default function AutoCompleteBranch({ onChange, value, error, helperText, labeltitle, disabled }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);

  useEffect(() => {
    const fetchDefaultBranch = async () => {
      if (value) {
        try {
          const branch = await branchService.getBranchById(value);
          if (branch) {
            setSelectedBranch({ id: branch.id, name: branch.name });
          }
        } catch (error) {
          console.error('Erro ao buscar branch:', error);
        }
      }
    };

    fetchDefaultBranch();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedBranch(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const fetchBranchesByName = useCallback(
    debounce(async (name) => {
      if (!name) return;
      setLoading(true);
      try {
        const branches = await branchService.getBranchByName(name);
        if (branches && branches.results) {
          const formattedBranches = branches.results.map((branch) => ({
            id: branch.id,
            name: branch.name,
          }));
          setOptions(formattedBranches);
        }
      } catch (error) {
        console.error('Erro ao buscar branches:', error);
      }
      setLoading(false);
    }, 300),
    [],
  );

  const fetchInitialBranches = useCallback(async () => {
    setLoading(true);
    try {
      const branches = await branchService.getBranches({ limit: 5 });
      const formattedBranches = branches.results.map((branch) => ({
        id: branch.id,
        name: branch.name,
      }));
      setOptions(formattedBranches);
    } catch (error) {
      console.error('Erro ao buscar branches:', error);
    }
  }, []);

  const handleOpen = () => {
    setOpen(true);
    if (options.length === 0) {
      fetchInitialBranches();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  return (
    <div>
      <Autocomplete
        fullWidth
        sx={{ width: '100%' }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={selectedBranch}
        disabled={disabled}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."  
        onInputChange={(event, newInputValue) => {
          fetchBranchesByName(newInputValue);
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
