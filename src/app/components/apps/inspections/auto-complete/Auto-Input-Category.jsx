'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import categoryService from '@/services/categoryService';
import { debounce } from 'lodash';

export default function AutoCompleteCategory({ onChange, value, error, helperText }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchDefaultCategory = async () => {
      if (value) {
        try {
          const categoryValue = await categoryService.getCategoryById(value);
          if (categoryValue) {
            setSelectedCategory({
              id: categoryValue.id,
              name: category.name
            });
          }
        } catch (error) {
          console.error('Erro ao buscar categoria:', error);
        }
      }
    };

    fetchDefaultCategory();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedCategory(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const fetchCategoriesByName = useCallback(
    debounce(async (name) => {
      if (!name) return;
      setLoading(true);
      try {
        const response = await categoryService.getCategoryByName(name);
        const formattedCategories = response.results.map(category => ({
          id: category.id,
          name: category.name
        }));
        setOptions(formattedCategories);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
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
        getOptionLabel={(option) => option.name || ''}
        options={options}
        loading={loading}
        value={selectedCategory}
        onInputChange={(event, newInputValue) => {
          fetchCategoriesByName(newInputValue);
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
