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
import TableComponent from '@/app/components/kanban/Leads/components/TableComponent'
import { IconEye, IconPencil } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

const LeadList = ({ onClick }) => {
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
    <>
      <TableHeader
        title={"Total"}
        totalItems={totalRows}
        objNameNumberReference={"Leads"}
        buttonLabel="Criar"
        onButtonClick={() => console.log('Go to create lead')}
      />

      <TableComponent/>

    </>
  );
};

export default LeadList;
