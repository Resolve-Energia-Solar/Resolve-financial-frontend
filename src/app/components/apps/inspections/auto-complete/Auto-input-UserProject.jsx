'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import projectService from '@/services/projectService';
import { debounce } from 'lodash';
import saleService from '@/services/saleService';

export default function AutoCompleteUserProject({
  onChange,
  value,
  error,
  helperText,
  selectedClient,
  noTextOptions,
}) {
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
            setSelectedProject({
              id: projectValue.id,
              project_number: projectValue.project_number,
              sale: projectValue.sale,
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
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const fetchProjectsByCodeNumber = useCallback(
    debounce(async (codeNumber) => {
      setLoading(true);
      try {
        if (selectedClient) {
          const responseSales = await saleService.getSales({
            params: `customer=${selectedClient}`,
          });

          const projectsSet = new Set();
          const allProjects = [];

          responseSales.results.forEach((sale) => {
            sale.projects.forEach((project) => {
              if (!projectsSet.has(project.id)) {
                projectsSet.add(project.id);
                allProjects.push(project);
              }
            });
          });

          console.log('allProjects', allProjects);

          const formattedProjects = await Promise.all(
            allProjects.map((project) => projectService.getProjectById(project.id)),
          );

          setOptions(formattedProjects);
        }
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
      }
      setLoading(false);
    }, 300),
    [],
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  console.log('selectedClient', selectedClient);

  return (
    <Fragment>
      <Autocomplete
        sx={{ width: '100%' }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) =>
          `${option.project_number} | Valor total: ${
            option.sale?.total_value || 'Sem valor Total'
          } | Contrato: ${option.sale?.contract_number || 'Contrato não Disponível'}` || ''
        }
        options={options}
        noOptionsText={noTextOptions}
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
