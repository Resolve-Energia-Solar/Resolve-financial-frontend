import * as React from 'react';
import { Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function ListScheduleSkeleton() {
  const skeletonRows = Array.from({ length: 8 });

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Schedule skeleton table">
        <TableHead>
          <TableRow>
            <TableCell>Cliente</TableCell>
            <TableCell>Serviço</TableCell>
            <TableCell>Data de Início</TableCell>
            <TableCell>Hora de Início</TableCell>
            <TableCell>Hora de Fim</TableCell>
            <TableCell>Agente</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {skeletonRows.map((_, index) => (
            <TableRow key={index}>
              {Array.from({ length: 7 }).map((_, idx) => (
                <TableCell key={idx}>
                  <Skeleton variant="text" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
