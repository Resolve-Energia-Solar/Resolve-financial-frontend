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
  Button,
  Box,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { AddBoxRounded } from '@mui/icons-material';
import FilterAlt from '@mui/icons-material/FilterAlt';
import { useRouter } from 'next/navigation';
import requestConcessionaireService from '@/services/requestConcessionaireService';
import { format } from 'date-fns';
import ChipRequest from '../components/auto-complete/ChipRequest';
import EditRequestCompany from '../Edit-request';
import AddRequestCompany from '../Add-request';
import RequestDrawer from '../components/filterDrawer/RequestDrawer';
import { RequestDataContext } from '@/app/context/RequestContext';

const RequestList = ({ projectId = null }) => {
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const router = useRouter();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { filters, setFilters } = useContext(RequestDataContext);

  const [requestIdSelected, setRequestIdSelected] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const refreshData = () => {
    setRefresh(!refresh);
  };

  const toggleRequestDrawer = (open) => () => {
    setIsFilterOpen(open);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(0);
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
        const params = {
          page: page + 1,
          limit: rowsPerPage,
          projectId,
          ...filters,
        };

        const data = await requestConcessionaireService.getAllByProject(params);
        setProjectsList(data.results.results);
        setTotalRows(data.count);
      } catch (err) {
        setError('Erro ao carregar Solicitações');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [page, rowsPerPage, refresh, filters]);

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

        <Box>
          <Button variant="outlined" startIcon={<FilterAlt />} onClick={toggleRequestDrawer(true)}>
            Filtros
          </Button>
          <RequestDrawer
            externalOpen={isFilterOpen}
            onClose={toggleRequestDrawer(false)}
            onApplyFilters={handleApplyFilters}
          />
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
                <TableCell>Tipo Solicitação</TableCell>
                <TableCell>Protoc. Provisório</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Data da Solicitação</TableCell>
                <TableCell>Data de Conclusão</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(projectsList) && projectsList.map((item) => (
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
                    {item.request_date
                      ? format(new Date(item.request_date), 'dd/MM/yyyy')
                      : '-'}
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
