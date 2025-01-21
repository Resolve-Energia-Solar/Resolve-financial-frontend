'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import scheduleService from '@/services/scheduleService';
import { debounce } from 'lodash';

export default function AutoCompleteParentSchedule({
  onChange,
  value,
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
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchDefaultSchedule = async () => {
      if (value && Array.isArray(value)) {
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

    fetchDefaultSchedule();
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedSchedules(newValue);
    const selectedIds = newValue.map(schedule => schedule.id);
    onChange(selectedIds);
  };

  const fetchSchedulesByName = useCallback(
    debounce(async (name) => {
      setLoading(true);
      try {
        const orderingParam = order ? `${orderDirection === 'asc' ? '' : '-'}${order}` : '';
        const response = await scheduleService.getSchedules({
          ordering: orderingParam,
          params: name ? `&name__icontains=${name}` : '',
          nextPage: page,
        });
        const formattedSchedules = response.results.map((schedule) => ({
          id: schedule.id,
          name: schedule.customer.complete_name,
          date: schedule.date,
          status: schedule.status,
          serviceName: schedule.service.category.name,
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
    [order, orderDirection, page],
  );

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
        multiple
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
        onFocus={() => fetchSchedulesByName('')}
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
