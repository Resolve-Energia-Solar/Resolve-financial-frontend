'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import projectService from '@/services/projectService';
import { debounce } from 'lodash';
import saleService from '@/services/saleService';
import { formatDate } from '@/utils/dateUtils';
import { Box, Typography } from '@mui/material';

const statusMap = {
  P: 'Pendente',
  F: 'Finalizado',
  EA: 'Em Andamento',
  C: 'Cancelado',
  D: 'Distrato',
};

export default function AutoCompleteUserProject({
  onChange,
  value,
  error,
  helperText,
  selectedClient,
  noTextOptions = 'Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa.',
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchDefaultProject = async () => {
      if (value) {
        try {
          const projectValue = await projectService.find(value, {
            expand: 'sale',
          });
          if (projectValue) {
            setSelectedProject({
              id: projectValue.id,
              project_number: projectValue.project_number,
              sale: projectValue.sale,
              homologator: projectValue.homologator,
              start_date: projectValue.start_date,
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
          const responseSales = await saleService.index({
            customer: selectedClient,
            expand: 'projects',
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

          const formattedProjects = await Promise.all(
            allProjects.map((project) =>
              projectService.find(project.id, {
                expand: 'sale,homologator,address,product',
                fields:
                  'id,project_number,sale.total_value,sale.contract_number,sale.signature_date,sale.status,homologator.complete_name,address.complete_address,product.name',
              })
            )
          );

          setOptions(formattedProjects);
        }
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
      }
      setLoading(false);
    }, 300),
    []
  );

  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleOpen = () => {
    setOpen(true);
  };

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
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.project_number?.toString() || ''}
        loadingText="Carregando..."
        renderOption={(props, option) => (
          <li {...props}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2">
                <strong>Projeto:</strong> {option.project_number}
              </Typography>
              <Typography variant="body2">
                <strong>Valor total:</strong>{' '}
                {option.sale?.total_value
                  ? formatCurrency(option.sale.total_value)
                  : 'Sem valor Total'}
              </Typography>
              <Typography variant="body2">
                <strong>Contrato:</strong>{' '}
                {option.sale?.contract_number || 'Contrato não Disponível'}
              </Typography>
              <Typography variant="body2">
                <strong>Homologador:</strong>{' '}
                {option.homologator?.complete_name || 'Homologador não Disponível'}
              </Typography>
              <Typography variant="body2">
                <strong>Data de Contrato:</strong>{' '}
                {formatDate(option.sale?.signature_date) || 'Data de Contrato não Disponível'}
              </Typography>
              <Typography variant="body2">
                <strong>Endereço:</strong>{' '}
                {option?.address?.complete_address || 'Endereço não Disponível'}
              </Typography>
              <Typography variant="body2">
                <strong>Status da Venda:</strong>{' '}
                {option.sale?.status
                  ? statusMap[option.sale.status] || 'Status Desconhecido'
                  : 'Status não Disponível'}
              </Typography>
              <Typography variant="body2">
                <strong>Produto:</strong>{' '}
                {option?.product?.name || 'Produto não Disponível'}
              </Typography>
            </Box>
          </li>
        )}
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
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </Fragment>
  );
}
