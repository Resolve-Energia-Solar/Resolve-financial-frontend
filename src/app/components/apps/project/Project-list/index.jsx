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
  Button,
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
import GenericFilterDrawer from '@/app/components/filters/GenericFilterDrawer';
import StatusChip from '@/utils/status/ProjectStatusChip';
import DocumentStatusChip from '@/utils/status/DocumentStatusIcon';
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
import { styled, keyframes } from '@mui/system';
import { FilterContext } from '@/context/FilterContext';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const OuterCircle = styled(Box)(({ theme, color }) => ({
  position: 'absolute',
  width: 64,
  height: 64,
  borderRadius: '50%',
  backgroundColor: color,
  animation: `${pulse} 1.5s ease-out infinite`,
}));

const InnerCircle = styled(Box)(({ theme, color }) => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: color,
  position: 'relative',
  zIndex: 1,
}));

const getColor = (value) => {
  if (value > 1) return '#f44336'; // red
  if (value > 0.5) return '#ffeb3b'; // green
  return '#4caf50'; // yellow
};

const getProgressColor = (value) => {
  if (value > 1) return '🔴 Crítico'; // red
  if (value > 0.5) return '🟡 Atenção'; // green
  return '🟢 Regular'; // yellow
};

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
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const router = useRouter();
  const userPermissions = useSelector((state) => state.user.permissions);
  const { filters, setFilters } = useContext(FilterContext);

  const projectFilterConfig = [
    {
      key: 'customer',
      label: 'Cliente',
      type: 'async-autocomplete',
      endpoint: '/api/users',
      queryParam: 'complete_name__icontains',
      mapResponse: (data) =>
        data.results.map((user) => ({
          label: user.complete_name,
          value: user.id,
        })),
    },
    {
      key: 'homologator',
      label: 'Homologador',
      type: 'async-autocomplete',
      endpoint: '/api/users',
      queryParam: 'complete_name__icontains',
      mapResponse: (data) =>
        data.results.map((user) => ({
          label: user.complete_name,
          value: user.id,
        })),
    },
    {
      key: 'current_step__in',
      label: 'Etapa Atual',
      type: 'async-multiselect',
      endpoint: '/api/steps-names',
      queryParam: 'name__icontains',
      mapResponse: (data) =>
        data.results.map((step) => ({
          label: step.name,
          value: step.id,
        })),
    },
    {
      key: 'signature_date',
      label: 'Data de Contrato',
      type: 'range',
      inputType: 'date',
    },
    {
      key: 'product_kwp',
      label: 'Kwp',
      type: 'number',
    },
    {
      key: 'material_list_is_completed',
      label: 'Lista de Material',
      type: 'select',
      options: [
        { value: 'true', label: 'Sim' },
        { value: 'false', label: 'Não' },
        { value: 'null', label: 'Todos' },
      ],
    },
    {
      key: 'new_contract_number',
      label: 'Nova UC',
      type: 'select',
      options: [
        { value: 'true', label: 'Sim' },
        { value: 'false', label: 'Não' },
        { value: 'null', label: 'Todos' },
      ],
    },
    {
      key: 'status',
      label: 'Status de Homologação',
      type: 'multiselect',
      options: [
        { value: 'P', label: 'Pendente' },
        { value: 'CO', label: 'Concluído' },
        { value: 'EA', label: 'Em Andamento' },
        { value: 'C', label: 'Cancelado' },
        { value: 'D', label: 'Distrato' },
      ],
    },
    {
      key: 'access_opnion',
      label: 'Parecer de Acesso',
      type: 'select',
      options: [
        { value: 'liberado', label: 'Liberado' },
        { value: 'bloqueado', label: 'Bloqueado' },
        { value: 'null', label: 'Todos' },
      ],
    },
    {
      key: 'trt_status',
      label: 'Status de TRT',
      type: 'multiselect',
      options: [
        { value: 'P', label: 'Pendente' },
        { value: 'A', label: 'Aprovado' },
        { value: 'EA', label: 'Em Andamento' },
        { value: 'R', label: 'Recusado' },
      ],
    },
    {
      key: 'supply_adquance',
      label: 'Adequação de Fornecimento',
      type: 'async-autocomplete',
      endpoint: '/api/supply-adequances',
      queryParam: 'name__icontains',
      mapResponse: (data) =>
        data.results.map((supply) => ({
          label: supply.name,
          value: supply.id,
        })),
    },
    {
      key: 'designer_status',
      label: 'Status do Projeto',
      type: 'multiselect',
      options: [
        { value: 'P', label: 'Pendente' },
        { value: 'CO', label: 'Concluído' },
        { value: 'EA', label: 'Em Andamento' },
        { value: 'C', label: 'Cancelado' },
        { value: 'D', label: 'Distrato' },
      ],
    },
    {
      key: 'is_released_to_engineering',
      label: 'Liberado para Engenharia',
      type: 'select',
      options: [
        { value: 'true', label: 'Sim' },
        { value: 'false', label: 'Não' },
        { value: 'null', label: 'Todos' }
      ],
    },
  ];

  const hasPermission = useCallback(
    (permissions) => {
      if (!permissions) return true;
      return permissions.some((permission) => userPermissions?.includes(permission));
    },
    [userPermissions],
  );

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const data = await projectService.index({
          page: page + 1,
          limit: rowsPerPage,
          expand: 'sale.customer,designer,homologator,product,sale',
          fields:
            'id,sale.id,sale.customer.complete_name,homologator.complete_name,designer_status,material_list_is_completed,trt_pending,peding_request,access_opnion,product.name,product.params,status,sale.status,is_released_to_engineering',
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
        const data = await projectService.getIndicators({ ...filters });
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
  }, [page, rowsPerPage, filters]);

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const trtStatusMap = {
    Bloqueado: {
      label: 'Bloqueado',
      color: theme.palette.error.light,
      icon: <CancelIcon sx={{ color: '#fff' }} />,
    },
    Reprovada: {
      label: 'Reprovada',
      color: theme.palette.error.light,
      icon: <CancelIcon sx={{ color: '#fff' }} />,
    },
    'Em Andamento': {
      label: 'Em Andamento',
      color: theme.palette.info.light,
      icon: <HourglassFullIcon sx={{ color: '#fff' }} />,
    },
    Concluída: {
      label: 'Concluída',
      color: theme.palette.success.light,
      icon: <CheckCircleIcon sx={{ color: '#fff' }} />,
    },
    Pendente: {
      label: 'Pendente',
      color: theme.palette.warning.light,
      icon: <HourglassEmptyIcon sx={{ color: '#fff' }} />,
    },
  };

  const accessOpinionStatusMap = {
    Liberado: {
      label: 'Liberado',
      color: theme.palette.success.light,
      icon: <CheckCircleIcon sx={{ color: '#fff' }} />,
    },
    Bloqueado: {
      label: 'Bloqueado',
      color: theme.palette.warning.light,
      icon: <HourglassEmptyIcon sx={{ color: '#fff' }} />,
    },
  };

  const blockedToEngineering = useAnimatedNumber(indicators?.blocked_to_engineering || 0);
  const pendingMaterialList = useAnimatedNumber(indicators?.pending_material_list || 0);
  const releasedToEngineering = useAnimatedNumber(
    indicators?.is_released_to_engineering_count || 0,
  );
  const designerInProgress = useAnimatedNumber(indicators?.designer_in_progress_count || 0);
  const designerComplete = useAnimatedNumber(indicators?.designer_complete_count || 0);
  const designerCanceled = useAnimatedNumber(indicators?.designer_canceled_count || 0);

  return (
    <>
      <Typography fontSize={20} fontWeight={700} sx={{ mt: 0, }} gutterBottom>
        Jornada do cliente
      </Typography>
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
                <Typography variant="body2">
                  <strong>ATENÇÃO</strong>
                </Typography>
                <Typography variant="body2">
                  Para que o <strong>PROJETO</strong> seja liberado para a engenharia, é necessário
                  que:
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  • STATUS da VENDA esteja como <strong>FINALIZADO</strong>.
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  • STATUS do FINANCEIRO na venda esteja como <strong>CONCLUÍDO</strong> ou{' '}
                  <strong>LIBERADO</strong>.
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
                      setFilters({
                        ...filters,
                        material_list_is_completed: false,
                        is_released_to_engineering: true,
                        designer_status__in: 'CO',
                      }),
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          mb: 2,
        }}
      >
        <Button
          variant="outlined"
          sx={{ mt: 1, mb: 2 }}
          onClick={() => setFilterDrawerOpen(true)}
        >
          Abrir Filtros
        </Button>
        <GenericFilterDrawer
          filters={projectFilterConfig}
          initialValues={filters}
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          onApply={(newFilters) => setFilters(newFilters)}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Liberado</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Etapa Atual</TableCell>
              {/* <TableCell>Medidor Etapa</TableCell>
              <TableCell>Medidor Geral</TableCell> */}
              <TableCell>Homologador</TableCell>
              <TableCell>Status da Venda</TableCell>
              <TableCell>Status Desenho Executivo</TableCell>
              <TableCell>Status de Homologação</TableCell>
              <TableCell>Lista de Materiais</TableCell>
              <TableCell>ART/TRT</TableCell>
              <TableCell>Solicitação da Conce.</TableCell>
              <TableCell>Parecer de Acesso</TableCell>
              <TableCell>Produto</TableCell>
              <TableCell>Kwp</TableCell>
            </TableRow>
          </TableHead>
          {loadingProjects ? (
            <TableSkeleton rows={rowsPerPage} columns={12} />
          ) : error && page === 1 ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableBody>
              {projectsList.map((item) => {
                const canEdit =
                  item.is_released_to_engineering ||
                  hasPermission(['resolve_crm.can_change_unready_project']);
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
                      {item.is_released_to_engineering ? (
                        <CheckIcon color="success" />
                      ) : (
                        <CloseIcon color="error" />
                      )}
                    </TableCell>
                    <TableCell>{item.sale?.customer?.complete_name}</TableCell>
                    <TableCell>Venda</TableCell>
                    {/* <TableCell>
                      <Typography sx={{ width: '90px' }}>{getProgressColor(0.5)}</Typography>
                      </TableCell>
                      <TableCell>
                      <Typography sx={{ width: '90px' }}>{getProgressColor(1)}</Typography>
                      </TableCell> */}
                    <TableCell>{item.homologator?.complete_name || '-'}</TableCell>
                      <TableCell>
                        <DocumentStatusChip status={item?.sale?.status} />
                      </TableCell>
                    <TableCell>
                      <ChipProject status={item.designer_status} />
                    </TableCell>
                    <TableCell>
                      <StatusChip status={item.status} />
                    </TableCell>
                    <TableCell>
                      {item.material_list_is_completed ? (
                        <CheckIcon color="success" />
                      ) : (
                        <CloseIcon color="error" />
                      )}
                    </TableCell>
                    <TableCell>
                      <GenericChip status={item.trt_pending} statusMap={trtStatusMap} />
                    </TableCell>
                    <TableCell>
                      {item.peding_request ? (
                        <CheckIcon color="success" />
                      ) : (
                        <CloseIcon color="error" />
                      )}
                    </TableCell>
                    <TableCell>
                      <GenericChip status={item.access_opnion} statusMap={accessOpinionStatusMap} />
                    </TableCell>
                    <TableCell>{item.product?.name}</TableCell>
                    <TableCell>{item.product?.params || '-'}</TableCell>
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
