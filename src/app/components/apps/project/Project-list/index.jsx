'use client';
import React, { useState, useEffect, useContext, useCallback } from 'react';
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
  Tooltip,
} from '@mui/material';
import { IconListDetails } from '@tabler/icons-react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useSelector } from 'react-redux';
import GenericChip from '@/utils/status/Chip';
import theme from '@/utils/theme';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

function useAnimatedNumber(targetValue, duration = 800) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * targetValue));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [targetValue, duration]);

  return displayValue;
}

const ProjectList = ({ onClick }) => {
  const [projectsList, setProjectsList] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [indicators, setIndicators] = useState({});
  const [loadingIndicators, setLoadingIndicators] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const router = useRouter();

  const userPermissions = useSelector((state) => state.user.permissions);
  const { filters, setFilters, refresh } = useContext(ProjectDataContext);

  const hasPermission = useCallback((permissions) => {
    if (!permissions) return true;
    return permissions.some((permission) => userPermissions?.includes(permission));
  }, [userPermissions]);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const data = await projectService.getProjects({
          page: page + 1,
          limit: rowsPerPage,
          expand: 'sale.customer,designer,homologator,product,sale',
          fields: 'id,sale.id,sale.customer.complete_name,homologator.complete_name,designer_status,material_list_is_completed,trt_pending,peding_request,access_opnion,product.name,product.params,status,sale.status,is_released_to_engineering',
          ...filters,
        });
        setProjectsList(data.results);
        setTotalRows(data.meta.pagination.total_count);
      } catch (err) {
        setError('Erro ao carregar Projetos');
      } finally {
        setLoadingProjects(false);
      }
    };

    const fetchIndicators = async () => {
      setLoadingIndicators(true);
      try {
        const data = await projectService.getProjectsIndicators({ ...filters });
        console.log(data.indicators);
        setIndicators(data.indicators);
      } catch (err) {
        setError('Erro ao carregar Indicadores');
      } finally {
        setLoadingIndicators(false);
      }
    };

    fetchIndicators();
    fetchProjects();
  }, [page, rowsPerPage, filters, refresh]);

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const trtStatusMap = {
    'Bloqueado': { label: 'Bloqueado', color: theme.palette.error.light, icon: <CancelIcon sx={{ color: '#fff' }} /> },
    'Reprovada': { label: 'Reprovada', color: theme.palette.error.light, icon: <CancelIcon sx={{ color: '#fff' }} /> },
    'Em Andamento': { label: 'Em Andamento', color: theme.palette.info.light, icon: <HourglassFullIcon sx={{ color: '#fff' }} /> },
    'Concluída': { label: 'Concluída', color: theme.palette.success.light, icon: <CheckCircleIcon sx={{ color: '#fff' }} /> },
    'Pendente': { label: 'Pendente', color: theme.palette.warning.light, icon: <HourglassEmptyIcon sx={{ color: '#fff' }} /> },
  };

  const accessOpinionStatusMap = {
    'Liberado': { label: 'Liberado', color: theme.palette.success.light, icon: <CheckCircleIcon sx={{ color: '#fff' }} /> },
    'Bloqueado': { label: 'Bloqueado', color: theme.palette.warning.light, icon: <HourglassEmptyIcon sx={{ color: '#fff' }} /> },
  };

  const blockedToEngineering = useAnimatedNumber(indicators?.blocked_to_engineering || 0);
  const pendingMaterialList = useAnimatedNumber(indicators?.pending_material_list || 0);
  const releasedToEngineering = useAnimatedNumber(indicators?.is_released_to_engineering_count || 0);
  const designerInProgress = useAnimatedNumber(indicators?.designer_in_progress_count || 0);
  const designerComplete = useAnimatedNumber(indicators?.designer_complete_count || 0);
  const designerCanceled = useAnimatedNumber(indicators?.designer_canceled_count || 0);

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
              <>
                <Typography variant="body2"><strong>ATENÇÃO</strong></Typography>
                <Typography variant="body2">
                  Para que o <strong>PROJETO</strong> seja liberado para a engenharia, é necessário que:
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  • STATUS da VENDA esteja como <strong>FINALIZADO</strong>.
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  • STATUS do FINANCEIRO na venda esteja como <strong>CONCLUÍDO</strong> ou <strong>LIBERADO</strong>.
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  • A vistoria principal esteja com PARECER FINAL <strong>APROVADO</strong>.
                </Typography>
              </>
            }
          >
            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
              <HelpOutlineIcon />
            </Box>
          </Tooltip>
        </AccordionSummary>
        <AccordionDetails>
          {false && loadingIndicators ? (
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
                    count: blockedToEngineering,
                    onClick: () => setFilters({ ...filters, is_released_to_engineering: false }),
                  },
                  {
                    backgroundColor: 'success.light',
                    iconColor: 'success.main',
                    IconComponent: IconListDetails,
                    title: 'Pendente',
                    subtitle: 'Lista de Materiais',
                    count: pendingMaterialList,
                    onClick: () =>
                      setFilters({ ...filters, material_list_is_completed: false, is_released_to_engineering: true, designer_status__in: 'CO' }),
                  },
                  {
                    backgroundColor: 'secondary.light',
                    iconColor: 'secondary.main',
                    IconComponent: IconListDetails,
                    title: 'Liberados',
                    subtitle: 'Para Engenharia',
                    count: releasedToEngineering,
                    onClick: () => setFilters({ ...filters, is_released_to_engineering: true }),
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
                    subtitle: 'Projetista',
                    count: designerInProgress,
                    onClick: () => setFilters({ ...filters, designer_status__in: 'EA' }),
                  },
                  {
                    backgroundColor: 'success.light',
                    iconColor: 'success.main',
                    IconComponent: IconListDetails,
                    title: 'Concluído',
                    subtitle: 'Projetista',
                    count: designerComplete,
                    onClick: () => setFilters({ ...filters, designer_status__in: 'CO' }),
                  },
                  {
                    backgroundColor: 'secondary.light',
                    iconColor: 'secondary.main',
                    IconComponent: IconListDetails,
                    title: 'Cancelado',
                    subtitle: 'Projetista',
                    count: designerCanceled,
                    onClick: () => setFilters({ ...filters, designer_status__in: 'C' }),
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 2 }}>
        <Box>
          {/* Botão para criar projeto pode ser adicionado aqui se necessário */}
        </Box>
        <DrawerFiltersProject />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Liberado</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Homologador</TableCell>
              <TableCell>Status do Projeto</TableCell>
              <TableCell>Lista de Materiais</TableCell>
              <TableCell>ART/TRT</TableCell>
              <TableCell>Solicitação da Conce.</TableCell>
              <TableCell>Parecer de Acesso</TableCell>
              <TableCell>Produto</TableCell>
              <TableCell>Kwp</TableCell>
              <TableCell>Status de Homologação</TableCell>
              <TableCell>Status da Venda</TableCell>
            </TableRow>
          </TableHead>
          {loadingProjects ? (
            <TableSkeleton rows={rowsPerPage} columns={12} />
          ) : error && page === 1 ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableBody>
              {projectsList.map((item) => {
                const canEdit = item.is_released_to_engineering || hasPermission(['resolve_crm.can_change_unready_project']);
                return (
                  <TableRow
                    key={item.id}
                    onClick={() => canEdit && onClick(item)}
                    sx={{
                      opacity: canEdit ? 1 : 0.5,
                      pointerEvents: canEdit ? 'auto' : 'none',
                      '&:hover': canEdit ? { backgroundColor: 'rgba(236, 242, 255, 0.35)' } : {},
                    }}
                  >
                    <TableCell>
                      {item.is_released_to_engineering ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
                    </TableCell>
                    <TableCell>{item.sale?.customer?.complete_name}</TableCell>
                    <TableCell>{item.homologator?.complete_name || '-'}</TableCell>
                    <TableCell>
                      <ChipProject status={item.designer_status} />
                    </TableCell>
                    <TableCell>
                      {item.material_list_is_completed ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
                    </TableCell>
                    <TableCell>
                      <GenericChip status={item.trt_pending} statusMap={trtStatusMap} />
                    </TableCell>
                    <TableCell>
                      {item.peding_request ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
                    </TableCell>
                    <TableCell>
                      <GenericChip status={item.access_opnion} statusMap={accessOpinionStatusMap} />
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
                );
              })}
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
