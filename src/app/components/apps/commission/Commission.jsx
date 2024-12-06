
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import DataCommission from './commission.json';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


function Commission({ data }) {

  console.log(data)

  return (

    <>

      <Box sx={{ p: 2, border: '1px none grey', height: '50%', padding: '0px', marginBottom: '15px' }}>

        <Box sx={{ p: 2, border: '1px solid grey', width: '40%', height: '50%', padding: '10px', display: 'flex', flexDirection: '', alignItems: 'center', marginBottom: '15px' }}>
          <Typography variant='h6' sx={{ marginRight: 2 }}>Total de comissão </Typography>
          <Typography >R$ 7.000,00 </Typography>
        </Box>

      </Box>

      <TableContainer sx={{ border: '1px solid grey', borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">Nome cliente</TableCell>
              <TableCell align="right">Unidade</TableCell>
              <TableCell align="right">Especificação de pagamento</TableCell>
              <TableCell align="right">Valor do projeto</TableCell>
              <TableCell align="right">Diferença</TableCell>
              <TableCell align="right">Percentual de repasse franquia</TableCell>
              <TableCell align="right">Valor final</TableCell>
              <TableCell align="right">Status de pagamento</TableCell>
              <TableCell align="right">Ajustes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="right">{item.nome_cliente}</TableCell>
                <TableCell align="right">{item.sale.branch?.name}</TableCell>
                <TableCell align="right">{item.status}</TableCell>
                <TableCell align="right">{item.status}</TableCell>
                <TableCell align="right">{item.difference_value}</TableCell>
                <TableCell align="right">{item.transfer_percentage}</TableCell>
                <TableCell align="right">{item.status}</TableCell>
                <TableCell align="right">{item.status}</TableCell>
                <TableCell align="right">{item.installment_value}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="text" sx={{ marginRight: '10px' }}>Editar</Button>
        <Button variant="text">Adicionar</Button>
      </Box>

    </>

  )
}

export default Commission;