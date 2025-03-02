'use client';
import {
  Grid,
  Typography,
  Box,
  Stack,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import leadService from '@/services/leadService';
import { useSnackbar } from 'notistack';
import LeadInfoHeader from '@/app/components/kanban/Leads/components/HeaderCard';
import ScheduleCard from '../components/CardSchedule';
import BasicDateCalendar from '../components/BasicDateCalendar';
import ScheduleCardSkeleton from '../components/ScheduleCardSkeleton';

function LeadSchedulePage({ leadId = null }) {
  const { enqueueSnackbar } = useSnackbar();
  const [loadingInspections, setLoadingInspections] = useState(true);
  const [inspections, setInspections] = useState([]);

  useEffect(() => {
    const fetchLead = async () => {
      setLoadingInspections(true);
      try {
        const data = await leadService.getLeadById(leadId, {
          params: {
            fields: 'inspections'
          }
        });
        console.log("API Response:", data);
        setInspections(Array.isArray(data?.inspections) ? data.inspections : []);
      } catch (err) {
        enqueueSnackbar('Não foi possível carregar o lead', { variant: 'error' });
      } finally {
        setLoadingInspections(false);
      }
    };
    if (leadId) {
      fetchLead();
    }
  }, [leadId]);

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
          <LeadInfoHeader leadId={leadId} />

          <Stack spacing={3} sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Vistorias Técnicas: <span style={{ fontWeight: 400 }}>{inspections.length}</span>
            </Typography>
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
    </Grid>
  );
}

export default LeadSchedulePage;