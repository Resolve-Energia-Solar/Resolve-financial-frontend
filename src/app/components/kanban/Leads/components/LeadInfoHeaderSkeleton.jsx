'use client';

import {
  Grid,
  Box,
  Skeleton,
  Typography,
  Avatar,
  IconButton,
} from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';

const LeadInfoHeaderSkeleton = () => {
  const theme = useTheme();

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
        {/* Avatar Section */}
        <Grid item sx={{ position: 'relative', display: 'inline-block', mr: 2 }}>
          <Skeleton variant="circular" width={55} height={55} />
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
            disabled
          >
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Grid>

        {/* Client Name Section */}
        <Grid item xs={4} sx={{ position: 'relative', display: 'inline-block', mr: 1 }}>
          <Typography variant="caption" sx={{ color: 'gray' }}>
            Cliente
          </Typography>
          <Skeleton variant="text" width="70%" height={24} />
        </Grid>

        {/* Interest Level and Status Section */}
        <Grid
          item
          xs={4}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
        >
          <Grid
            item
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              mr: 5,
            }}
          >
            <Typography variant="caption" sx={{ color: 'gray', mb: 0.5 }}>
              Nível de interesse
            </Typography>
            <Skeleton variant="rectangular" width={100} height={20} />
          </Grid>
          <Grid
            item
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Typography variant="caption" sx={{ color: 'gray', mb: 0.5 }}>
              Status
            </Typography>
            <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
          </Grid>
        </Grid>

      </Grid>
    </Box>
  );
};

export default LeadInfoHeaderSkeleton;