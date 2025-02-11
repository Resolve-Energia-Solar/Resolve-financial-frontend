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
  Skeleton,
  Tooltip
} from '@mui/material';
import { IconListDetails } from '@tabler/icons-react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AddBoxRounded } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import projectService from '@/services/projectService';
import DrawerFiltersProject from '../components/DrawerFilters/DrawerFiltersProject';
import StatusChip from '@/utils/status/ProjectStatusChip';
import DocumentStatusChip from '@/utils/status/DocumentStatusIcon';
import { ProjectDataContext } from '@/app/context/ProjectContext';
import TableSkeleton from '../../comercial/sale/components/TableSkeleton';
import ChipProject from '../components/ChipProject';
import ProjectCards from '../../inforCards/InforQuantity';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const ProjectList = ({ onClick }) => {
  // Estados para os dados e loading dos projetos
  const [projectsList, setProjectsList] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Estados para os indicadores
  const [indicators, setIndicators] = useState({});
  const [loadingIndicators, setLoadingIndicators] = useState(true);

  // Outros estados
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const router = useRouter();
  const { filters, setFilters, refresh } = useContext(ProjectDataContext);

  useEffect(() => {
    // Função para buscar os projetos
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const data = await projectService.getProjects({
          page: page + 1,
          limit: rowsPerPage,
          expand: 'sale.customer',
          ...filters,
        });
        console.log('data: ', data);
        setProjectsList(data.results.results);
        setTotalRows(data.count);
      } catch (err) {
        setError('Erro ao carregar Projetos');
      } finally {
        setLoadingProjects(false);
      }
    };

    // Função para buscar os indicadores
    const fetchIndicators = async () => {
      setLoadingIndicators(true);
      try {
        const data = await projectService.getProjectsIndicators({
          ...filters,
        });
        setIndicators(data.indicators);
        console.log('indicators: ', data.indicators);
      } catch (err) {
        setError('Erro ao carregar Indicadores');
      } finally {
        setLoadingIndicators(false);
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
          <Tooltip
            title={
              <React.Fragment>
                <Typography variant="body2">
                  <strong>ATENÇÃO</strong>
                </Typography>
                <Typography variant="body2">
                  Para que o <strong>PROJETO</strong> seja liberado para a engenharia, é necessário que:
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  • STATUS da VENDA esteja como <strong>FINALIZADO.</strong>
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  • STATUS do FINANCEIRO na venda esteja como <strong>PAGO</strong> ou <strong>LIBERADO.</strong>
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  • A vistoria principal esteja com PARECER FINAL <strong>CONCLUÍDO.</strong>
                </Typography>
              </React.Fragment>
            }
          >
            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
              <HelpOutlineIcon />
            </Box>
          </Tooltip>
        </AccordionSummary>
        <AccordionDetails>
          {loadingIndicators ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Skeleton variant="rectangular" width={200} height={100} />
                <Skeleton variant="rectangular" width={200} height={100} />
                <Skeleton variant="rectangular" width={200} height={100} />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Skeleton variant="rectangular" width={200} height={100} />
                <Skeleton variant="rectangular" width={200} height={100} />
                <Skeleton variant="rectangular" width={200} height={100} />
              </Box>
            </Box>
          ) : (
            <>
              <ProjectCards
                cardsData={[
                  {
                    backgroundColor: 'primary.light',
                    iconColor: 'primary.main',
                    IconComponent: IconListDetails,
                    title: 'Bloqueado',
                    subtitle: 'Para Engenharia',
                    count: indicators?.blocked_to_engineering || 0,
                  },
                  {
                    backgroundColor: 'success.light',
                    iconColor: 'success.main',
                    IconComponent: IconListDetails,
                    title: 'Pendente',
                    subtitle: 'Lista de Materiais',
                    count: indicators?.pending_material_list || 0,
                  },
                  {
                    backgroundColor: 'secondary.light',
                    iconColor: 'secondary.main',
                    IconComponent: IconListDetails,
                    title: 'Liberados',
                    subtitle: 'Para Engenharia',
                    count: indicators?.is_released_to_engineering || 0,
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
                    count: indicators?.designer?.in_progress || 0,
                    onClick: () => setFilters({ ...filters, designer_status: 'EA' }),
                  },
                  {
                    backgroundColor: 'success.light',
                    iconColor: 'success.main',
                    IconComponent: IconListDetails,
                    title: 'Concluído',
                    subtitle: 'Projestista',
                    count: indicators?.designer?.complete || 0,
                    onClick: () => setFilters({ ...filters, designer_status: 'CO' }),
                  },
                  {
                    backgroundColor: 'secondary.light',
                    iconColor: 'secondary.main',
                    IconComponent: IconListDetails,
                    title: 'Cancelado',
                    subtitle: 'Projestista',
                    count: indicators?.designer?.canceled || 0,
                    onClick: () => setFilters({ ...filters, designer_status: 'C' }),
                  },
                ]}
              />
            </>
          )}
        </AccordionDetails>
      </Accordion>

      <Typography variant="h6" gutterBottom>
        Lista de Projetos
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
        <Box>
          {/* Exemplo: Botão para criar projeto */}
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
          {loadingProjects ? (
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
                    <ChipProject status={item.designer_status} />
                  </TableCell>
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
