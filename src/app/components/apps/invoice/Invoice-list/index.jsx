'use client';
import React, { useContext, useState } from 'react';
import { InvoiceContext } from '@/app/context/InvoiceContext/index';
import {
  Table,
  TextField,
  Button,
  Tooltip,
  IconButton,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  Stack,
  InputAdornment,
  Paper,
  TableContainer,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import Link from 'next/link';
import {
  IconEdit,
  IconEye,
  IconEyeglass,
  IconSearch,
  IconShoppingBag,
  IconTrash,
  IconTruck,
} from '@tabler/icons-react';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';

import { useEffect } from 'react';

import paymentService from '@/services/paymentService';
import PaymentChip from '../components/PaymentChip';
import PaymentStatusChip from '../../../../../utils/status/PaymentStatusChip';
import { AddBoxRounded, Delete, Edit, MoreVert } from '@mui/icons-material';
import DashboardCards from '../components/kpis/DashboardCards';
import { useRouter } from 'next/navigation';
import PaymentList from '../components/paymentList/list';
import InforCards from '../../inforCards/InforCards';
import { IconListDetails, IconPaperclip, IconSortAscending } from '@tabler/icons-react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function InvoiceList() {
  const router = useRouter();
  const [paymentsList, setPaymentsList] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuOpenRowId, setMenuOpenRowId] = useState(null);

  const [open, setOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await paymentService.getPayments();
        setPaymentsList(response.results);
      } catch (error) {
        console.log('Error: ', error);
      }
    };

    fetchData();
  }, []);

  const handleMenuClick = (event, id) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuOpenRowId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuOpenRowId(null);
  };

  const handleEditClick = (id) => {
    router.push(`/apps/invoice/${id}/update`);
  };

  const handleCreateClick = () => {
    router.push('/apps/invoice/create');
  };

  const handleDeleteClick = (id) => {
    setInvoiceToDelete(id);
    setOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await paymentService.deletePayment(invoiceToDelete);
      setPaymentsList((prev) => prev.filter((payment) => payment.id !== invoiceToDelete));
    } catch (error) {
      console.log('Error: ', error);
    } finally {
      setOpen(false);
    }
  }

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
      {/* <DashboardCards /> */}
      
      <Accordion  sx={{marginBottom: 4}}>
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

        {/* <TextField
          id="search"
          type="text"
          size="small"
          variant="outlined"
          placeholder="Search"
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconSearch size={'16'} />
              </InputAdornment>
            ),
          }}
        /> */}
      </Stack>
      <PaymentList />
    </Box>
  );
}
export default InvoiceList;
