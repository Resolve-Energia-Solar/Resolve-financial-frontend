"use client";
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


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function CustomerTabs({ userId = null }) {
  const params = useParams();
  let id = userId;
  if (!userId) id = params.id;

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ bgcolor: 'background.paper', display: 'flex', padding: 0 }}
    >
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider', minWidth: '50px' }}
      >
        <Tab label={<PersonIcon />} sx={{ p: 0, minWidth: '40px' }} {...a11yProps(0)} />
        <Tab label={<HomeIcon />} sx={{ p: 0, minWidth: '40px' }}  {...a11yProps(1)} />
        <Tab label={<PhoneIcon />} sx={{ p: 0, minWidth: '40px' }}   {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <EditCustomer userId={id} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ListAddresses userId={id} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ListPhones userId={id} />
      </TabPanel>
    </Box>
  );
}

