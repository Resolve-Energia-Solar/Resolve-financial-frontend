import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import EditCustomer from './customer';
import ListAddresses from './Addresses';
import ListPhones from './Phones';

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
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ bgcolor: 'background.paper', display: 'flex' }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider', width: '10%' }}
      >
        <Tab label="Geral" {...a11yProps(0)} />
        <Tab label="Endereços" {...a11yProps(1)} />
        <Tab label="Telefones" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <EditCustomer userId={userId} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ListAddresses userId={userId} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ListPhones userId={userId} />
      </TabPanel>
    </Box>
  );
}

