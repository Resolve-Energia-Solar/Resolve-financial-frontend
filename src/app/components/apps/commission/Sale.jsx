import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { Chip, CircularProgress, Typography } from '@mui/material';
import { format } from 'date-fns';
import PaymentCommission from '@/hooks/commission/PaymentCommission';
import { useTheme } from '@mui/material/styles';
import { getStatusChip } from '@/utils/status';
import DocumentStatusIcon from '../../../../utils/status/DocumentStatusIcon';
import FinancialChip from '../../../../utils/status/FinancialChip';
import InspecStatusChip from '../../../../utils/status/InspecStatusChip'



function Sale({ data }) {
  console.log(data)
  const {
    handleClickRow,
    toggleDrawer,
    open,
    row
  } = PaymentCommission()

  const theme = useTheme();


  return (

    <>
      <Box sx={{ padding: '22px',border: '1px solid #E0E0E0', borderRadius: '8px' }} >

        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', marginBottom: '15px', padding: '0px' }}> 
          <Box sx={{ width: '30%', p: 2, backgroundColor: 'secondary.main', boxShadow: '2', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}> 
            <Typography variant='caption' color='#FFFFFF'>Bloqueado</Typography> 
            <Typography variant='h5' color='#FFFFFF'>R$ 157.000,00</Typography> 
          </Box>

          <Box sx={{ width: '30%', p: 2, backgroundColor: 'secondary.main', boxShadow: '2', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}> 
            <Typography variant='caption' color='#FFFFFF'>Liberado</Typography> 
            <Typography variant='h5' color='#FFFFFF'>R$ 7.000.00,00</Typography> 
          </Box>

          <Box sx={{ width: '30%', p: 2, backgroundColor: 'secondary.main', boxShadow: '2', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}> 
            <Typography variant='caption' color='#FFFFFF'>Saldo devedor</Typography> 
            <Typography variant='h5' color='#FFFFFF'>R$ 253.010,00</Typography> 
            </Box> 
        </Box>

          {data.length > 0 ? <TableContainer sx={{ borderRadius: '8px', boxShadow: '10' }}>
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
                    hover
                    key={item.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: row === item.id && 'primary.light' }}
                    onClick={() => handleClickRow(item)}
                  >
                    <TableCell align="center">{item.customer.complete_name}</TableCell>
                    <TableCell align="center">{item.signature_date && format(new Date(item.signature_date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell align="center">
                      {item.projects.map((item) => <InspecStatusChip key={item.id} status={item.projects?.inspection.status} />)}
                    </TableCell>
                    <TableCell align="center">
                      {item.projects.map((item) => <DocumentStatusIcon key={item.id} status={item.is_documentation_completed} />)}
                    </TableCell>
                    <TableCell align="center">
                      <FinancialChip status={item.payment_status} />
                    </TableCell>

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