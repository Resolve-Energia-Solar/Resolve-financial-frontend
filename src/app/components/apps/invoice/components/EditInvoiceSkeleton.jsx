import { Box, Grid, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const EditInvoiceSkeleton = () => {
  return (
    <Box>
      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2, md: 4 }}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Skeleton variant="text" width="25%" />
        <Box display="flex" gap={1}>
          <Skeleton variant="rectangular" width={120} height={40} />
        </Box>
      </Stack>

      <Grid container spacing={3} mb={4}>
        {[...Array(4)].map((_, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rectangular" height={50} mt={1} />
          </Grid>
        ))}
      </Grid>

      <Paper variant="outlined">
        <TableContainer sx={{ whiteSpace: { xs: 'nowrap', md: 'unset' } }}>
          <Table>
            <TableHead>
              <TableRow>
                {[...Array(5)].map((_, idx) => (
                  <TableCell key={idx}>
                    <Skeleton variant="text" width="80%" />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(3)].map((_, idx) => (
                <TableRow key={idx}>
                  {[...Array(5)].map((_, colIdx) => (
                    <TableCell key={colIdx}>
                      <Skeleton variant="rectangular" height={30} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default EditInvoiceSkeleton;
