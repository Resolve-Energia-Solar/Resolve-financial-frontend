import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { Chip, CircularProgress, Typography } from '@mui/material';
import { format } from 'date-fns';
import usePaymentCommission from '@/hooks/commission/usePaymentCommission';
import { useTheme } from '@mui/material/styles';
import { getStatusChip } from '@/utils/status';
import DocumentStatusIcon from '../../../../utils/status/DocumentStatusIcon';
import FinancialChip from '../../../../utils/status/FinancialChip';
import InspecStatusChip from '../../../../utils/status/InspecStatusChip'
import { formatToBRL } from '@/utils/currency';
import maxValueArray from '@/utils/maxValueArray';



function Sale({ data }) {
  console.log(data)
  const {
    handleClickRow,
    toggleDrawer,
    open,
    row
  } = usePaymentCommission()

  const theme = useTheme();

  const paymentType = (type) => {

    switch (type) {
      case 'B':
        return 'Boleto'
      case 'F':
        return 'Financiamento'
      case 'C':
        return 'Cartão de Crédito'
      case 'D':
        return 'Cartão de Débito'
      case 'PI':
        return 'Parcelamento'
      case 'P':
        return 'PIX'
      default:
        return 'Outro'
    }

  }

  return (

    <>
      <Box sx={{ padding: '22px', border: '1px solid #E0E0E0', borderRadius: '8px' }} >

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
                <TableCell align="left">Nome</TableCell>
                <TableCell align="left">Data Contrato</TableCell>

                <TableCell align="left">Status vistoria</TableCell>
                <TableCell align="left">Status documentação</TableCell>
                <TableCell align="left">Status financeiro</TableCell>
                <TableCell align="left">Unidade</TableCell>
                <TableCell align="left">Especificação de pagamento</TableCell>
                <TableCell align="left">Valor de Venda </TableCell>

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
                  <TableCell align="left">{item.customer.complete_name}</TableCell>
                  <TableCell align="left">{item.contract_date && format(new Date(item.contract_date), 'dd/MM/yyyy')}</TableCell>

                  <TableCell align="left">
                    {item.projects.map((item) => <InspecStatusChip key={item.id} status={item.projects?.inspection.status ? item.projects?.inspection.status : 'NV'} />)}
                  </TableCell>
                  <TableCell align="left">
                    {item.projects.map((item) => <DocumentStatusIcon key={item.id} status={item.is_documentation_completed} />)}
                  </TableCell>
                  <TableCell align="left">
                    <FinancialChip status={item.payment_status} />
                  </TableCell>

                  <TableCell align="left">{item.branch.name}</TableCell>
                  <TableCell align="left">{paymentType(maxValueArray(item.payments).payment_type)}</TableCell>
                  <TableCell align="left">{formatToBRL(item.total_value)}</TableCell>
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