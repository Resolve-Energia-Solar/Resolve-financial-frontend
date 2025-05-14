import React from 'react';
import { Box, Tooltip, LinearProgress, Typography } from '@mui/material';
import ChipRequestStatus from './auto-complete/ChipRequestStatus';

const StatusWithProgressBar = ({ status, days }) => {
  const progress = Math.min((days / 10) * 100, 100);

  return (
    <Tooltip
      title={`${days ?? 0} dia${days === 1 ? '' : 's'} desde solicitação • Prazo: 10 dias`}
      arrow
      placement="top"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <ChipRequestStatus status={status} />
        
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 2,
            backgroundColor: '#eee',
            '& .MuiLinearProgress-bar': {
              borderRadius: 2,
              backgroundColor: progress >= 100 ? '#d32f2f' : '#1976d2',
            },
          }}
        />

        <Typography
          variant="caption"
          align="center"
          sx={{ color: progress >= 100 ? 'error.main' : 'text.secondary' }}
        >
          {days ?? 0} dia{days === 1 ? '' : 's'}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default StatusWithProgressBar;
