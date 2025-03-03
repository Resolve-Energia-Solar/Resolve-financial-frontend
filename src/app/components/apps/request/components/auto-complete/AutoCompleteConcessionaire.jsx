'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CompanyService from '@/services/energyCompanyService';
import { debounce } from 'lodash';

export default function AutoCompleteCompanies({ onChange, value, error, helperText, ...rest }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const fetchDefaultCompany = async () => {
      if (value) {
        try {
          const company = await CompanyService.getCompanyById(value);
          if (company) {
            setSelectedCompany({
              id: company.id,
              name: company.name,
            });
          }
        } catch (error) {
          console.error('Erro ao buscar empresa:', error);
        }
      }
    };

    fetchDefaultCompany();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedCompany(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const fetchCompaniesByName = useCallback(
    debounce(async (name) => {
      if (!name) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const companies = await CompanyService.getCompanyByName(name);
        if (companies && companies.results) {
          const formattedCompanies = companies.results.map((company) => ({
            id: company.id,
            name: company.name,
          }));
          setOptions(formattedCompanies);
        }
      } catch (error) {
        console.error('Erro ao buscar empresas:', error);
      }
      setLoading(false);
    }, 300),
    []
  );

  const fetchInitialCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const companies = await CompanyService.getCompanies({ limit: 5, page: 1 });
      if (companies && companies.results) {
        const formattedCompanies = companies.results.map((company) => ({
          id: company.id,
          name: company.name,
        }));
        setOptions(formattedCompanies);
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    }
    setLoading(false);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    if (options.length === 0) {
      fetchInitialCompanies();
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
        value={selectedCompany}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."  
        {...rest}
        onInputChange={(event, newInputValue) => {
          fetchCompaniesByName(newInputValue);
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
