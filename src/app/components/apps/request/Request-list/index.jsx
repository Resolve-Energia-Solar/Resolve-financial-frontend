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
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, AddBoxRounded } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import requestConcessionaireService from '@/services/requestConcessionaireService';
import { format } from 'date-fns';
import ChipRequest from '../components/ChipRequest';
import EditRequestCompany from '../Edit-request';
import AddRequestCompany from '../Add-request';

const RequestList = ({ projectId = null }) => {
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const router = useRouter();

  const [requestIdSelected, setRequestIdSelected] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const refreshData = () => {
    setRefresh(!refresh);
  };

  const handleEdit = (requestId) => {
    setRequestIdSelected(requestId);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setRequestIdSelected(null);
  };

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
        setError('Erro ao carregar Solicitacoes');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [page, rowsPerPage, refresh]);

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
          onClick={() => setOpenAddDialog(true)}
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
                <TableCell>Tipo Solicitação</TableCell>
                <TableCell>Protoc. Provisório</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Data da Solicitação</TableCell>
                <TableCell>Data de Conclusão</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectsList.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleEdit(item.id)}
                >
                  <TableCell>{item?.type?.name}</TableCell>
                  <TableCell>{item?.interim_protocol || '-'}</TableCell>
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

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="lg">
        <DialogTitle>Editar Solicitação</DialogTitle>

        <DialogContent>
          <EditRequestCompany
            requestId={requestIdSelected}
            onClosedModal={handleCloseEditDialog}
            onRefresh={refreshData}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth maxWidth="lg">
        <DialogTitle>Criar Solicitação</DialogTitle>

        <DialogContent>
          <AddRequestCompany
            projectId={projectId}
            onClosedModal={() => setOpenAddDialog(false)}
            onRefresh={refreshData}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RequestList;
