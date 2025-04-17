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
  Typography,
} from '@mui/material';
import { AddBoxRounded, Edit } from '@mui/icons-material';
import EditPhonePage from '../phone/Edit-phone';
import CreatePhonePage from '../phone/Add-phone';

export default function Phones({ data, onRefresh = () => {}, userId }) {
  const [phones, setPhones] = useState([]);

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState(null);

  useEffect(() => {
    fetchPhones();
  }, [data, onRefresh]);

  const fetchPhones = async () => {
    setLoading(true);
    setPhones(data);
    setLoading(false);
  };

  const handleEditClick = (phone) => {
    setSelectedPhone(phone);
    setOpenEditModal(true);
  };

  return (
    <Box sx={{ marginBottom: 4 }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Contatos
      </Typography>
      <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
        <Table sx={{ width: '100%' }} aria-label="table of phones">
          <TableHead>
            <TableRow>
              <TableCell>Código de Área</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell align="right">Principal</TableCell>
              <TableCell align="right">Editar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from(new Array(5)).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from(new Array(4)).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton variant="text" width="100%" height={40} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : phones?.length > 0 ? (
              phones.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.area_code}
                  </TableCell>
                  <TableCell align="left">{row.phone_number}</TableCell>
                  <TableCell align="right">{row.is_main ? 'Sim' : 'Não'}</TableCell>
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
                <TableCell colSpan={4} align="center">
                  Nenhum telefone encontrado.
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
          onClick={() => setOpenModal(true)}
        >
          Novo
        </Button>
      </Box>

      {/* Criar telefone */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="lg">
        <DialogTitle>Adicionar Novo Telefone</DialogTitle>
        <DialogContent>
          <CreatePhonePage
            onClosedModal={() => setOpenModal(false)}
            userId={userId}
            onRefresh={onRefresh}
          />
        </DialogContent>
      </Dialog>

      {/* Editar telefone */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="lg">
        <DialogTitle>Editar Telefone</DialogTitle>
        <DialogContent>
          <EditPhonePage
            onClosedModal={() => setOpenEditModal(false)}
            phoneId={selectedPhone}
            onRefresh={onRefresh}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
