import React from 'react';
import { Box, Grid, Skeleton } from '@mui/material';

export default function AttachmentsSkeleton() {
  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={3} key={index}>
            <Box
              sx={{
                border: `2px dashed #E0E0E0`,
                padding: 2,
                textAlign: 'center',
                borderRadius: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Skeleton variant="rectangular" width={40} height={40} />
              <Skeleton variant="text" width={80} sx={{ marginTop: 1 }} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
