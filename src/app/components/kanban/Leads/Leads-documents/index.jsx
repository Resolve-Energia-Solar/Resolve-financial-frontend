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
                    <Grid item xs={6}>
                      <AttachmentCard />
                    </Grid>
                    <Grid item xs={6}>
                      <AttachmentCard />
                    </Grid>
                    <Grid item xs={6}>
                      <AttachmentCard />
                    </Grid>
                    <Grid item xs={6}>
                      <AttachmentCard />
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="p" sx={{ fontWeight: 400, color: '#092C4C', cursor: 'pointer',fontSize: '14px' }}>
                    + Anexar novo documento
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default LeadDocumentPage;
