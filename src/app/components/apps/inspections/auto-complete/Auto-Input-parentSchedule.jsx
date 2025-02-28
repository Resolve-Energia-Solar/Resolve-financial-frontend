'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import scheduleService from '@/services/scheduleService';
import { debounce } from 'lodash';

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
            value.map(id => scheduleService.getScheduleById(id))
          );
          const formattedSchedules = schedules.map(schedule => ({
            id: schedule.id,
            name: schedule.customer.complete_name,
            serviceName: schedule.service.category.name,
            status: schedule.status,
          }));
          setSelectedSchedules(formattedSchedules);
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
    onChange(newValue.map(schedule => schedule.id));
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
        });
        const formattedSchedules = response.results.map(schedule => ({
          id: schedule.id,
          name: schedule.customer.complete_name,
          status: schedule.status,
          serviceName: schedule.service.category.name,
          date: schedule.date,
          agentName: schedule.schedule_agent ? schedule.schedule_agent.name : 'Não atribuído',
          customerId: schedule.customer.id,
          projectId: schedule.project.id,
          address: schedule.address,
        }));
        setOptions(formattedSchedules);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      }
      setLoading(false);
    }, 300),
    [order, orderDirection]
  );

  // Busca inicial ao abrir o dropdown (caso nenhuma opção esteja carregada)
  const fetchInitialSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const orderingParam = order ? `${orderDirection === 'asc' ? '' : '-'}${order}` : '';
      const response = await scheduleService.getSchedules({
        ordering: orderingParam,
        nextPage: 1,
        limit: 15,
      });
      const formattedSchedules = response.results.map(schedule => ({
        id: schedule.id,
        name: schedule.customer.complete_name,
        status: schedule.status,
        serviceName: schedule.service.category.name,
        date: schedule.date,
        agentName: schedule.schedule_agent ? schedule.schedule_agent.name : 'Não atribuído',
        customerId: schedule.customer.id,
        projectId: schedule.project.id,
        address: schedule.address,
      }));
      setOptions(formattedSchedules);
    } catch (error) {
      console.error('Erro ao buscar agendamentos iniciais:', error);
    }
    setLoading(false);
  }, [order, orderDirection]);

  const handleOpen = () => {
    setOpen(true);
    if (options.length === 0) {
      fetchInitialSchedules();
    }
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
        getOptionLabel={(option) =>
          option.name && option.serviceName && option.status
            ? `${option.name} - ${option.serviceName} | Status: ${option.status}`
            : ''
        }
        options={options}
        loading={loading}
        value={selectedSchedules}
        noOptionsText={noOptionsText}
        onInputChange={(event, newInputValue) => {
          fetchSchedulesByName(newInputValue);
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
