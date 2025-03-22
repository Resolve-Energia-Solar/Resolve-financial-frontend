import React from 'react';
import {
  Accordion,
  AccordionSummary,
  Box,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DomainIcon from '@mui/icons-material/Domain';

const SalesListSkeleton = ({ itemsCount = 3 }) => {
  return (
    <Box sx={{ borderRadius: '12px', mb: 1, p: 3 }}>
      {Array.from(new Array(itemsCount)).map((_, index) => (
        <Accordion
          key={index}
          expanded={false}
          sx={{ borderRadius: '12px', mb: 1, boxShadow: 3 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
              <Grid
                item
                xs={0.5}
                sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
              >
                <DomainIcon sx={{ verticalAlign: 'middle', color: '#7E8388' }} />
              </Grid>
              <Grid
                item
                xs={5.5}
                sx={{ justifyContent: 'flex-start', display: 'flex', flexDirection: 'column' }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>
                  Venda
                </Typography>
                <Skeleton variant="text" width="60%" height={24} />
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}
              >
                <Grid
                  item
                  xs={4}
                  sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>Status</Typography>
                  <Skeleton variant="rectangular" width={95} height={24} sx={{ borderRadius: 1 }} />
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>
                    Data de Criação
                  </Typography>
                  <Skeleton variant="text" width="70%" height={24} />
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>
                    Código do Contrato
                  </Typography>
                  <Skeleton variant="text" width="50%" height={24} />
                </Grid>
              </Grid>
            </Box>
          </AccordionSummary>
        </Accordion>
      ))}
    </Box>
  );
};

export default SalesListSkeleton;