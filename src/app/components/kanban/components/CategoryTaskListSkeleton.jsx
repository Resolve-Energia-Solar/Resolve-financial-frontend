'use client';

import { Box, Stack, Skeleton, Typography } from '@mui/material';

function CategoryTaskListSkeleton() {
  return (
    <Box width="350px" boxShadow={4} px={3} py={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack direction="column" spacing={0.5}>
          <Skeleton variant="text" width={60} height={15} />
          <Skeleton variant="text" width={120} height={20} />
        </Stack>
        <Stack direction="row" spacing={1}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </Stack>
      </Box>
      
      <Stack spacing={2}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} variant="rectangular" width="100%" height={50} />
        ))}
      </Stack>
    </Box>
  );
}

export default CategoryTaskListSkeleton;
