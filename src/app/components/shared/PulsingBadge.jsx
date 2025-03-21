import React from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@mui/system';

const pulsate = keyframes`
  0% { transform: scale(0.1); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: scale(1.2); opacity: 0; }
`;

const PulsingBadge = ({ color = '#4BB543', noPulse = false }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {!noPulse && (
        <Box
          sx={{
            border: `3px solid ${color}`,
            borderRadius: '30px',
            height: '25px',
            width: '25px',
            position: 'absolute',
            animation: `${pulsate} 1s ease-out infinite`,
            opacity: 0,
          }}
        />
      )}
      <Box
        sx={{
          width: '15px',
          height: '15px',
          backgroundColor: color,
          borderRadius: '50%',
          position: 'absolute',
        }}
      />
    </Box>
  );
};

export default PulsingBadge;
