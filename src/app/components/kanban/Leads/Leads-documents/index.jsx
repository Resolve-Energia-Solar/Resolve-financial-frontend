'use client';

import { Grid, Box, Typography } from '@mui/material';
import LeadInfoHeader from '@/app/components/kanban/Leads/components/HeaderCard';
import LeadInfoHeaderSkeleton from '@/app/components/kanban/Leads/components/LeadInfoHeaderSkeleton';
import LeadAttachmentsAccordion from '../components/LeadAttachmentsAccordion';
import LeadAttachmentsAccordionSkeleton from '../components/LeadAttachmentsAccordionSkeleton';
import documentTypeService from '@/services/documentTypeService';
import saleService from '@/services/saleService';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { LeadModalTabContext } from '../context/LeadModalTabContext';

function LeadDocumentPage() {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [saleIds, setSaleIds] = useState([]);
  const [loadingSales, setLoadingSales] = useState(false);
  const [loadingDocumentTypes, setLoadingDocumentTypes] = useState(true);
  const { lead } = useContext(LeadModalTabContext);

  console.log('Lead teste:', lead?.customer);

  const customer = lead?.customer || null;
  const leadId = lead?.id || null;
  

  const CONTEXT_TYPE_SALE_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_SALE_ID;

  useEffect(() => {
    const fetchSales = async () => {
      setLoadingSales(true);
      try {
        const response = await saleService.index({
          fields: 'id,contract_number',
          customer: customer,
        });
        console.log('Sales response:', response.results);
        setSaleIds(response.results || []);
      } catch (err) {
        console.error('Erro ao buscar as vendas:', err);
      } finally {
        setLoadingSales(false);
      }
    };
    if (customer) {
      fetchSales();
    }
  }, [lead]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingDocumentTypes(true);
      try {
        const response = await documentTypeService.index({
          app_label__in: 'contracts',
          limit: 30,
        });
        setDocumentTypes(response.results);
      } catch (error) {
        console.log('Error: ', error);
      } finally {
        setLoadingDocumentTypes(false);
      }
    };
    fetchData();
  }, []);

  const isLoading = loadingSales || loadingDocumentTypes;

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
          {/* Render LeadInfoHeader or its skeleton */}
          {isLoading ? <LeadInfoHeaderSkeleton /> : <LeadInfoHeader />}

          {/* Render sales or skeleton */}
          {isLoading ? (
            <Box sx={{ mt: 2 }}>
              {Array.from(new Array(2)).map((_, index) => (
                <LeadAttachmentsAccordionSkeleton
                  key={index}
                  title={`#Venda ${index + 1} - Anexos`}
                  itemsCount={2}
                />
              ))}
            </Box>
          ) : saleIds.length > 0 ? (
            saleIds.map((sale) => (
              <Box key={sale.id} sx={{ mt: 2 }}>
                <LeadAttachmentsAccordion
                  contentType={CONTEXT_TYPE_SALE_ID}
                  objectId={sale.id}
                  title={`#${sale.contract_number} - Anexos`}
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
