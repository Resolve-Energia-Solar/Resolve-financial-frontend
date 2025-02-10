import React, { useState, useEffect, useContext } from 'react';
import {
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { IconListDetails, IconPaperclip, IconSortAscending } from '@tabler/icons-react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Edit as EditIcon, Delete as DeleteIcon, AddBoxRounded } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import projectService from '@/services/projectService';
import DrawerFiltersProject from '../components/DrawerFilters/DrawerFiltersProject';
import StatusChip from '@/utils/status/ProjectStatusChip';
import { default as DocumentStatusChip } from '@/utils/status/DocumentStatusIcon';
import { ProjectDataContext } from '@/app/context/ProjectContext';
import TableSkeleton from '../../comercial/sale/components/TableSkeleton';
import ChipProject from '../components/ChipProject';
import ProjectCards from '../../inforCards/InforQuantity';

const ProjectList = ({ onClick }) => {
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const router = useRouter();
  const [indicators, setIndicators] = useState({});

  const { filters, setFilters, refresh } = useContext(ProjectDataContext);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await projectService.getProjects({
          page: page + 1,
          limit: rowsPerPage,
          expand: 'sale.customer',
          ...filters,
        });
        setProjectsList(data.results.results);
        setTotalRows(data.count);
      } catch (err) {
        setError('Erro ao carregar Projetos');
      } finally {
        setLoading(false);
      }
    };

    const fetchIndicators = async () => {
      setLoading(true);
      try {
        const data = await projectService.getProjectsIndicators({
          ...filters,
        });

        setIndicators(data.indicators);
        console.log('indicators: ', indicators.indicators);
      } catch (err) {
        setError('Erro ao carregar Projetos');
      } finally {
        setLoading(false);
      }
    };

    fetchIndicators();
    fetchProjects();
  }, [page, rowsPerPage, filters, refresh]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Accordion defaultExpanded sx={{ marginBottom: 4 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="sale-cards-content"
          id="sale-cards-header"
        >
          <Typography variant="h6">Indicadores</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ProjectCards
            cardsData={[
              {
                backgroundColor: 'primary.light',
                iconColor: 'primary.main',
                IconComponent: IconListDetails,
                title: 'Bloqueado',
                subtitle: 'Para Engenharia',
                count: indicators?.blocked_to_engineering || '-',
              },
              {
                backgroundColor: 'success.light',
                iconColor: 'success.main',
                IconComponent: IconListDetails,
                title: 'Pendente',
                subtitle: 'Lista de Materiais',
                count: indicators?.pending_material_list || '-',
              },
              {
                backgroundColor: 'secondary.light',
                iconColor: 'secondary.main',
                IconComponent: IconListDetails,
                title: 'Liberados',
                subtitle: 'Para Engenharia',
                count: indicators?.is_released_to_engineering || '-',
              },
            ]}
          />

          <ProjectCards
            cardsData={[
              {
                backgroundColor: 'primary.light',
                iconColor: 'primary.main',
                IconComponent: IconListDetails,
                title: 'Em Andamento',
                subtitle: 'Projestista',
                count: indicators?.designer?.blocked_to_engineering || '-',
                onClick: () => setFilters({ ...filters, designer_status: 'EA' }),
              },
              {
                backgroundColor: 'success.light',
                iconColor: 'success.main',
                IconComponent: IconListDetails,
                title: 'Concluído',
                subtitle: 'Projestista',
                count: indicators?.designer?.complete || '-',
                onClick: () => setFilters({ ...filters, designer_status: 'CO' }),
              },
              {
                backgroundColor: 'secondary.light',
                iconColor: 'secondary.main',
                IconComponent: IconListDetails,
                title: 'Cancelado',
                subtitle: 'Projestista',
                count: indicators?.designer?.canceled || '-',
                onClick: () => setFilters({ ...filters, designer_status: 'C' }),
              },
            ]}
          />
        </AccordionDetails>
      </Accordion>

      <Typography variant="h6" gutterBottom>
        Lista de Projetos
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
        <Box>
          {/* <Button
            variant="outlined"
            startIcon={<AddBoxRounded />}
            onClick={() => router.push('/apps/project/create')}
            sx={{ marginBottom: 2 }}
          >
            Criar Projeto
          </Button> */}
        </Box>

        <DrawerFiltersProject />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Homologador</TableCell>
              <TableCell>Status do Projeto</TableCell>
              <TableCell>Produto</TableCell>
              <TableCell>Kwp</TableCell>
              <TableCell>Status de Homologação</TableCell>
              <TableCell>Status da Venda</TableCell>
            </TableRow>
          </TableHead>
          {loading ? (
            <TableSkeleton rows={rowsPerPage} cols={7} />
          ) : error && page === 1 ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableBody>
              {projectsList.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => onClick(item)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(236, 242, 255, 0.35)',
                    },
                  }}
                >
                  <TableCell>{item.sale?.customer?.complete_name}</TableCell>
                  <TableCell>{item.homologator?.complete_name || '-'}</TableCell>
                  <TableCell>
                    <ChipProject status={item.is_documentation_completed} />
                  </TableCell>{' '}
                  <TableCell>{item.product?.name}</TableCell>
                  <TableCell>{item.product?.params || '-'}</TableCell>
                  <TableCell>
                    <StatusChip status={item.status} />
                  </TableCell>
                  <TableCell>
                    <DocumentStatusChip status={item?.sale?.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage="Linhas por página"
        />
      </TableContainer>
    </>
  );
};

export default ProjectList;
