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
import EditPhonePage from '../../../phone/Edit-phone';
import CreatePhonePage from '../../../phone/Add-phone';

export default function ListPhones({ userId = null }) {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState(null);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    const fetchPhones = async () => {
      setLoading(true);
      try {
        const response = await userService.getPhoneByUserId(userId);
        setPhones(response.phone_numbers || []);
        console.log('response', response);
      } catch (error) {
        console.error('Erro ao buscar telefones:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchPhones();
  }, [userId, refresh]);

  const handleEditClick = (phone) => {
    setSelectedPhone(phone); // Define o telefone selecionado
    setOpenEditModal(true); // Abre o modal de edição
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: '100%' }} aria-label="table of phones">
        <TableHead>
          <TableRow>
            <TableCell>Código do País</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell align="right">Principal</TableCell>
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
          ) : phones.length > 0 ? (
            phones.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  +{row.country_code}
                </TableCell>
                <TableCell align="left">{row.phone_number}</TableCell>
                <TableCell align="right">{row.is_main ? 'Sim' : 'Não'}</TableCell>
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
  );
}
