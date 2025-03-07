import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { IconEye, IconPencil, IconCalendar } from '@tabler/icons-react';

export default function ScheduleCard({
    status,
    statusColor,
    description,
    schedule_date,
    schedule_start_time,
    reference,
    onEdit,
    onDelete
}) {
    const theme = useTheme();

    return (
        <Card sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            border: '1px solid #ADADAD',
            borderRadius: '20px',
            boxShadow: 'none'
        }}>


            <Box sx={{ display: 'flex', flexDirection: 'column', p:0,flex: 1 }}>
                <CardContent sx={{ flex: '1 0 auto', p: 0 }}>
                    <Typography component="div" variant="h5" color="#ADADAD" fontSize="14px" fontWeight={400} mb={1}>
                        Agendamento
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconCalendar size={22} color="#000" />
                        <Typography variant="body1" sx={{ color: '#000000', fontSize: '16px', fontWeight: 'bold' }}>
                            Vistoria técnica
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#000', fontSize: '16px', fontWeight: 500 }}>
                            {schedule_date && schedule_start_time
                                ? `• ${new Date(schedule_date).toLocaleDateString('pt-BR')} • ${schedule_start_time}`
                                : 'Não há agendamento'}
                        </Typography>
                    </Box>
                </CardContent>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Chip label={status} sx={{ backgroundColor: statusColor, color: '#303030', fontSize: '10px' }} />
            </Box>
        </Card>
    );
}
