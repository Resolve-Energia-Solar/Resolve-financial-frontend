'use client';

import {
  Grid,
  Typography,
  Box,
  Rating,
  IconButton,
  useTheme,
  Avatar,
  Chip,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';

import { CalendarToday, WbSunny } from '@mui/icons-material';

import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { usePathname } from 'next/navigation';
import leadService from '@/services/leadService';
import { IconCalendarWeek, IconEye, IconPencil, IconTrash } from '@tabler/icons-react';

function LeadInfoHeader({ leadId, tabValue }) {
  const [lead, setLead] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
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
        setProjects(data?.projects || []);
        setSelectedProject(data?.projects[0]?.id || '');
      } catch (err) {
        enqueueSnackbar('Não foi possível carregar o lead', { variant: 'error' });
      } finally {
        setLoadingLeads(false);
      }
    };

    fetchLead();
  }, [leadId]);

  if (!lead) return <Typography>Carregando informações do lead...</Typography>;

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
      <Grid container xs={12} alignItems="center">
        <Grid item sx={{ position: 'relative', display: 'inline-block', mr: 2 }}>
          <Avatar
            sx={{
              width: 55,
              height: 55,
              backgroundColor: '#D9D9D9',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {' '}
            {/* {lead?.img} */}
            {/* {placeholder?} */}
          </Avatar>
          <IconButton
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.light,
              width: 20.23,
              height: 20.23,
              '&:hover': { backgroundColor: theme.palette.secondary.main },
            }}
          >
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Grid>

        <Grid item xs={4} sx={{ position: 'relative', display: 'inline-block', mr: 1 }}>
          <Typography variant="caption" sx={{ color: 'gray' }}>
            Cliente
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {lead?.name}
          </Typography>
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
              sx={{ gap: 0.5 }}
              icon={<WbSunny fontSize="inherit" sx={{ color: theme.palette.primary.main }} />}
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
            <Typography variant="caption" sx={{ color: 'gray', mb: 0.5 }}>
              Status
            </Typography>
            <Chip
              label={lead?.column?.name}
              variant="outlined"
              sx={{
                color: 'gray',
                borderColor: `${lead?.column?.color}`,
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

        {/* <Box
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
            Data de criação: {new Date(lead?.created_at).toLocaleDateString('pt-BR')}
          </Typography>
        </Box> */}

        {tabValue === 2 && (
          <Box sx={{ minWidth: 385 }}>
            <Typography variant="caption" sx={{ color: 'gray', mb: 0.5 }}>
              Projeto
            </Typography>
            <Select
              value={selectedProject || ''}
              onChange={(e) => setSelectedProject(e.target.value)}
              fullWidth
              size="small"
              sx={{ backgroundColor: '#F4F5F7', borderRadius: '8px', }}
              displayEmpty
            >
              {/* {projects.map((project) => ( */}
              <MenuItem
                value=""
                sx={{ color: '#7E8388' }}
                disabled
              >
                Selecione um projeto
              </MenuItem>

              <MenuItem
                // key={project.id} 
                // value={project.id} 
                value="project-1"
                sx={{ color: '#7E8388' }}
              >
                {/* {project.name} */}
                Rua Antônio Barreto, 1198
              </MenuItem>

              <MenuItem
                value="project-2"
                sx={{ color: '#7E8388' }}
              >
                Rua dos Mundurucus, 2500
              </MenuItem>

              <MenuItem
                value="project-3"
                sx={{ color: '#7E8388' }}
              >
                Tv. Padre Eutíquio, 87
              </MenuItem>

              {/* ))} */}
            </Select>
          </Box>
        )}

        {tabValue === 10 && (
          <Grid item md={2} sx={{ display: "flex", flexDirection: "row"}}>
            <IconButton
              size="small"
              onClick={() => router.push(`/apps/leads/${leadId}/edit`)}
            >
              <IconPencil fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
            // onClick={() => router.push(`/apps/leads/${item.id}/view`)}
            >
              <IconTrash fontSize="small" />
            </IconButton>
          </Grid>
        )}

      </Grid>
    </Box>
  );
}

export default LeadInfoHeader;
