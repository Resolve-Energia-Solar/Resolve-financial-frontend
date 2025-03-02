import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { IconCalendar } from '@tabler/icons-react';

export default function ScheduleCardSkeleton() {
    return (
        <Card sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            border: '1px solid rgb(229, 229, 229)',
            borderRadius: '20px',
            boxShadow: 'none'
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', p: 0, flex: 1 }}>
                <CardContent sx={{ flex: '1 0 auto', p: 0 }}>
                    <Skeleton variant="text" width="50%" height={20} sx={{ mb: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Skeleton variant="circular" width={22} height={22} />
                        <Skeleton variant="text" width="70%" height={16} sx={{ marginLeft: 1 }} />
                    </Box>
                    <Skeleton variant="text" width="80%" height={16} sx={{ mt: 1 }} />
                </CardContent>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Skeleton variant="rectangular" width={60} height={20} sx={{ borderRadius: 5 }} />
            </Box>
        </Card>
    );
}
