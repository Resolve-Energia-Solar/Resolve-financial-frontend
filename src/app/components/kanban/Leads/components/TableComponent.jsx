import React, { useState, useEffect, useContext } from 'react';
import {
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  Chip,
  IconButton
} from '@mui/material';
import { Add, Edit, Visibility } from '@mui/icons-material';
import TableSkeleton from '@/app/components/apps/comercial/sale/components/TableSkeleton';
import leadService from '@/services/leadService';
import formatPhoneNumber from '@/utils/formatPhoneNumber';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';
import TableHeader from '@/app/components/kanban/Leads/components/TableHeader'
import { IconEye, IconPencil } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

const TableComponent = ({ onClick }) => {
  const [leadsList, setLeadsList] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  const router = useRouter();


  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoadingLeads(true);
      try {
        const data = await leadService.getLeads({
          params: {
            page: page + 1,
            limit: rowsPerPage,
          },
        });
        setLeadsList(data.results);
        setTotalRows(data.count);
      } catch (err) {
        setError('Erro ao carregar Leads');
      } finally {
        setLoadingLeads(false);
      }
    };

    fetchLeads();

  }, [page, rowsPerPage]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><CustomCheckbox /></TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>CPF/CNPJ</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>Origem</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>kWp</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>Endereço</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>Fone</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>Editar/ Ver</TableCell>
            </TableRow>
          </TableHead>
          {loadingLeads ? (
            <TableSkeleton rows={rowsPerPage} columns={9} />
          ) : error && page === 1 ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableBody>
              {leadsList.map((item) => (
                <TableRow
                  key={item.id}
                  // onClick={() => onClick(item)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(236, 242, 255, 0.35)',
                    },
                  }}
                >
                  <TableCell><CustomCheckbox /></TableCell>
                  <TableCell sx={{ fontWeight: "600", color: "#7E8388" }}>{item?.name}</TableCell>
                  <TableCell sx={{ color: "#7E8388" }}>{item.first_document || '-'}</TableCell>
                  <TableCell sx={{ color: "#7E8388" }}>{item?.origin?.name || '-'}</TableCell>
                  <TableCell sx={{ color: "#7E8388" }}>{item?.kwp || '-'}</TableCell>
                  <TableCell sx={{ color: "#7E8388" }}>{item?.addresses[0]?.street || '-'}, {item?.addresses[0]?.number || '-'} - {item?.addresses[0]?.city || '-'}</TableCell>
                  <TableCell sx={{ color: "#7E8388" }}>{formatPhoneNumber(item?.phone)}</TableCell>
                  <TableCell>
                    <Chip
                      label={item?.column?.name || '-'}
                      sx={{
                        border: `1px solid ${item?.column?.color || 'transparent'}`,
                        backgroundColor: 'transparent',
                        color: "#7E8388"
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton
                      size="small"
                    onClick={() => router.push(`/apps/leads/${item.id}/edit`)}
                    >
                      <IconPencil fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() => router.push(`/apps/leads/${item.id}/view`)}
                    >
                      <IconEye fontSize="small" />
                    </IconButton>
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
  );
}
 export default TableComponent;