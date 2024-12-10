import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { CircularProgress, Typography } from '@mui/material';
import { format } from 'date-fns';

function Sale({ data }) {
  console.log(data)
  return (

    <>
      <Box sx={{ boxShadow: '4', padding: '20px' }} >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-around', marginBottom: '15px' }}>
          <Box sx={{ p: 2, backgroundColor: '#ECF2FF', boxShadow: '2', border: 'none', display: 'flex', justifyContent: 'space-around', width: '55%', height: '100px' }}>
            <Box sx={{ p: 2, height: '50%', padding: '5px' }}>

              <Box>
                <Typography variant='caption'>Bloqueado</Typography>
                <Typography variant='h5'>R$ 157.000,00</Typography>
              </Box>

            </Box>
            <Box sx={{ p: 2, border: '1px none grey', padding: '5px' }}>

              <Box>
                <Typography variant='caption'>Liberado</Typography>
                <Typography variant='h5'>R$ 7.000.00,00</Typography>
              </Box>

            </Box>
          </Box>
          <Box sx={{ p: 2, backgroundColor: '#FFA07A', boxShadow: '2', border: 'none', width: '35%', paddingLeft: '25px' }}>
            <Box>
              <Typography variant='caption'>Saldo devedor</Typography>
              <Typography variant='h5'>R$ 253.010,00</Typography>
            </Box>
          </Box>
        </Box>

        {data.length > 0 ? <TableContainer sx={{ borderRadius: '8px', boxShadow: '5' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Data Contrato</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status vistoria</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status documentação</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status financeiro</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Unidade</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Especificação de pagamento</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Valor do projeto </TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }/*, backgroundColor: row === item.id && '#ECF2FF' */}}
                >
                  
                  <TableCell align="center">{item.customer.complete_name}</TableCell>
                  <TableCell align="center">{item.signature_date && format(new Date(item.signature_date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell align="center">{item.statvistoria}</TableCell>
                  <TableCell align="center">{item.statusdoc}</TableCell>
                  <TableCell align="center">{item.statusfinanceiro}</TableCell>
                  <TableCell align="center">{item.branch.name}</TableCell>
                  <TableCell align="center">{item.especpagam}</TableCell>
                  <TableCell align="center">{item.total_value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> :
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        }
      </Box>
    </>

  )
}

export default Sale;