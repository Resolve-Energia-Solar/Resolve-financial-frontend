'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import projectService from '@/services/projectService';
import { debounce } from 'lodash';

export default function AutoCompleteProject({ onChange, value, error, helperText }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchDefaultProject = async () => {
      if (value) {
        try {
          const projectValue = await projectService.getProjectById(value, {
            expand: 'sale.customer',
            fields: 'project_number,sale.customer.complete_name',
          });
          if (projectValue) {
            setSelectedProject({
              id: projectValue.id,
              project_number: projectValue.project_number,
              customerName: projectValue.sale.customer.complete_name,
            });
          }
        } catch (error) {
          console.error('Erro ao buscar projeto:', error);
        }
      }
    };
    fetchDefaultProject();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedProject(newValue);
    onChange(newValue ? newValue.id : null);
  };

  const fetchProjectsByCodeNumber = useCallback(
    debounce(async (codeNumber) => {
      setLoading(true);
      try {
        // Chama o endpoint já retornando os dados expandidos do cliente
        const response = await projectService.getProjects({
          expand: 'sale.customer',
          fields: 'project_number,sale.customer.complete_name',
        });
        const filteredProjects = response.results.filter((project) =>
          project.project_number.toLowerCase().includes(codeNumber.toLowerCase()),
        );
        const formattedProjects = filteredProjects.map((project) => ({
          id: project.id,
          project_number: project.project_number,
          customerName: project.sale.customer.complete_name,
        }));
        setOptions(formattedProjects);
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
      }
      setLoading(false);
    }, 300),
    [],
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  return (
    <Fragment>
      <Autocomplete
        sx={{ width: '100%' }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."
        isOptionEqualToValue={(option, value) => option.project_number === value.project_number}
        getOptionLabel={(option) => `${option.project_number} - ${option.customerName || ''}`}
        options={options}
        loading={loading}
        value={selectedProject}
        onInputChange={(event, newInputValue) => {
          fetchProjectsByCodeNumber(newInputValue);
        }}
        onChange={handleChange}
        onFocus={() => fetchProjectsByCodeNumber('')}
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
    </Fragment>
  );
}
