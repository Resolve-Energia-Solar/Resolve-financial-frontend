'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import projectService from '@/services/projectService';
import userService from '@/services/userService';
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
          const projectValue = await projectService.getProjectById(value);
          if (projectValue) {
            let customerName = '';
            try {
              const user = await userService.getUserById(projectValue.sale.customer);
              customerName = user.complete_name;
            } catch (err) {
              console.error('Erro ao buscar usuário:', err);
            }
            setSelectedProject({
              id: projectValue.id,
              project_number: projectValue.project_number,
              customerName,
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
        const response = await projectService.getProjects();
        const filteredProjects = response.results.results.filter((project) =>
          project.project_number.toLowerCase().includes(codeNumber.toLowerCase())
        );

        const formattedProjects = await Promise.all(
          filteredProjects.map(async (project) => {
            let customerName = '';
            try {
              const user = await userService.getUserById(project.sale.customer);
              customerName = user.complete_name;
            } catch (error) {
              console.error('Erro ao buscar usuário:', error);
            }
            return {
              id: project.id,
              project_number: project.project_number,
              customerName,
            };
          })
        );
        setOptions(formattedProjects);
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
      }
      setLoading(false);
    }, 300),
    []
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
        isOptionEqualToValue={(option, value) => option.project_number === value.project_number}
        getOptionLabel={(option) =>
          `${option.project_number} - ${option.customerName || ''}`
        }
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
