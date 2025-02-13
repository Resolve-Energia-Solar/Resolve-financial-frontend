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
  Tooltip,
  Button
} from '@mui/material';
import { IconListDetails } from '@tabler/icons-react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Add, AddBoxRounded } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import projectService from '@/services/projectService';
import DrawerFiltersProject from '@/app/components/apps/project/components/DrawerFilters/DrawerFiltersProject';
import StatusChip from '@/utils/status/ProjectStatusChip';
import DocumentStatusChip from '@/utils/status/DocumentStatusIcon';
import { ProjectDataContext } from '@/app/context/ProjectContext';
import TableSkeleton from '@/app/components/apps/comercial/sale/components/TableSkeleton';
import ChipProject from '@/app/components/apps/project/components/ChipProject';
import ProjectCards from '@/app/components/apps/inforCards/InforQuantity';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const LeadList = ({ onClick }) => {
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
      <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'flex-end' }}>
        <Box>
          {/* Exemplo: Botão para criar projeto */}
          <Button
            startIcon={<Add />}
            onClick={() => router.push('/apps/project/create')}
            sx={{
              width: 74,
              height: 28,
              fontSize: '0.75rem',
              padding: '4px 8px',
              minWidth: 'unset',
              borderRadius: '4px',
              marginBottom: 2,
              backgroundColor: '#FFCC00',
              color: '#000',
              '&:hover': {
                backgroundColor: '#FFB800',
                color: '#000',
              },
            }}
          >
            Criar
          </Button>
        </Box>

      </Box>

      <TableContainer>
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

export default LeadList;
