'use client';
import { Tabs, Tab, Box } from '@mui/material';
import CustomerTabs from '@/app/components/apps/users/Edit-user/customer/tabs';
import { useState } from 'react';
import GeneralInfoTab from './GeneralInfoTab';

const CONTEXT_TYPE_SALE_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_SALE_ID;

const DetailsTabs = ({ id, ...props }) => {
  const [value, setValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box {...props}>
      <Tabs value={value} onChange={handleChangeTab} variant="scrollable" scrollButtons="auto">
        <Tab label="Cliente" />
        <Tab label="Vistoria" />
        <Tab label="Venda" />
        <Tab label="Anexos" />
        <Tab label="Pagamentos" />
        <Tab label="Checklist" />
        <Tab label="Envios" />
        <Tab label="Histórico" />
        <Tab label="Comentários" />
      </Tabs>

      <Box>
        {value === 0 && (
          <Box sx={{ mt: 3 }}>
            <GeneralInfoTab data={''} />
          </Box>
        )}
        {value === 1 && <Box sx={{ mt: 3 }}></Box>}
        {value === 2 && <Box sx={{ mt: 3 }}></Box>}
        {value === 3 && <Box sx={{ mt: 3 }}></Box>}
        {value === 4 && <Box sx={{ mt: 3 }}></Box>}
        {value === 5 && <Box sx={{ mt: 3 }}></Box>}
        {value === 6 && <Box sx={{ mt: 3 }}></Box>}
        {value === 7 && <Box sx={{ mt: 3 }}></Box>}
      </Box>
    </Box>
  );
};

export default DetailsTabs;
