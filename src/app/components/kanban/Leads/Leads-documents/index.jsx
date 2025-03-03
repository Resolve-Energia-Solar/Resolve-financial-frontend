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
import { ExpandMore } from '@mui/icons-material';
import AttachmentCard from '../components/CardAttachment';
import LeadAttachmentsAccordion from '../components/LeadAttachmentsAccordion';

function LeadDocumentPage({ leadId = null }) {
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
            <LeadAttachmentsAccordion />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default LeadDocumentPage;
