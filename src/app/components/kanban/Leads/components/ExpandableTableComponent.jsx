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
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconEye, IconPencil } from '@tabler/icons-react';
import TableComponent from './TableComponent';
import DomainIcon from '@mui/icons-material/Domain';

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
            <Box sx={{ display: 'flex', width: '100%' }}>
                <Grid item xs={2} sx={{ justifyContent: "flex-start" }}>
                    <DomainIcon sx={{ verticalAlign: 'middle' }}/>
                </Grid>
                <Grid item xs={8} sx={{ justifyContent: "flex-start", display: "flex", flexDirection: "column" }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "14px" }}>Venda</Typography>
                    <Typography sx={{ fontWeight: 500, fontSize: "16px", color: "#303030" }}>{sale.name}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Chip label={sale.status} color="primary" variant="outlined" />
                </Grid>
              
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
