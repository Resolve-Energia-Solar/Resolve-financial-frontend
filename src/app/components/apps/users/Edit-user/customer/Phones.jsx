import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import userService from '@/services/userService';
import TableSkeleton from '@/app/components/apps/comercial/sale/components/TableSkeleton';

export default function ListPhones({ userId = null }) {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, [userId]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: '100%' }} aria-label="table of phones">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '20%' }}>Código do País</TableCell>
            <TableCell sx={{ width: '60%' }} align="left">
              Telefone
            </TableCell>
            <TableCell sx={{ width: '20%' }} align="left">
              Principal
            </TableCell>
          </TableRow>
        </TableHead>
        {loading ? (
          <TableSkeleton rows={5} columns={3} />
        ) : (
          <TableBody>
            {phones.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row" sx={{ width: '20%' }}>
                  +{row.country_code}
                </TableCell>
                <TableCell sx={{ width: '60%' }} align="left">
                  {row.phone_number}
                </TableCell>
                <TableCell sx={{ width: '20%' }} align="left">
                  {row.is_main ? 'Sim' : 'Não'}
                </TableCell>
              </TableRow>
            ))}
            {phones.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Nenhum telefone encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
}
