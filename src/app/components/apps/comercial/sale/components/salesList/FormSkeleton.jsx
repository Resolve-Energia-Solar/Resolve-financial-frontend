import { Box, Skeleton, Stack } from '@mui/material';

const FormSkeleton = ({ fields = 6 }) => {
  return (
    <Stack spacing={2}>
      {Array.from({ length: fields }).map((_, index) => (
        <Box key={index}>
          <Skeleton variant="text" width="40%" height={20} /> {/* Label */}
          <Skeleton variant="rectangular" width="100%" height={40} /> {/* Input */}
        </Box>
      ))}

      {/* Simulando botão */}
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Skeleton variant="rectangular" width={120} height={40} />
      </Box>
    </Stack>
  );
};

export default FormSkeleton;
