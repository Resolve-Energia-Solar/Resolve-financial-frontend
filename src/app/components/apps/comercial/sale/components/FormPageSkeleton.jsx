import { Grid, Skeleton, Box, Tabs, Tab } from '@mui/material';
import { useState } from 'react';

const FormPageSkeleton = () => {
  const [value, setValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ paddingTop: 4 }}>
      {value === 0 && (
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={12} lg={4} key={index}>
              <Skeleton variant="rectangular" height={56} />
            </Grid>
          ))}
          <Grid item xs={12} sm={12} lg={4}>
            <Skeleton variant="rectangular" height={56} />
          </Grid>
          <Grid item xs={12} sm={12} lg={12}>
            <Skeleton variant="rectangular" height={56} />
          </Grid>
          <Grid item xs={12} sm={12} lg={12}>
            <Skeleton variant="rectangular" height={56} />
          </Grid>
        </Grid>
      )}

      {value === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default FormPageSkeleton;
