import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Box,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TableComponent from './TableComponent';
import DomainIcon from '@mui/icons-material/Domain';
import SalesListSkeleton from './SalesListSkeleton';
import projectService from '@/services/projectService';

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
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  const handleChange = (panel) => async (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if (isExpanded) {
      await getProjects(panel);
    } else {
      setProjects([]);
      setIsLoadingProjects(false);
    }
  };

  const saleStatus = {
    C: { label: 'Canelada', color: '#FFEBEE' },
    D: { label: 'Destrato', color: '#FFCDD2' },
    F: { label: 'Finalizada', color: '#E8F5E9' },
    P: { label: 'Pendente', color: '#FFF8E1' },
    E: { label: 'Em Andamento', color: '#E3F2FD' },
  };

  const columns_projects = [
    {
      field: 'product',
      headerName: 'Nome do produto',
      flex: 1,
      render: (row) => `${row.product.name || ''}`,
    },
    {
      field: 'project_number',
      headerName: 'Número do Projeto',
      flex: 1,
      render: (row) => `${row.project_number || ''}`,
    },
    {
      field: 'params',
      headerName: 'Kwp',
      flex: 1,
    },
  ];

  if (loading) {
    return <SalesListSkeleton itemsCount={3} />;
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ borderRadius: '12px', mb: 1, p: 3 }}>
        <Typography
          sx={{
            color: '#7E8388',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '16px',
          }}
        >
          Nenhuma venda encontrada.
        </Typography>
      </Box>
    );
  }

  const getProjects = async (saleId) => {
    try {
      setIsLoadingProjects(true);
      setProjects([]);
      const response = await projectService.getProjects({
        sale: saleId,
        fields: 'id,product,project_number',
      });
      console.log('Projetos:', response);
      setProjects(response.results.results || []);
    } catch (err) {
      console.error('Erro ao buscar projetos:', err);
      setProjects([]);
    } finally {
      setIsLoadingProjects(false);
    }
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
                <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>Venda</Typography>
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
                    label={saleStatus[sale.status]?.label || 'Desconhecido'}
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
                    {sale.contract_number || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            {expanded === sale.id && isLoadingProjects ? (
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
                  Carregando projetos...
                </Typography>
              </Grid>
            ) : projects.length > 0 ? (
              <TableComponent
                columns={columns_projects}
                data={projects}
                totalRows={totalRows}
                loading={false}
                page={0}
                rowsPerPage={5}
                onPageChange={() => {}}
                onRowsPerPageChange={() => {}}
                actions={actions}
              />
            ) : (
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
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ExpandableListComponent;