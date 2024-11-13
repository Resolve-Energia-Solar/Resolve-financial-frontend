import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from '@mui/material/Fade';

export default function CustomAccordion({ title, children, defaultExpanded = false }) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleExpansion}
      slots={{ transition: Fade }}
      slotProps={{ transition: { timeout: 400 } }}
      sx={[
        expanded
          ? {
              '& .MuiAccordion-region': {
                height: 'auto',
              },
              '& .MuiAccordionDetails-root': {
                display: 'block',
              },
            }
          : {
              '& .MuiAccordion-region': {
                height: 0,
              },
              '& .MuiAccordionDetails-root': {
                display: 'none',
              },
            },
      ]}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel-content"
        id="panel-header"
      >
        <Typography fontSize="0.9rem" fontWeight="bold">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {children}
      </AccordionDetails>
    </Accordion>
  );
}

