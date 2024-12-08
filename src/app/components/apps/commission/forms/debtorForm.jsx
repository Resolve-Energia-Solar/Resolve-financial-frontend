import { Box, Typography, Select, MenuItem, TextField, Paper } from '@mui/material';

export default function SellerBalanceForm() {
  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Saldo vendedor
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Franquia
          </Typography>
          <Select fullWidth size="small" defaultValue="breves">
            <MenuItem value="breves">Breves</MenuItem>
          </Select>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            CNPJ
          </Typography>
          <TextField fullWidth size="small" />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Categoria
            </Typography>
            <TextField fullWidth size="small" />
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Status
            </Typography>
            <Select fullWidth size="small" defaultValue="pago">
              <MenuItem value="pago">Pago</MenuItem>
              <MenuItem value="pendente">Pendente</MenuItem>
            </Select>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Valor
            </Typography>
            <TextField fullWidth size="small" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Data do saldo devedor
            </Typography>
            <TextField type="date" fullWidth size="small" />
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Observação
          </Typography>
          <TextField fullWidth multiline rows={4} />
        </Box>
      </Box>
    </Paper>
  );
}