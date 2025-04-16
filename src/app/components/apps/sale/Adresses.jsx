import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { AddBoxRounded, Edit } from '@mui/icons-material';
import EditAddressPage from '../address/Edit-address';
import CreateAddressPage from '../address/Add-address';
import addressService from '@/services/addressService';
import GenericAutocomplete from '../../auto-completes/GenericAutoComplete';
import { useSnackbar } from 'notistack';
import userService from '@/services/userService';

export default function Addresses({ userId, data, onRefresh = () => {} }) {
  const { enqueueSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleEditClick = (address) => {
    setSelectedAddress(address);
    setOpenEditModal(true);
  };

  const fetchAddress = async (search) => {
    try {
      const response = await addressService.index({
        q: search,
        limit: 40,
        fields: 'id,street,number,city,state',
      });
      return response.results;
    } catch (error) {
      console.error('Erro na busca de endereços:', error);
      return [];
    }
  };

  const handleAddAddressToUser = async () => {
    if (selectedAddresses.length === 0) {
      enqueueSnackbar('Selecione um endereço antes de adicionar.', { variant: 'warning' });
      return;
    }
  
    try {
      const existingAddressIds = data.map((addr) => addr.id);
  
      const selectedAddressIds = selectedAddresses.map((a) => a.id);
  
      const combinedIds = [...new Set([...existingAddressIds, ...selectedAddressIds])];
  
      await userService.update(userId, { addresses: combinedIds });
      enqueueSnackbar('Endereço adicionado com sucesso!', { variant: 'success' });
      setOpenModal(false);
      onRefresh();
    } catch (error) {
      enqueueSnackbar('Erro ao adicionar endereço.', { variant: 'error' });
      console.error('Erro ao adicionar endereço:', error);
    }
  };
  

  return (
    <Box sx={{ marginBottom: 2 }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Endereços
      </Typography>
      <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
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
            {data?.length > 0 ? (
              data.map((row) => (
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
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<AddBoxRounded />}
          sx={{ marginBottom: 2 }}
          onClick={() => {
            setOpenModal(true);
          }}
        >
          Novo
        </Button>
      </Box>

      {/* Modal de Adicionar Endereço */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="md"
        scroll="paper"
        sx={{ '& .MuiDialog-paper': { maxHeight: '80vh', mb: 2 } }}
      >
        <DialogTitle>Novo Endereço</DialogTitle>
        <DialogContent>
          <GenericAutocomplete
            addTitle="Adicionar Endereço"
            label="Endereço"
            fetchOptions={fetchAddress}
            multiple
            AddComponent={CreateAddressPage}
            getOptionLabel={(option) =>
              `${option.street}, ${option.number} - ${option.city}, ${option.state}`
            }
            onChange={(selected) => setSelectedAddresses(selected)}
            value={selectedAddresses}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleAddAddressToUser} color="primary" variant="contained">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Editar Endereço */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="lg">
        <DialogTitle>Editar Endereço</DialogTitle>
        <DialogContent>
          <EditAddressPage
            onClosedModal={() => setOpenEditModal(false)}
            addressId={selectedAddress}
            onRefresh={onRefresh}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
