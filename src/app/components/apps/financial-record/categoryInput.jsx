import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import omieService from '@/services/omieService';

export default function AutoCompleteCategory({ onChange, value, error, helperText, disabled, labeltitle }) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [allOptions, setAllOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState(null);

  const fetchDefaultCategory = async (categoryId) => {
    if (categoryId) {
      try {
        const categories = await omieService.getCategories();
        const category = categories.find(cat => cat.codigo === categoryId);
        if (category) {
          setSelectedCategory({ codigo: category.codigo, descricao: category.descricao });
          if (!value) onChange(category.codigo);
        }
      } catch (error) {
        console.error('Erro ao buscar categoria:', error);
      }
    }
  };

  React.useEffect(() => {
    fetchDefaultCategory(value);
  }, [value]);

  React.useEffect(() => {
    const fetchInitialCategories = async () => {
      setLoading(true);
      try {
        const categories = await omieService.getCategories();
        const formattedCategories = categories.map(cat => ({
          codigo: cat.codigo,
          descricao: cat.descricao
        }));
        setOptions(formattedCategories);
        setAllOptions(formattedCategories);
      } catch (error) {
        console.error('Erro ao buscar categorias iniciais:', error);
      }
      setLoading(false);
    };

    fetchInitialCategories();
  }, []);

  const handleChange = (event, newValue) => {
    setSelectedCategory(newValue);
    if (newValue) {
      onChange(newValue.codigo);
    } else {
      onChange(null);
    }
  };

  const handleInputChange = (event, newInputValue) => {
    if (!newInputValue) {
      setOptions(allOptions);
      return;
    }

    const filteredCategories = allOptions.filter(cat =>
      cat.descricao.toLowerCase().includes(newInputValue.toLowerCase())
    );
    setOptions(filteredCategories);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Autocomplete
        sx={{ width: '100%' }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) => option.descricao === value.descricao}
        getOptionLabel={(option) => option.descricao}
        options={options}
        loading={loading}
        disabled={disabled}
        value={selectedCategory}
        onInputChange={handleInputChange}
        onChange={handleChange}
        renderInput={(params) => (
          <CustomTextField
            {...params}
            label={labeltitle}
            error={error}
            helperText={helperText}
            size="small"
            variant="outlined"
          />
        )}
      />
    </div>
  );
}