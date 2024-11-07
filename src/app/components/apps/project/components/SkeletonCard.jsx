import React from 'react';
import { Card, CardContent, Skeleton, Box } from '@mui/material';

const SkeletonCard = () => (
  <Card variant="outlined" sx={{ p: 3, mb: 3 }}>
    <CardContent>
      <Skeleton width="50%" height={20} />
      <Skeleton width="80%" height={20} />
      <Skeleton width="40%" height={20} />
      <Skeleton width="60%" height={20} />
      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Skeleton variant="rectangular" width={50} height={30} />
        <Skeleton variant="rectangular" width={50} height={30} />
      </Box>
    </CardContent>
  </Card>
);

export default SkeletonCard;
