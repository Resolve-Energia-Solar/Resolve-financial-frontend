'use client';
import {
  Grid,
  Typography,
  Box,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import LeadInfoHeader from '@/app/components/kanban/Leads/components/HeaderCard';
import LeadAttachmentsAccordion from '../components/LeadAttachmentsAccordion';
import documentTypeService from '@/services/documentTypeService';
import { useEffect, useState } from 'react';

function LeadDocumentPage({ leadId = null }) {
  const [documentTypes, setDocumentTypes] = useState([]);

  const CONTEXT_TYPE_SALE_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_SALE_ID;

  const id_sale = 2070;

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

          <Box sx={{ mt: 2 }}>
            <LeadAttachmentsAccordion
              contentType={CONTEXT_TYPE_SALE_ID}
              objectId={id_sale}
              documentTypes={documentTypes}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default LeadDocumentPage;
