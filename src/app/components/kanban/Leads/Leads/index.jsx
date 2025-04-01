import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import EditLeadPage from './Edit-Lead';
import LeadSchedulePage from '../Leads-schedule';
import LeadDocumentPage from '../Leads-documents';
import LeadsProposalListPage from '../Leads-proposal';
import EditCustomerPage from '../Leads-customer/Edit-Customer';
import SalesListPage from '../Leads-sales';
import { useSnackbar } from 'notistack';
import leadService from '@/services/leadService';
import { LeadModalTabProvider } from '../context/LeadModalTabContext';

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

function EditLeadTabs({ leadId }) {
  const [tabValue, setTabValue] = useState(0);
  const [lead, setLead] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const data = await leadService.find(leadId);
        setLead(data);
      } catch (err) {
        enqueueSnackbar('Não foi possível carregar o lead', { variant: 'error' });
      }
    };
    fetchLead();
  }, [leadId]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const theme = useTheme();

  return (
    <LeadModalTabProvider leadId={leadId}>
      <Box sx={{ overflow: 'hidden', height: '100%', p: 0, margin: 0 }}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          aria-label="lead edit tabs"
          TabIndicatorProps={{ style: { display: 'none' } }}
          sx={{ marginLeft: '25px', marginBottom: '-1px' }}
        >
          {[
            'Informações Lead',
            'Dados Pessoais',
            'Propostas',
            'Vendas',
            'Documentos',
            'Contratos',
            'Agendamentos',
          ].map((label, index) => (
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

        {/* infos do lead */}
        <CustomTabPanel value={tabValue} index={0}>
          <EditLeadPage leadId={leadId} />
        </CustomTabPanel>

        {/* dados pessoais */}
        <CustomTabPanel value={tabValue} index={1}>
          <EditCustomerPage leadId={leadId} />
        </CustomTabPanel>

        {/* propostas */}
        <CustomTabPanel value={tabValue} index={2}>
          <LeadsProposalListPage leadId={leadId} />
        </CustomTabPanel>

        {/* vendas */}
        <CustomTabPanel value={tabValue} index={3}>
          <SalesListPage lead={lead} />
        </CustomTabPanel>

        {/* docs */}
        <CustomTabPanel value={tabValue} index={4}>
          <LeadDocumentPage />
        </CustomTabPanel>

        {/* contratos */}
        <CustomTabPanel value={tabValue} index={5}>
        </CustomTabPanel>

        {/* agendamentos */}
        <CustomTabPanel value={tabValue} index={5}>
          <LeadSchedulePage leadId={leadId} />
        </CustomTabPanel>
      </Box>
    </LeadModalTabProvider>
  );
}

EditLeadTabs.propTypes = {
  leadId: PropTypes.string.isRequired,
};

export default EditLeadTabs;