import React from 'react';
import {
  Box,
  Card,
  Skeleton,
  Stack,
  Typography,
  Avatar,
} from '@mui/material';
import BlankCard from '../../shared/BlankCard';

const TaskDataSkeleton = () => {
  return (
    <Box mb={3}>
      <BlankCard>
        <Box
          mt={1}
          px={2}
          py={1}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="text" width={60} height={20} />
          </Stack>

          <Box>
            <Skeleton variant="rectangular" width={80} height={20} />
          </Box>
        </Box>

        <Box px={2} py={0} display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" flexDirection="column" alignItems="center">
            <Skeleton variant="text" width={100} height={20} />
          </Box>

          <Box>
            <Skeleton variant="circular" width={35} height={35} />
          </Box>
        </Box>

        <Box>
          <Skeleton variant="rectangular" width="100%" height={106} />
        </Box>

        <Box px={2} py={0} display="flex" alignItems="center" gap={0.5}>
          <Skeleton variant="text" width={120} height={20} />
        </Box>

        <Box px={2} py={0.5} display="flex" alignItems="center" gap={0.5}>
          <Skeleton variant="text" width={150} height={20} />
        </Box>

        <Box
          display="flex"
          alignItems="center"
          px={2}
          py={1}
          mt={1}
          sx={{ backgroundColor: 'grey.100', gap: 0.5 }}
        >
          <Skeleton variant="text" width={200} height={20} />
        </Box>
      </BlankCard>
    </Box>
  );
};

export default TaskDataSkeleton;
