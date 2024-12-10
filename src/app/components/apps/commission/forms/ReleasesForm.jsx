import { Box, Typography, Select, MenuItem, TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function ReleasesForm() {
  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Criar lançamento</Typography>
        <Button variant="outlined" size="small">
          Salvar alterações
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Tipo de pagamento
          </Typography>
          <Select fullWidth size="small" defaultValue="credito">
            <MenuItem value="credito">Crédito</MenuItem>
            <MenuItem value="debito">Débito</MenuItem>
          </Select>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Valor
          </Typography>
          <TextField fullWidth size="small" />
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Razão social
          </Typography>
          <Select fullWidth size="small">
            <MenuItem value="">Selecione</MenuItem>
          </Select>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Departamento solicitante
          </Typography>
          <Select fullWidth size="small">
            <MenuItem value="">Selecione</MenuItem>
          </Select>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Departamento causador
          </Typography>
          <Select fullWidth size="small">
            <MenuItem value="">Selecione</MenuItem>
          </Select>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Conta bancária
          </Typography>
          <Select fullWidth size="small">
            <MenuItem value="">Selecione</MenuItem>
          </Select>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Data de solicitação
          </Typography>
          <TextField type="date" fullWidth size="small" />
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Data de Vencimento
          </Typography>
          <TextField type="date" fullWidth size="small" />
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Valor</TableCell>
                <TableCell>Número da Parcela</TableCell>
                <TableCell>Vencimento</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>R$</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Pendente</TableCell>
                <TableCell>
                  <Button size="small">Editar</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Descrição
        </Typography>
        <TextField fullWidth multiline rows={4} />
      </Box>
    </Box>
  );
}