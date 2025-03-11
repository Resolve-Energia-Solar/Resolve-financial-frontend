'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import EditCustomer from '@/app/components/apps/users/Edit-user/customer/customer';
import ListAddresses from '@/app/components/apps/users/Edit-user/customer/Addresses';
import ListPhones from '@/app/components/apps/users/Edit-user/customer/Phones';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import { useParams } from 'next/navigation';
import { TabPanel } from '../../shared/TabPanel';

const GeneralInfoTab = ({ data }) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', display: 'flex', padding: 0 }}>
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider', minWidth: '50px' }}
      >
        <Tab label={<PersonIcon />} sx={{ p: 0, minWidth: '40px' }} />
        <Tab label={<HomeIcon />} sx={{ p: 0, minWidth: '40px' }} />
        <Tab label={<PhoneIcon />} sx={{ p: 0, minWidth: '40px' }} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <EditCustomer data={data.customer} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ListAddresses data={data.addresses} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ListPhones data={data.customer} />
      </TabPanel>
    </Box>
  );
};

export default GeneralInfoTab;
