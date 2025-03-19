import React, { act, useState } from 'react';
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
  filters,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const saleStatus = {
    C: { label: 'Canelada', color: '#FFEBEE' },
    D: { label: 'Destrato', color: '#FFCDD2' },
    F: { label: 'Finalizada', color: '#E8F5E9' },
    P: { label: 'Pendente', color: '#FFF8E1' },
    E: { label: 'Em Andamento', color: '#E3F2FD' },
  };

  return (
    <Box sx={{ borderRadius: '12px', mb: 1, p: 3 }}>
      {data.map((sale) => (
        <Accordion
          key={sale.id}
          expanded={expanded === sale.id}
          onChange={handleChange(sale.id)}
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
                <Typography
                  sx={{ fontWeight: 500, fontSize: '16px', color: 'rgba(48, 48, 48, 0.5)' }}
                >
                  {sale.name}
                </Typography>
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
                  <Chip
                    label={saleStatus[sale.status]?.label}
                    color="primary"
                    variant="outlined"
                    sx={{ width: '95px' }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>
                    Data de Criação
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 500, fontSize: '16px', color: 'rgba(48, 48, 48, 0.5)' }}
                  >
                    {new Date(sale.created_at).toLocaleDateString('pt-BR')}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>
                    Código do Contrato
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 500, fontSize: '16px', color: 'rgba(48, 48, 48, 0.5)' }}
                  >
                    {sale.contract_number}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            {sale.projects && sale.projects.length > 0 ? (
              <TableComponent
                columns={columns}
                data={sale.projects}
                totalRows={totalRows}
                loading={false}
                page={0}
                rowsPerPage={5}
                onPageChange={() => {}}
                onRowsPerPageChange={() => {}}
                actions={actions}
              />
            ) : (
              <>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      color: '#7E8388',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: 3,
                    }}
                  >
                    Nenhum projeto associado a esta venda.
                  </Typography>
                </Grid>
              </>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ExpandableListComponent;
