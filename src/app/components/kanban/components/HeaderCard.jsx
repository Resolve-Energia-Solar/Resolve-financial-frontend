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
  Avatar,
  Chip,
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
    <Box
      sx={{
        width: '100%',
        borderBottom: '1px solid #E0E0E0',
        borderRadius: '0px',
        padding: '16px',
        display: 'flex',
      }}
      spacing={2}
    >
      <Grid container xs={8} alignItems="center">
        <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 50, height: 50, marginRight: 2 }}>
            {' '}
            {/* {lead?.img} */}
            {<AccountCircle sx={{ fontSize: 62 }} />}
          </Avatar>
          <Box>
            <Typography variant="caption" sx={{ color: 'gray' }}>
              Cliente
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {lead?.name}
            </Typography>
          </Box>
        </Grid>

        <Grid
          item
          xs={4}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
        >
          <Grid
            item
            sx={{
              display: 'flex',
              flexDirection: 'column ',
              alignItems: 'flex-start',
              mr: 5,
            }}
          >
            <Typography variant="caption" sx={{ color: 'gray', mb: 0.5 }}>
              Nível de interesse
            </Typography>
            <Rating
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

          <Grid
            item
            sx={{
              display: 'flex',
              flexDirection: 'column ',
              alignItems: 'flex-start',
            }}
          >
            <Typography variant="caption" sx={{ color: 'gray', mr: 1, mb: 0.5 }}>
              Status
            </Typography>
            <Chip
              // label={lead?.status}
              label="Contrato"
              variant="outlined"
              sx={{
                color: 'gray',
                borderColor: 'green',
                px: 1,
              }}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid
        item
        xs={4}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexGrow: 1 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F5F5F5',
            borderRadius: '15px',
            padding: '6px 12px',
          }}
          xs={4}
        >
          <CalendarToday fontSize="small" sx={{ color: 'gray', mr: 1 }} />
          <Typography variant="caption" sx={{ color: 'gray' }}>
            Última atualização: 27/02/2025 10:45
          </Typography>
        </Box>
      </Grid>
    </Box>
  );
}

export default LeadInfoHeader;
