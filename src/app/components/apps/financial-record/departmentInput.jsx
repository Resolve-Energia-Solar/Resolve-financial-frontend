import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import omieService from '@/services/omieService';

export default function AutoCompleteDepartment({ onChange, value, error, helperText, disabled, labeltitle }) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [allOptions, setAllOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedDepartment, setSelectedDepartment] = React.useState(null);

  const fetchDefaultDepartment = async (departmentId) => {
    if (departmentId) {
      try {
        const departments = await omieService.getDepartments();
        const department = departments.find(dep => dep.codigo === departmentId);
        if (department) {
          setSelectedDepartment({ codigo: department.codigo, descricao: department.descricao });
          if (!value) onChange(department.codigo);
        }
      } catch (error) {
        console.error('Erro ao buscar departamento:', error);
      }
    }
  };

  React.useEffect(() => {
    fetchDefaultDepartment(value);
  }, [value]);

  React.useEffect(() => {
    const fetchInitialDepartments = async () => {
      setLoading(true);
      try {
        const departments = await omieService.getDepartments();
        const formattedDepartments = departments.map(dep => ({
          codigo: dep.codigo,
          descricao: dep.descricao
        }));
        setOptions(formattedDepartments);
        setAllOptions(formattedDepartments);
      } catch (error) {
        console.error('Erro ao buscar departamentos iniciais:', error);
      }
      setLoading(false);
    };

    fetchInitialDepartments();
  }, []);

  const handleChange = (event, newValue) => {
    setSelectedDepartment(newValue);
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

    const filteredDepartments = allOptions.filter(dep =>
      dep.descricao.toLowerCase().includes(newInputValue.toLowerCase())
    );
    setOptions(filteredDepartments);
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
        value={selectedDepartment}
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