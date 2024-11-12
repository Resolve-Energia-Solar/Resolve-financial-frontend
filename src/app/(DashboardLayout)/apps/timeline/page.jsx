'use client';
import React, { useState, useEffect } from 'react';
import { CardContent, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress, Tab } from '@mui/material';
import { CheckCircle as CheckCircleIcon, HourglassEmpty as HourglassEmptyIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from '@/app/components/container/PageContainer';
import timelineService from '@/services/timelineService';

const Timeline = () => {
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const data = await timelineService.getTimeline();
                setTimeline(data);
            } catch (err) {
                setError('Erro ao carregar Projetos');
            } finally {
                setLoading(false);
            }
        };

        fetchTimeline();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <PageContainer title="Timeline" description="Agendamento por agente">
            <BlankCard>
                <CardContent>
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
                                                backgroundColor: schedule.status === 'Livre' ? 'green' : 'red',
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
                </CardContent>
            </BlankCard>
        </PageContainer>
    );
};

export default Timeline;
