'use client';
import {
  Grid,
  Box,
  Typography,
} from '@mui/material';
import LeadInfoHeader from '@/app/components/kanban/Leads/components/HeaderCard';
import LeadAttachmentsAccordion from '../components/LeadAttachmentsAccordion';
import documentTypeService from '@/services/documentTypeService';
import { useEffect, useState } from 'react';
import saleService from '@/services/saleService';

function LeadDocumentPage({ leadId = null, customer = null }) {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [saleIds, setSaleIds] = useState([]);

  const CONTEXT_TYPE_SALE_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_SALE_ID;

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await saleService.index({
          customer__in: customer.id,
          fields: 'id,str'
        });
        setSaleIds(response.results.results || []);
      } catch (err) {
        console.error('Erro ao buscar as vendas:', err);
      }
    };

    fetchSales();
  }, [customer]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await documentTypeService.getDocumentTypeFromContract();
        setDocumentTypes(response.results);
      } catch (error) {
        console.log('Error: ', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sx={{ overflow: 'scroll' }}>
        <Box
          sx={{
            borderRadius: '20px',
            boxShadow: 13,
            p: 3,
            m: 0.1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <LeadInfoHeader leadId={leadId} />

          {saleIds.length > 0 ? (
            saleIds.map((sale) => (
              <Box key={sale.id} sx={{ mt: 2 }}>
                <LeadAttachmentsAccordion
                  contentType={CONTEXT_TYPE_SALE_ID}
                  objectId={sale.id}
                  title={`#${sale.str} - Anexos`}
                  documentTypes={documentTypes}
                />
              </Box>
            ))
          ) : (
            <Typography sx={{ mt: 2, textAlign: 'center' }}>
              Nenhuma venda encontrada para este cliente.
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default LeadDocumentPage;
