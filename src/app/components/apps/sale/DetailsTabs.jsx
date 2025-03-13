'use client';
import { Tabs, Tab, Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { TabPanel } from '../../shared/TabPanel';
import saleService from '@/services/saleService';
import Addresses from './Adresses';
import Phones from './phones';
import Customer from './Customer';

const DetailsTabs = ({ id, onRefresh, ...props }) => {
  const [value, setValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  // =========

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    fetchSale();
  }, []);

  const fetchSale = async () => {
    try {
      const response = await saleService.find(id, {
        expand: [
          'attachments',
          'sales_supervisor',
          'sales_manager',
          'branch',
          'payments',
          'contract-submissions',
          'customer',
          'customer.phone_numbers',
          'customer.addresses',
          'projects',
          'projects.units',
          'comments',
          'marketing_campaign',
          'seller',
        ],
        fields: [
          'customer.id',
          'customer.complete_name',
          'customer.email',
          'customer.first_document',
          'customer.birth_date',
          'customer.phone_numbers.id',
          'customer.phone_numbers.area_code',
          'customer.phone_numbers.phone_number',
          'customer.phone_numbers.is_main',
          'customer.addresses',
          'customer.gender',
          'customer.person_type',
          'id',
          'total_value',
          'branch.id',
          'branch.name',
          'marketing_campaign.id',
          'marketing_campaign.name',
          'seller.id',
          'seller.complete_name',
          'sales_supervisor.id',
          'sales_supervisor.complete_name',
          'sales_manager.id',
          'sales_manager.complete_name',
          'payment_status',
          'status',
          'billing_date',
          'cancellation_reasons',
          'is_pre_sale',
          'attachments.id',
          'attachments.document_type.id',
          'attachments.document_type.name',
          'attachments.status',
          'attachments.object_id',
          'attachments.document_subtype',
          'attachments.file',
          'attachments.description',
          'attachments.created_at',
        ],
        format: 'json',
      });

      setData(response);
    } catch (error) {
      console.log(error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box {...props}>
      <Tabs value={value} onChange={handleChangeTab} variant="scrollable" scrollButtons="auto">
        <Tab label="Gerais" />
        <Tab label="Vistorias" />
        <Tab label="Venda" />
        <Tab label="Projetos" />
        <Tab label="Anexos" />
        <Tab label="Pagamentos" />
        <Tab label="Checklist" />
        <Tab label="Envios" />
        <Tab label="Histórico" />
        <Tab label="Comentários" />
      </Tabs>

      {error && <Box>Erro</Box>}

      {data ? (
        <Box sx={{ overflowY: 'auto', height: '90vh' }}>
          <TabPanel value={value} index={0}>
            <Box
              sx={{
                bgcolor: 'background.paper',
                display: 'flex',
                padding: 0,
                flexDirection: 'column',
              }}
            >
              <Customer data={data.customer} onRefresh={onRefresh} />
              <Phones
                data={data.customer.phone_numbers}
                onRefresh={fetchSale}
                userId={data.customer.id}
              />
              <Addresses
                data={data.customer.addresses}
                onRefresh={fetchSale}
                userId={data.customer.id}
              />
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1}></TabPanel>
          <TabPanel value={value} index={2}></TabPanel>
          <TabPanel value={value} index={3}></TabPanel>
          <TabPanel value={value} index={4}></TabPanel>
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '70vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress size={40} color="inherit" />
        </Box>
      )}
    </Box>
  );
};

export default DetailsTabs;
