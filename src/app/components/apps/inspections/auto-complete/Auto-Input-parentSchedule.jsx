'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import scheduleService from '@/services/scheduleService';
import { debounce } from 'lodash';
import { Box, Chip, Typography } from '@mui/material';

export default function AutoCompleteParentSchedule({
  onChange,
  value = [],
  error,
  helperText,
  noOptionsText,
  order = '',
  orderDirection = 'asc',
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSchedules, setSelectedSchedules] = useState([]);

  // Busca os agendamentos padrão com base nos IDs passados em value
  useEffect(() => {
    const fetchDefaultSchedules = async () => {
      if (value.length > 0) {
        try {
          const schedules = await Promise.all(
            value.map((id) =>
              scheduleService.getScheduleById(id, {
                expand: ['service.category'],
                fields: ['id', 'customer', 'service', 'status'],
              }),
            ),
          );
          const formattedSchedules = schedules.map((schedule) => ({
            id: schedule.id,
            name: schedule.customer.complete_name,
            serviceName: schedule.service.category.name,
            status: schedule.status,
          }));

          setSelectedSchedules(formattedSchedules, formattedSchedules);
        } catch (error) {
          console.error('Erro ao buscar agendamentos:', error);
        }
      }
    };

    fetchDefaultSchedules();
  }, [value]);

  // Atualiza a seleção e envia uma lista de IDs para o componente pai
  const handleChange = (event, newValue) => {
    setSelectedSchedules(newValue);
    onChange(newValue.map((schedule) => schedule.id));
  };

  // Busca agendamentos pelo nome com debounce (300ms)
  const fetchSchedulesByName = useCallback(
    debounce(async (name) => {
      if (!name) return;
      setLoading(true);
      try {
        const orderingParam = order ? `${orderDirection === 'asc' ? '' : '-'}${order}` : '';
        const response = await scheduleService.getSchedules({
          ordering: orderingParam,
          nextPage: 1,
          limit: 15,
          customer_icontains: name,
          expand: ['service.category'],
          fields: [
            'id',
            'customer',
            'status',
            'date',
            'service',
            'schedule_agent',
            'project',
            'address',
            'protocol',
          ],
        });
        console.log('akjshdfasefasdghf kk', response);

        const formattedSchedules = response.results.map((schedule) => ({
          id: schedule.id,
          name: schedule.customer.complete_name,
          status: schedule.status,
          serviceName: schedule.service.category.name,
          agentName: schedule.schedule_agent ? schedule.schedule_agent.name : 'Não atribuído',
          customerId: schedule.customer.id,
          projectId: schedule.project?.id,
          protocol: schedule.protocol,
          address: schedule.address,
        }));

        setOptions(formattedSchedules);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      }
      setLoading(false);
    }, 300),
    [order, orderDirection],
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
        multiple
        sx={{ width: '100%' }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        loadingText="Carregando..."
        getOptionLabel={(option) =>
          option.name &&
          option.serviceName &&
          option.status &&
          `${option.name} - ${option.serviceName} | Status: ${option.status}`
        }
        options={options}
        loading={loading}
        value={selectedSchedules}
        noOptionsText={noOptionsText || 'Nenhum agendamento encontrado'}
        onInputChange={(event, newInputValue) => {
          fetchSchedulesByName(newInputValue);
        }}
        onChange={handleChange}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;

          return (
            <Box
              key={key}
              sx={{
                borderBottom: '1px solid #cecece',
                cursor: 'pointer',
              }}
              {...optionProps}
            >
              <Box
                sx={{
                  display: 'flex',
                  p: 1.6,
                  gap: 3,
                  width: '100%',
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                  <Box> Protocolo: {option.protocol}</Box>
                  <Box>
                    Status: <Chip label={option.status} sx={{ backgroundColor: '#cecece' }} />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                  <Box>Cliente: {option.name}</Box>
                  <Box>Serviço: {option.serviceName}</Box>
                </Box>
              </Box>
            </Box>
          );
        }}
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
                  {loading && <CircularProgress color="inherit" size={20} />}
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
