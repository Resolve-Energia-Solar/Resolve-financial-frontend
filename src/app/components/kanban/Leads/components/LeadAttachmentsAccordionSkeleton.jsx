'use client';

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Grid,
  Skeleton,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const LeadAttachmentsAccordionSkeleton = ({ title, itemsCount = 4 }) => {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          {title || 'Documentos'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {Array.from(new Array(itemsCount)).map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Skeleton
                  variant="rectangular"
                  height={40}
                  sx={{ borderRadius: '8px' }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="text" width={150} height={20} />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default LeadAttachmentsAccordionSkeleton;