'use client';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { AddBoxRounded, FilterAlt } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import paymentService from '@/services/paymentService';
import PaymentList from '../components/paymentList/list';
import InforCards from '../../inforCards/InforCards';
import FilterDrawer from '../components/filterDrawer/FilterDrawer';
import { IconListDetails, IconPaperclip, IconSortAscending } from '@tabler/icons-react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { InvoiceContext } from '@/app/context/InvoiceContext';
import { useContext } from 'react';

export default function InvoiceList({ onClick }) {
  const [paymentList, setPaymentsList] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { filters, setFilters, refresh } = useContext(InvoiceContext);

  useEffect(() => {
    setPage(0);
    setPaymentsList([]);
  }, [filters, refresh, page, rowsPerPage]);

  const fetchData = async (filters = {}) => {
    console.log('filters:', filters);
    try {
      const response = await paymentService.getPayments({
        limit: rowsPerPage,
        page: page + 1,
        filters
         });
      setPaymentsList(response.results);
    } catch (error) {
      console.log('Error:', error);
    }
  };
  
  useEffect(() => {
    fetchData(filters);
  }, [filters, refresh, page, rowsPerPage]);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleCreateClick = () => {
    router.push('/apps/invoice/create');
  };

  const toggleFilterDrawer = (open) => () => {
    setIsFilterOpen(open);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };
  
  useEffect(() => {
    if (filters) {
      fetchData(filters);
    }
  }, [filters, refresh, page, rowsPerPage]);


  const cardsData = [
    {
      backgroundColor: 'primary.light',
      iconColor: 'primary.main',
      IconComponent: IconListDetails,
      title: 'Crédito',
      count: '-',
    },
    {
      backgroundColor: 'success.light',
      iconColor: 'success.main',
      IconComponent: IconListDetails,
      title: 'Débito',
      count: '-',
    },
    {
      backgroundColor: 'secondary.light',
      iconColor: 'secondary.main',
      IconComponent: IconPaperclip,
      title: 'Boleto',
      count: '-',
    },
    {
      backgroundColor: 'warning.light',
      iconColor: 'warning.main',
      IconComponent: IconSortAscending,
      title: 'Financiamento',
      count: '-',
    },
    {
      backgroundColor: 'warning.light',
      iconColor: 'warning.main',
      IconComponent: IconSortAscending,
      title: 'Parcelamento Interno',
      count: '-',
    },
  ];

  return (
    <Box>
      <Accordion sx={{ marginBottom: 4 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="sale-cards-content"
          id="sale-cards-header"
        >
          <Typography variant="h6">Status</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <InforCards cardsData={cardsData} />
        </AccordionDetails>
      </Accordion>

      <Stack
        mt={3}
        justifyContent="space-between"
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <Box>
          <Button
            variant="outlined"
            startIcon={<AddBoxRounded />}
            sx={{ marginTop: 1, marginBottom: 2 }}
            onClick={handleCreateClick}
          >
            Adicionar Pagamento
          </Button>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterAlt />}
            sx={{ marginTop: 1, marginBottom: 2 }}
            onClick={toggleFilterDrawer(true)}
          >
            Filtros
          </Button>
            <FilterDrawer
              externalOpen={isFilterOpen}
              onClose={toggleFilterDrawer(false)}
              onApplyFilters={handleApplyFilters}
            />
        </Box>
      </Stack>

      <PaymentList onClick={onClick} items={paymentList} />
    </Box>
  );
}
