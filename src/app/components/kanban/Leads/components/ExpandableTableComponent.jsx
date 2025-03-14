import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconEye, IconPencil } from '@tabler/icons-react';

const ExpandableListComponent = ({
  data,
  actions,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box>
      {data.map((sale) => (
        <Accordion
          key={sale.id}
          expanded={expanded === sale.id}
          onChange={handleChange(sale.id)}
          sx={{ borderRadius: '12px', mb: 1, boxShadow: 3 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Typography sx={{ fontWeight: 600 }}>{sale.name}</Typography>
              <Chip label={sale.status} color="primary" variant="outlined" />
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <List>
              {sale.projects && sale.projects.length > 0 ? (
                sale.projects.map((project) => (
                  <ListItem key={project.id} sx={{ borderBottom: '1px solid #E0E0E0' }}>
                    <ListItemText
                      primary={project.name}
                      secondary={`Tipo: ${project.type || 'N/A'} | Responsável: ${project.seller || 'N/A'}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => actions?.edit && actions.edit(project)}
                        sx={{ color: '#7E8388' }}
                      >
                        <IconPencil size="18" />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => actions?.view && actions.view(project)}
                        sx={{ color: '#7E8388' }}
                      >
                        <IconEye size="18" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              ) : (
                <Typography sx={{ color: '#ADADAD', pl: 2 }}>Nenhum projeto disponível.</Typography>
              )}
            </List>
            <Typography sx={{ color: '#1976d2', mt: 1, cursor: 'pointer' }}>
              + Adicionar Novo Projeto
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ExpandableListComponent;
