'use client';

import {
  Grid,
  Typography,
  Divider,
  Box,
  Rating,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  useTheme,
} from '@mui/material';

import {
  AccountCircle,
  CalendarToday,
  CalendarViewWeek,
  Email,
  Phone,
  WbSunny,
} from '@mui/icons-material';

import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

import leadService from '@/services/leadService';

function LeadInfoHeader({ leadId }) {
  const [lead, setLead] = useState(null);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  useEffect(() => {
    const fetchLead = async () => {
      if (!leadId) return;
      setLoadingLeads(true);
      try {
        const data = await leadService.getLeadById(leadId);
        setLead(data);
      } catch (err) {
        enqueueSnackbar('Não foi possível carregar o lead', { variant: 'error' });
      } finally {
        setLoadingLeads(false);
      }
    };

    fetchLead();
  }, [leadId]);

  if (!lead) return <Typography>Carregando...</Typography>;

  return (
    <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
      <Grid container spacing={2} alignItems="center" sx={{ p: 3 }} xs={12}>
        <Grid item xs={12} md={5} container alignItems="center" spacing={2}>
          <Grid item>
            <AccountCircle sx={{ fontSize: 62 }} />
          </Grid>
          <Grid item>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ fontSize: 12, color: '#ADADAD', margin: 0 }}
            >
              Cliente
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ fontSize: 16 }}>
              {lead?.name}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} md={7}>
          <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
            <Grid
              item
              xs={12}
              md={4}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
            >
              <Typography variant="body1" gutterBottom sx={{ fontSize: 12, color: '#ADADAD' }}>
                Nível de interesse
              </Typography>
              <Rating
                name="qualification"
                value={lead?.qualification}
                max={5}
                readOnly
                size="normal"
                icon={<WbSunny fontSize="inherit" sx={{ color: theme.palette.warning.main }} />}
                emptyIcon={
                  <WbSunny fontSize="inherit" sx={{ color: theme.palette.action.disabled }} />
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LeadInfoHeader;
