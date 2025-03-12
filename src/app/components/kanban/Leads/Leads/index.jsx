import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import PropTypes from 'prop-types';
import EditLeadPage from './Edit-Lead';
import LeadSchedulePage from '../Leads-schedule';
import LeadDocumentPage from '../Leads-documents';
import LeadsProposalListPage from '../Leads-proposal';
import EditCustomerPage from '../Leads-customer/Edit-Customer';
import LeadInfoHeader from '@/app/components/kanban/Leads/components/HeaderCard';
import SalesListPage from '../Leads-sales';


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

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ overflow: 'hidden', height: '100%' }}>

      <Tabs
        value={tabValue}
        onChange={handleChange}
        aria-label="lead edit tabs"
        TabIndicatorProps={{ style: { backgroundColor: 'white' } }}
        sx={{ marginLeft: '25px' }}
      >
        {["Informações Lead", "Dados Pessoais", "Propostas", "Vendas", "Documentos", "Projetos", "Agendamentos"].map((label, index) => (
          <Tab
            key={index}
            label={label}
            {...a11yProps(index)}
            sx={
              tabValue === index
                ? {
                  backgroundColor: '#FFCC00',
                  color: 'black',
                  borderTopLeftRadius: '10px',
                  borderTopRightRadius: '10px',
                  fontWeight: '500',
                  '&.Mui-selected': { color: 'black' },
                }
                : {}
            }
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
        <SalesListPage leadId={leadId} />
      </CustomTabPanel>

          {/* docs a ser retirado futuramente e integrado à page de projetos */}
      <CustomTabPanel value={tabValue} index={4}>
        <LeadDocumentPage leadId={leadId} />
      </CustomTabPanel>

          {/* contratos */}
      <CustomTabPanel value={tabValue} index={5}></CustomTabPanel>

          {/* agendamentos */}
      <CustomTabPanel value={tabValue} index={6}>   
        <LeadSchedulePage leadId={leadId} />
      </CustomTabPanel>

    </Box>
  );
}

EditLeadTabs.propTypes = {
  leadId: PropTypes.string.isRequired,
};

export default EditLeadTabs;
