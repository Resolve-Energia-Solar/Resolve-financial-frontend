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
import TableComponent from './TableComponent';

const ExpandableListComponent = ({
    columns,
    data,
    totalRows,
    loading,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    actions,
    filters
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ borderRadius: '12px', mb: 1, p: 3}}>
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
            {sale.projects.length > 0 ? (
              <TableComponent
                columns={columns}
                data={data}
                totalRows={totalRows}
                loading={false}
                page={0}
                rowsPerPage={5}
                onPageChange={() => {}}
                onRowsPerPageChange={() => {}}
                // actions={{
                //   edit: onEdit,
                //   view: onView,
                // }}
              />
            ) : (
              <Typography sx={{ color: '#7E8388' }}>
                Nenhum projeto associado a este contrato.
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ExpandableListComponent;
