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
  IconButton,
  Tooltip,
  Chip,
  Button,
  Box,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, AddBoxRounded } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import projectService from '@/services/projectService';
import DrawerFiltersProject from '../components/DrawerFilters/DrawerFiltersProject';
import StatusChip from '@/utils/status/ProjectStatusChip';
import { default as DocumentStatusChip } from '@/utils/status/DocumentStatusIcon';
import { ProjectDataContext } from '@/app/context/ProjectContext';

const ProjectList = ({ onClick }) => {
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const router = useRouter();
  const [indicators, setIndicators] = useState([]);

  const { filters, refresh } = useContext(ProjectDataContext);

  useEffect(() => {
    console.log('filters', filters);
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await projectService.getProjects({
          page: page + 1,
          limit: rowsPerPage,
          expand: 'sale.customer',
          ...filters,
        });

        console.log('data.results', data.results);
        console.log('indicators', indicators);

        setIndicators(data?.results?.indicators);
        setProjectsList(data.results.results);
        setTotalRows(data.count);
      } catch (err) {
        setError('Erro ao carregar Projetos');
      } finally {
        setLoading(false);
      }
    };

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
      <Typography variant="h6" gutterBottom>
        Lista de Projetos
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<AddBoxRounded />}
          onClick={() => router.push('/apps/project/create')}
          sx={{ marginTop: 1, marginBottom: 2 }}
        >
          Criar Projeto
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <DrawerFiltersProject />
        </Box>
      </Box>

      {loading ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(new Array(rowsPerPage)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Projeto</TableCell>
                <TableCell>Produto</TableCell>
                <TableCell>Status do Projeto</TableCell>
                <TableCell>Status do Contrato</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectsList.map((item) => (
                <TableRow
                  key={item.id}
                  // hover={item?.sale?.status === 'F'}
                  onClick={() => onClick(item)}
                  // sx={{
                  //   opacity: item?.sale?.status === 'F' ? 1 : 0.5,
                  //   pointerEvents: item?.sale?.status === 'F' ? 'auto' : 'none',
                  // }}
                >
                  <TableCell>{item.sale?.customer?.complete_name}</TableCell>
                  <TableCell>{item?.project_number}</TableCell>
                  <TableCell>{item.product?.name}</TableCell>
                  <TableCell>
                    <StatusChip status={item.status} />
                  </TableCell>
                  <TableCell>
                    <DocumentStatusChip status={item?.sale?.status} />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/apps/project/${item.id}/update`);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {/* <Tooltip title="Excluir">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Lógica para excluir
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
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
      )}
    </>
  );
};

export default ProjectList;
