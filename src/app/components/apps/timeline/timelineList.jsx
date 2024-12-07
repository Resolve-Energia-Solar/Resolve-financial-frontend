import React, { useContext, useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress } from '@mui/material';
import timelineService from '@/services/timelineService';
import DrawerFilters from './DrawerFilters';
import { TimelineContext } from '@/app/context/timelineContext';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';

const TimelineList = () => {
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { filters } = useContext(TimelineContext);

    useEffect(() => {
        const fetchTimeline = async () => {
            setLoading(true);
            try {
                const date = filters.date 
                    ? filters.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
                const agent = filters.agent ? filters.agent : '';
                const data = await timelineService.getTimeline(date, agent);
                setTimeline(data);
            } catch (err) {
                setError('Erro ao carregar Projetos');
            } finally {
                setLoading(false);
            }
        };

        fetchTimeline();
    }, [filters]); // Atualiza os dados ao alterar os filtros

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div>
                <DrawerFilters />
                <TableContainer component={Paper} className="table-responsive">
                    <Table aria-label="lab-occupation-table" className="table table-bordered table-hover">
                        <TableHead>
                            <TableRow>
                                <TableCell>Agente</TableCell>
                                {timeline[0]?.schedules.map((schedule, index) => (
                                    <TableCell key={index}>
                                        {`${schedule.start_time} - ${schedule.end_time}`}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {timeline.map((agentData, indexAgent) => (
                                <TableRow key={indexAgent} hover>
                                    <TableCell>{agentData.agent.complete_name}</TableCell>
                                    {agentData.schedules.map((schedule, indexSchedule) => (
                                        <TableCell
                                            key={indexSchedule}
                                            style={{
                                                backgroundColor: schedule.status === 'Livre' ? 'green' : schedule.status === 'Ocupado' ? 'red' : 'Gray',
                                                color: 'white',
                                            }}
                                        >
                                            {schedule.status}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </LocalizationProvider>
    );
};

export default TimelineList;
