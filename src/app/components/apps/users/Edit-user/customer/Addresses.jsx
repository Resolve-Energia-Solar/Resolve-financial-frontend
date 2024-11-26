import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import userService from '@/services/userService';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import { AddBoxRounded, Edit } from '@mui/icons-material';
import CreateAddressPage from '../../../address/Add-address';
import EditAddressPage from '../../../address/Edit-address';

export default function ListAddresses({ userId = null }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null); // Estado para o endereço selecionado

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const response = await userService.getAddressByUserId(userId);
        setAddresses(response.addresses || []);
        console.log('response', response);
      } catch (error) {
        console.error('Erro ao buscar endereços:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchAddresses();
  }, [userId, refresh]);

  const handleEditClick = (address) => {
    setSelectedAddress(address); // Define o endereço selecionado
    setOpenEditModal(true); // Abre o modal de edição
  };

  return (
    <TableContainer component={Paper}>
      <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<AddBoxRounded />}
          sx={{ marginBottom: 2 }}
          onClick={() => setOpenModal(true)}
        >
          Adicionar Endereço
        </Button>
      </Box>
      <Table sx={{ width: '100%' }} aria-label="table of addresses">
        <TableHead>
          <TableRow>
            <TableCell>Rua</TableCell>
            <TableCell>Número</TableCell>
            <TableCell align="right">Bairro</TableCell>
            <TableCell align="right">Cidade</TableCell>
            <TableCell align="right">CEP</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            Array.from(new Array(5)).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from(new Array(5)).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton variant="text" width="100%" height={40} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : addresses.length > 0 ? (
            addresses.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.street}
                </TableCell>
                <TableCell align="left">{row.number}</TableCell>
                <TableCell align="right">{row.neighborhood}</TableCell>
                <TableCell align="right">{row.city}</TableCell>
                <TableCell align="right">{row.zip_code}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleEditClick(row.id)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Nenhum endereço encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Criar endereço */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="lg">
        <DialogTitle>Adicionar Novo Endereço</DialogTitle>
        <DialogContent>
          <CreateAddressPage
            onClosedModal={() => setOpenModal(false)}
            userId={userId}
            onRefresh={handleRefresh}
          />
        </DialogContent>
      </Dialog>

      {/* Editar endereço */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="lg">
        <DialogTitle>Editar Endereço</DialogTitle>
        <DialogContent>
          <EditAddressPage
            onClosedModal={() => setOpenEditModal(false)}
            addressId={selectedAddress}
            onRefresh={handleRefresh}
          />
        </DialogContent>
      </Dialog>
    </TableContainer>
  );
}
