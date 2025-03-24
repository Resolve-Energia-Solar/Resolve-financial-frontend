'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { 
    Box, FormControl, InputLabel, Select, MenuItem, Chip, CardContent, Typography, 
    Table, TableCell, TableContainer, TableHead, TableRow, TableBody, TablePagination, 
    Paper, CircularProgress 
  } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/components/container/PageContainer';
import BlankCard from '@/app/components/shared/BlankCard';
import ScheduleStatusChip from '@/app/components/apps/inspections/schedule/StatusChip';
import TableSkeleton from '@/app/components/apps/comercial/sale/components/TableSkeleton';

import scheduleService from '@/services/scheduleService';
import serviceCatalogService from '@/services/serviceCatalogService';
import { formatDate } from '@/utils/dateUtils';

const BCrumb = [
    { to: '/', title: 'Início' },
    { title: 'Lista de Agendamentos' },
];

const ScheduleTable = () => {
    const [loading, setLoading] = useState(true);
    const [scheduleList, setScheduleList] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRows, setTotalRows] = useState(0);
    const [error, setError] = useState(null);
    const [order, setOrder] = useState('created_at');
    const [orderDirection, setOrderDirection] = useState('asc');
    const userPermissions = useSelector((state) => state.user.permissions);

    const hasPermission = useCallback(
        (permissions) => !permissions || permissions.some(p => userPermissions?.includes(p)),
        [userPermissions]
    );

    // Busca catálogo de serviços
    useEffect(() => {
        serviceCatalogService.getServicesCatalog({ fields: 'id,name' })
          .then(data => {
            const list = data.results || [];
            setServices(list);
            if (list.length > 0) {
              // Seleciona todos por padrão
              setSelectedServices(list.map(s => s.id));
            }
          })
          .catch(err => console.error('Erro ao buscar serviços:', err));
    }, []);

    // Busca agendamentos filtrando pelo serviço selecionado e retornando somente os campos necessários
    useEffect(() => {
        if (selectedServices.length === 0) return;
        setLoading(true);
        scheduleService.getSchedules({
          page,
          limit: rowsPerPage,
          expand: 'customer,service_opinion',
          service__in: selectedServices.join(','),
          fields: 'id,created_at,customer.complete_name,status,service_opinion.name,final_service_opinion.name,schedule_date,schedule_start_time,schedule_agent.complete_name,address.street,address.number,address.neighborhood,address.city,address.state,observation',
          ordering: orderDirection === 'asc' ? order : `-${order}`
        })
          .then(data => {
            setScheduleList(data.results);
            setTotalRows(data.meta.pagination.total_count);
          })
          .catch(err => {
            console.error('Erro:', err);
            setError('Erro ao buscar agendamentos');
          })
          .finally(() => setLoading(false));
    }, [selectedServices, page, rowsPerPage, order, orderDirection]);

    const handleSort = useCallback(
        (field) => {
            if (order === field) {
                setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
            } else {
                setOrder(field);
                setOrderDirection('asc');
            }
        },
        [order, orderDirection]
    );

    const handlePageChange = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleRowsPerPageChange = useCallback((event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    }, []);

    return (
        <PageContainer title="Lista de Agendamentos" description="Listagem de Agendamentos">
            <Breadcrumb items={BCrumb} />
            <BlankCard>
                <CardContent>
                    <Typography variant="h5" gutterBottom>Lista de Agendamentos</Typography>
                    {/* Select para selecionar múltiplos serviços */}
                    <FormControl sx={{ minWidth: 300, marginBlock: 3 }}>
                        <InputLabel id="services-select-label">Serviços</InputLabel>
                        <Select
                            labelId="services-select-label"
                            id="services-select"
                            multiple
                            value={selectedServices}
                            onChange={(e) => {
                                setSelectedServices(e.target.value);
                                setPage(1);
                            }}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => {
                                        const service = services.find(s => s.id === value);
                                        return <Chip key={value} label={service ? service.name : value} />;
                                    })}
                                </Box>
                            )}
                            label="Serviços"
                        >
                            {services.map(service => (
                                <MenuItem key={service.id} value={service.id}>
                                    {service.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {loading ? (
                        <TableSkeleton rows={rowsPerPage} columns={11} />
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <TableContainer
                            component={Paper}
                            elevation={10}
                            sx={{ overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
                        >
                            <Table stickyHeader aria-label="schedule table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell onClick={() => handleSort('schedule_date,schedule_start_time')}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <span>Data e Hora</span>
                                                {order === 'schedule_date,schedule_start_time' && (
                                                    orderDirection === 'asc'
                                                        ? <ArrowDropUpIcon sx={{ ml: 0.5 }} />
                                                        : <ArrowDropDownIcon sx={{ ml: 0.5 }} />
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>Contratante</TableCell>
                                        <TableCell onClick={() => handleSort('status')}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <span>Status</span>
                                                {order === 'status' && (
                                                    orderDirection === 'asc'
                                                        ? <ArrowDropUpIcon sx={{ ml: 0.5 }} />
                                                        : <ArrowDropDownIcon sx={{ ml: 0.5 }} />
                                                )}
                                            </Box>
                                        </TableCell>
                                        {hasPermission(['field_services.view_service_opinion']) && (
                                            <TableCell onClick={() => handleSort('service_opinion')}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <span>Parecer</span>
                                                    {order === 'service_opinion' && (
                                                        orderDirection === 'asc'
                                                            ? <ArrowDropUpIcon sx={{ ml: 0.5 }} />
                                                            : <ArrowDropDownIcon sx={{ ml: 0.5 }} />
                                                    )}
                                                </Box>
                                            </TableCell>
                                        )}
                                        <TableCell onClick={() => handleSort('created_at')}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <span>Criado em</span>
                                                {order === 'created_at' && (
                                                    orderDirection === 'asc'
                                                        ? <ArrowDropUpIcon sx={{ ml: 0.5 }} />
                                                        : <ArrowDropDownIcon sx={{ ml: 0.5 }} />
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {scheduleList.map(schedule => (
                                        <TableRow key={schedule.id} hover>
                                            <TableCell>
                                                {`${formatDate(schedule.schedule_date)} - ${schedule.schedule_start_time}`}
                                            </TableCell>
                                            <TableCell>{schedule?.customer?.complete_name}</TableCell>
                                            <TableCell>
                                                <ScheduleStatusChip status={schedule.status} />
                                            </TableCell>
                                            {hasPermission(['field_services.view_service_opinion']) && (
                                                <TableCell>
                                                    {schedule.service_opinion
                                                        ? schedule.service_opinion.name
                                                        : <Chip label="Sem Parecer" color="error" />}
                                                </TableCell>
                                            )}
                                            <TableCell>{new Date(schedule.created_at).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    {loading && page > 1 && (
                                        <TableRow>
                                            <TableCell colSpan={10} align="center">
                                                <CircularProgress />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalRows}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        labelRowsPerPage="Linhas por página"
                    />
                </CardContent>
            </BlankCard>
        </PageContainer>
    );
};

export default ScheduleTable;
