import React, { useState, useEffect } from 'react';
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
import StatusChip from '@/utils/status/ProjectStatusChip';
import { default as DocumentStatusChip } from '@/utils/status/DocumentStatusIcon';
import requestConcessionaireService from '@/services/requestConcessionaireService';
import { format } from 'date-fns';
import ChipRequest from '../components/ChipRequest';

const RequestList = ({ onClick = null, projectId = null }) => {
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await requestConcessionaireService.getAllByProject({
          page: page + 1,
          limit: rowsPerPage,
          projectId,
        });
        setProjectsList(data.results);
        setTotalRows(data.count);
        console.log('Data: ', data);
      } catch (err) {
        setError('Erro ao carregar Projetos');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [page, rowsPerPage]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<AddBoxRounded />}
          onClick={() => router.push('/apps/project/create')}
          sx={{ marginTop: 1, marginBottom: 2 }}
        >
          Nova Solicitação
        </Button>

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
                <TableCell>Distribuidora</TableCell>
                <TableCell>Tipo Solicitação</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Data da Solicitação</TableCell>
                <TableCell>Data de Conclusão</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectsList.map((item) => (
                <TableRow key={item.id} hover onClick={() => onClick(item)}>
                  <TableCell>{item?.company?.name}</TableCell>
                  <TableCell>{item?.type?.name}</TableCell>
                  <TableCell>
                    <ChipRequest status={item.status} />
                  </TableCell>
                  <TableCell>
                    {item.request_date ? format(new Date(item.request_date), 'dd/MM/yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    {item.conclusion_date
                      ? format(new Date(item.conclusion_date), 'dd/MM/yyyy')
                      : '-'}
                  </TableCell>
                  {/* <TableCell>
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
                    <Tooltip title="Excluir">
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
                    </Tooltip>
                  </TableCell> */}
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

export default RequestList;
