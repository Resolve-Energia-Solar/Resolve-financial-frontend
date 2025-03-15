'use client';


import React, { useState } from 'react';
import { Tabs, Tab, Box, useTheme, Grid, } from '@mui/material';
import PropTypes from 'prop-types';
import EditLeadPage from '../Leads/Edit-Lead';
import EditCustomerPage from '../Leads-customer/Edit-Customer';
import LeadsProposalListPage from '../Leads-proposal';
import SalesListPage from '.';
import LeadDocumentPage from '../Leads-documents';
import LeadSchedulePage from '../Leads-schedule';
import LeadInfoHeader from '../components/HeaderCard';


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {value === index && <Box sx={{ p: 0.1, height: '100%', overflowY: 'auto' }}>{children}</Box>}
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

function LeadsViewSale({ leadId }) {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const theme = useTheme();

  return (
    <Grid item xs={12} sx={{ overflow: 'scroll' }}>
      <Box sx={{ borderRadius: '20px', display: 'flex', flexDirection: 'column', mb: 2 }}>
        <Grid item spacing={2} alignItems="center" xs={12}>
          <LeadInfoHeader leadId={leadId} tabValue={20} />
        </Grid>
      </Box>

      <Tabs
        value={tabValue}
        onChange={handleChange}
        aria-label="lead edit tabs"
        TabIndicatorProps={{ style: { display: 'none' } }}
        sx={{ marginLeft: '25px', marginBottom: "-1px" }}
      >
        {["Dados Cliente", "Checklist de Rateio", "Kits do Projeto", "Documentações"].map((label, index) => (
          <Tab
            key={index}
            label={label}
            {...a11yProps(index)}
            sx={{
              backgroundColor: tabValue === index ? theme.palette.primary.main : 'transparent',
              color: '#303030',
              fontWeight: 600,
              fontSize: '12px',
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                color: '#303030',
                fontWeight: 600,
                fontSize: '12px',
              },
              '&:not(.Mui-selected)': {
                fontWeight: 600,
                fontSize: '12px',
                color: '#7E8388',
              },
            }}
          />
        ))}
      </Tabs>

      {/* Dados Cliente */}
      <CustomTabPanel value={tabValue} index={0}>
        {/* <EditLeadPage leadId={leadId} /> */}
      </CustomTabPanel>

      {/* Checklist de Rateio */}
      <CustomTabPanel value={tabValue} index={1}>
        <EditCustomerPage leadId={leadId} />
      </CustomTabPanel>

      {/* Kits do Projeto */}
      <CustomTabPanel value={tabValue} index={2}>
        <LeadsProposalListPage leadId={leadId} />
      </CustomTabPanel>

      {/* Documentações */}
      <CustomTabPanel value={tabValue} index={3}>
        <SalesListPage leadId={leadId} />
      </CustomTabPanel>

    </Grid>
  );
}

LeadsViewSale.propTypes = {
  leadId: PropTypes.string.isRequired,
};

export default LeadsViewSale;
