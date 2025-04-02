'use client';
import {
  Grid,
  Typography,
  Box,
  Stack,
  CircularProgress,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useEffect, useState } from 'react';
import leadService from '@/services/leadService';
import { useSnackbar } from 'notistack';
import LeadInfoHeader from '@/app/components/kanban/Leads/components/HeaderCard';
import ScheduleCard from '../components/CardSchedule';
import BasicDateCalendar from '@/app/components/kanban/Leads/components/BasicDateCalendar';
import ScheduleCardSkeleton from '../components/ScheduleCardSkeleton';
import { Add, Height } from '@mui/icons-material';
import LeadAddSchedulePage from './Add-Schedule';

function LeadSchedulePage({ leadId = null }) {
  const SERVICE_INSPECTION_ID = process.env.NEXT_PUBLIC_SERVICE_INSPECTION_ID;
  const { enqueueSnackbar } = useSnackbar();
  const [loadingInspections, setLoadingInspections] = useState(true);
  const [inspections, setInspections] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    const fetchLead = async () => {
      setLoadingInspections(true);
      try {
        const data = await leadService.find(leadId, {
          params: {
            fields: 'schedules',
            expand: 'schedules',
          },
        });
        console.log('API Response:', data);
        setInspections(Array.isArray(data?.schedules) ? data.schedules : []);
      } catch (err) {
        enqueueSnackbar('Não foi possível carregar o lead', { variant: 'error' });
      } finally {
        setLoadingInspections(false);
      }
    };
    if (leadId) {
      fetchLead();
    }
  }, [leadId, refresh]);

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sx={{ overflow: 'scroll' }}>
        <Box
          sx={{
            borderRadius: '20px',
            boxShadow: 13,
            p: 3,
            m: 0.1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <LeadInfoHeader />

          <Stack spacing={3} sx={{ mt: 3 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Vistorias Técnicas: <span style={{ fontWeight: 400 }}>{inspections.length}</span>
              </Typography>

              <Button
                startIcon={<Add />}
                onClick={() => setEditModalOpen(true)}
                sx={{
                  fontSize: '0.75rem',
                  p: '5px 10px',
                  borderRadius: '4px',
                  backgroundColor: '#FFCC00',
                  color: '#000',
                  '&:hover': {
                    backgroundColor: '#FFB800',
                    color: '#000',
                  },
                }}
              >
                Criar agendamento
              </Button>
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <Stack spacing={2} sx={{ flex: 1 }}>
                {loadingInspections ? (
                  <ScheduleCardSkeleton />
                ) : (
                  inspections.map((inspection) => (
                    <ScheduleCard
                      key={inspection.id}
                      status={inspection.status}
                      schedule_date={inspection.schedule_date}
                      schedule_start_time={inspection.schedule_start_time}
                      description={inspection.description}
                    />
                  ))
                )}
              </Stack>
              <Box sx={{ flexShrink: 0 }}>
                <BasicDateCalendar />
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Grid>

      <Dialog 
        open={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            padding: '24px',
            gap: '24px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#FFFFFF',
            height: "643px",
            width: "889px"
          },
        }}
      >
        <DialogContent sx={{ p: 10 }}>
          <LeadAddSchedulePage
            leadId={leadId}
            serviceId={SERVICE_INSPECTION_ID}
            onClose={() => setEditModalOpen(false)}
            onRefresh={handleRefresh}
          />
        </DialogContent>
      </Dialog>
    </Grid>
  );
}

export default LeadSchedulePage;
