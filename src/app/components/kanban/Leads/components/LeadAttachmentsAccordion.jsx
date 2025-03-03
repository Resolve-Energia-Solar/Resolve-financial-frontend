'use client';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import AttachmentCard from '../components/CardAttachment';

function LeadAttachmentsAccordion() {
  return (
    <Accordion expanded={true}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Anexos da venda - RSOL0001
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}><AttachmentCard /></Grid>
            <Grid item xs={12} md={6}><AttachmentCard /></Grid>
            <Grid item xs={12} md={6}><AttachmentCard /></Grid>
            <Grid item xs={12} md={6}><AttachmentCard /></Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography
            variant="p"
            sx={{ fontWeight: 400, color: '#092C4C', cursor: 'pointer', fontSize: '14px' }}
          >
            + Anexar novo documento
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

export default LeadAttachmentsAccordion;
