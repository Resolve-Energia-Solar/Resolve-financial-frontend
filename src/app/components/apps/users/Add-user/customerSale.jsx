'use client';
import { useContext } from 'react';
import { Grid } from '@mui/material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import AutoCompleteUser from '@/app/components/apps/comercial/sale/components/auto-complete/Auto-Input-User';
import { OnboardingSaleContext } from '@/app/context/OnboardingCreateSale';

export default function CreateCustomerSale() {
  const { customerId, setCustomerId } = useContext(OnboardingSaleContext);

  return (
    <Grid 
      container 
      spacing={3} 
      style={{ display: 'flex', alignItems: 'center'}}
    >
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel htmlFor="name">Cliente</CustomFormLabel>
        <AutoCompleteUser onChange={(id) => setCustomerId(id)} value={customerId} />
      </Grid>
    </Grid>
  );
}
