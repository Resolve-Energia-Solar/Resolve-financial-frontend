import { formatToBRL } from '@/utils/currency';
import { Box, Typography, Select, MenuItem, TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function CommissionForm({ data}) {
  console.log(data);
  return (
    <Box sx={{ display: 'flex', gap: 4, p: 3, bgcolor: 'background.paper' }}>
      {/* Left side - Form inputs */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          Comissão
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Status de pagamento
          </Typography>
          <Select fullWidth value="pago" size="small">
            <MenuItem value="pago">Pago</MenuItem>
            <MenuItem value="pendente">Pendente</MenuItem>
          </Select>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Nome franquia
          </Typography>
          <Select fullWidth size="small">
            <MenuItem value="2">Matriz</MenuItem>
            <MenuItem value="3">Marambaia</MenuItem>
            <MenuItem value="4">Cidade Nova</MenuItem>
            <MenuItem value="5">Umarizal</MenuItem>
            <MenuItem value="6">Augusto Montenegro</MenuItem>
            <MenuItem value="7">Duque</MenuItem>
          </Select>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Dados bancários
          </Typography>
          <TextField fullWidth size="small" />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          {/* <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Ajuste
            </Typography>
            <TextField fullWidth size="small"  />
          </Box> */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Valor
            </Typography>
            <TextField fullWidth size="small" />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined">Editar</Button>
          <Button variant="contained" color="primary">
            Salvar
          </Button>
        </Box>
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          Resumo
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>KPI</TableCell>
                <TableCell align="right">Análise</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Valor venda</TableCell>
                <TableCell align="right">-</TableCell>

              </TableRow>
              <TableRow>
                <TableCell>Valor de referência</TableCell>
                <TableCell align="right">-</TableCell>

              </TableRow>
              <TableRow>
                <TableCell>Diferença</TableCell>
                <TableCell align="right">-</TableCell>

              </TableRow>
              <TableRow>
                <TableCell>Desconto</TableCell>
                <TableCell align="right">-</TableCell>

              </TableRow>
              <TableRow>
                <TableCell>7% margem</TableCell>
                <TableCell align="right">-</TableCell>

              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}