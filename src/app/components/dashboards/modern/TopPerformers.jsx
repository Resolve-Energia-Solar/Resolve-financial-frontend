'use client';
import React from 'react';
import DashboardCard from '../../shared/DashboardCard';
import CustomSelect from '../../forms/theme-elements/CustomSelect';
import {
  MenuItem,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  TableContainer,
  Stack,
} from '@mui/material';
import TopPerformerData from './TopPerformerData';

const vendedores = TopPerformerData;

const TopVendas = () => {
  const [mes, setMes] = React.useState('1');

  const handleChange = (event) => {
    setMes(event.target.value);
  };

  return (
    <DashboardCard
      title="Top Vendas"
      subtitle="Melhores Clientes"
      action={
        <CustomSelect
          labelId="mes-dd"
          id="mes-dd"
          size="small"
          value={mes}
          onChange={handleChange}
        >
          <MenuItem value={1}>Março 2024</MenuItem>
          <MenuItem value={2}>Abril 2024</MenuItem>
          <MenuItem value={3}>Maio 2024</MenuItem>
        </CustomSelect>
      }
    >
      <TableContainer>
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: 'nowrap',
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>Vendedor</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>Cliente</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>Prioridade</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>Orçamento</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendedores.map((vendedor) => (
              <TableRow key={vendedor.id}>
                <TableCell>
                  <Stack direction="row" spacing={2}>
                    <Avatar src={vendedor.imgsrc} alt={vendedor.imgsrc} sx={{ width: 40, height: 40 }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {vendedor.name}
                      </Typography>
                      <Typography color="textSecondary" fontSize="12px" variant="subtitle2">
                        {vendedor.post}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                    {vendedor.pname}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    sx={{
                      bgcolor:
                        vendedor.status === 'Alta'
                          ? (theme) => theme.palette.error.light
                          : vendedor.status === 'Média'
                            ? (theme) => theme.palette.warning.light
                            : vendedor.status === 'Baixa'
                              ? (theme) => theme.palette.success.light
                              : (theme) => theme.palette.secondary.light,
                      color:
                        vendedor.status === 'Alta'
                          ? (theme) => theme.palette.error.main
                          : vendedor.status === 'Média'
                            ? (theme) => theme.palette.warning.main
                            : vendedor.status === 'Baixa'
                              ? (theme) => theme.palette.success.main
                              : (theme) => theme.palette.secondary.main,
                      borderRadius: '8px',
                    }}
                    size="small"
                    label={vendedor.status}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">R${vendedor.budget}k</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

export default TopVendas;
