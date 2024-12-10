import { Box, Typography, Select, MenuItem, TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function CommissionDetails({ data, onChange, edit, setEdit }) {


  console.log(data)
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
          <Select fullWidth size="small" value={data.status} onChange={onChange} name='status' disabled={edit}>
            <MenuItem value="PG">Pago</MenuItem>
            <MenuItem value="PE">Pendente</MenuItem>
          </Select>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Nome franquia
          </Typography>
          <Select fullWidth size="small" onChange={onChange} value={data.sale.branch.id} name='branch_id' disabled={edit}>
            <MenuItem value="2">Matriz</MenuItem>
            <MenuItem value="3">Marambaia</MenuItem>
            <MenuItem value="4">Cidade Nova</MenuItem>
            <MenuItem value="5">Umarizal</MenuItem>
            <MenuItem value="6">Augusto Montenegro</MenuItem>
            <MenuItem value="7">Duque</MenuItem>
          </Select>
        </Box>


        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Ajuste
            </Typography>
            <TextField fullWidth size="small" value={data.difference_value} onChange={onChange} name='difference_value' disabled={edit} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Valor
            </Typography>
            <TextField fullWidth size="small" value={data.installment_value} onChange={onChange} name='installment_value' disabled={edit} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => setEdit(false)}>Editar</Button>
          <Button variant="contained" color="primary">
            Salvar
          </Button>
        </Box>
      </Box>

      {/* Right side - Summary table */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          Resumo
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>KPI</TableCell>
                <TableCell align="right">Pré-análise</TableCell>
                <TableCell align="right">Pós-análise</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Valor projeto</TableCell>
                <TableCell align="right">-</TableCell>
                <TableCell align="right">-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Valor de referência</TableCell>
                <TableCell align="right">-</TableCell>
                <TableCell align="right">-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Diferença</TableCell>
                <TableCell align="right">-</TableCell>
                <TableCell align="right">-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Desconto</TableCell>
                <TableCell align="right">-</TableCell>
                <TableCell align="right">-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>7% margem</TableCell>
                <TableCell align="right">{data.margin_7}</TableCell>
                <TableCell align="right">-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Ajuste</TableCell>
                <TableCell align="right">-</TableCell>
                <TableCell align="right">-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Especificação de pagamento</TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right">-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Percentual de repasse</TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right">-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}