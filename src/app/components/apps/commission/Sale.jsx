
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';


function Sale({ data }) {


  return (

    <>

      <Box sx={{ p: 2, border: '1px none grey', display: 'flex', justifyContent: 'space-around' }}>
        <Box sx={{ p: 2, border: '1px solid grey', display: 'flex', justifyContent: 'space-around', width: '55%', height: '100px' }}>
          <Box sx={{ p: 2, border: '1px none grey', height: '50%', padding: '0px' }}>

            <Box>
              <Typography variant='caption'>Bloqueado</Typography>
              <Typography variant='h5'>R$ 157.000,00</Typography>
            </Box>

          </Box>
          <Box sx={{ p: 2, border: '1px none grey', padding: '0px' }}>

            <Box>
              <Typography variant='caption'>Bloqueado</Typography>
              <Typography variant='h5'>R$ 7.000.00,00</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: 2, border: '1px solid grey', width: '35%', paddingLeft: '25px' }}>
          <Box>
            <Typography variant='caption'>Saldo devedor</Typography>
            <Typography variant='h5'>R$ 253.010,00</Typography>
          </Box>
        </Box>
      </Box>

      <TableContainer sx={{ border: '1px solid grey', borderRadius: '8px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status de comissão</TableCell>
              <TableCell align="right">Nome</TableCell>
              <TableCell align="right">Data Contrato</TableCell>
              <TableCell align="right">Status vistoria</TableCell>
              <TableCell align="right">Status documentação</TableCell>
              <TableCell align="right">Status financeiro</TableCell>
              <TableCell align="right">Unidade</TableCell>
              <TableCell align="right">Especificação de pagamento</TableCell>
              <TableCell align="right">Valor do projeto</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="right">{row.statcommi}</TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.datac}</TableCell>
                <TableCell align="right">{row.statvistoria}</TableCell>
                <TableCell align="right">{row.statusdoc}</TableCell>
                <TableCell align="right">{row.statusfinanceiro}</TableCell>
                <TableCell align="right">{row.unidade}</TableCell>
                <TableCell align="right">{row.especpagam}</TableCell>
                <TableCell align="right">{row.valprojeto}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer></>
      
  )
}

export default Sale;