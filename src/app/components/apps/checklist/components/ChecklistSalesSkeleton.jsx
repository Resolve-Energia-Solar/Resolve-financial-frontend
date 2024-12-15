import React from 'react';
import { Box, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';

function ChecklistSalesSkeleton() {
  return (
    <div>
      {[...Array(2)].map((_, index) => (
        <Box key={index} mt={3}>
          <Card elevation={10}>
            <CardContent>
              <Stack spacing={1} mb={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="caption" color="text.secondary">
                    <Skeleton variant="text" width={80} />
                  </Typography>
                  <Skeleton variant="text" width="30%" height={20} />
                </Stack>
              </Stack>

              <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
            </CardContent>
          </Card>
        </Box>
      ))}
    </div>
  );
}

export default ChecklistSalesSkeleton;
