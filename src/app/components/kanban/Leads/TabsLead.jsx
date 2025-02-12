import React from 'react';
import { Tabs, Tab, Box, Grid, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';
import EditLead from './EditLeads';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabsComponent({ tabValue, handleChange, loading, leadId }) {
  return (
    <Box sx={{ overflow: 'hidden' }}>
      <Tabs
        value={tabValue}
        onChange={handleChange}
        aria-label="lead edit tabs"
        TabIndicatorProps={{ style: { backgroundColor: 'white' } }}
      >
        {["Informações Lead", "Propostas", "Vendas"].map((label, index) => (
          <Tab
            key={index}
            label={label}
            {...a11yProps(index)}
            sx={tabValue === index ? { backgroundColor: '#FFCC00', color: 'black', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', fontWeight: '500', '&.Mui-selected': { color: 'black' } } : {}}
          />
        ))}
      </Tabs>

      <CustomTabPanel value={tabValue} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <EditLead leadId={0} />
          </Grid>
        </Grid>
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={1}>
        {loading ? <CircularProgress /> : <p>Details content here</p>}
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={2}>
        {loading ? <CircularProgress /> : <p>Notes content here</p>}
      </CustomTabPanel>
    </Box>
  );
}

TabsComponent.propTypes = {
  tabValue: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  leadId: PropTypes.string.isRequired,
};

export default TabsComponent;
