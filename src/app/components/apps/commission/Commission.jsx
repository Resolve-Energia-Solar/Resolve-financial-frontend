
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CommissionForm from './forms/CommissionForm';
import { Drawer } from '@mui/material';
import { Chip, CircularProgress, Typography } from '@mui/material';
import CommissionDetails from './forms/CommissionDetails';
import PaymentCommission from '@/hooks/commission/PaymentCommission';
import numeral from 'numeral';
import theme from '@/utils/theme';
import PaymentStatusChip from '@/utils/status/PaymentStatusChip';
import { formatToBRL } from '@/utils/currency';

function Commission({ data }) { 
  console.log(data)

  const {
    toggleDrawer,
    toggleDrawerDetails,
    handleInputChange,
    handleClickRow,
    open,
    openDetail,
    formData,
    isEditing,
    setIsEditing,
    row
  } = PaymentCommission()


  return (

    <>
      <Box sx={{ padding: '22px',border: '1px solid #E0E0E0', borderRadius: '8px'}} >
        <Box sx={{ p: 2, height: '50%', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', padding: '0px' }}>

          <Box sx={{ p: 2, boxShadow: '4', backgroundColor: 'secondary.main', width: '40%', padding: '20px', display: 'flex', marginBottom: '25px' }}>

            <Typography variant='h6' sx={{ marginRight: 2, color: 'primary.contrastText' }}>Total de comissão: </Typography>
            <Typography color='primary.contrastText'>R$ 7.000,00 </Typography>

          </Box>

          <Box sx={{ marginBottom: '25px', display: 'flex', justifyContent: 'flex-end' }}>

            <Button variant="text" sx={{ backgroundColor: 'secondary.main', color: 'primary.contrastText' }} onClick={toggleDrawer(true)}>Adicionar nova Comissão</Button>
          </Box>


        </Box>

        {data.length > 0 ? <TableContainer sx={{ border: 'none', borderRadius: '8px', boxShadow: '10' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Nome cliente</TableCell>
                <TableCell align="left">Unidade</TableCell>
                <TableCell align="left">Especificação de pagamento</TableCell>
                <TableCell align="left">Valor do projeto</TableCell>
                <TableCell align="left">Diferença</TableCell>
                <TableCell align="left">Percentual de repasse franquia</TableCell>
                <TableCell align="left">Valor final</TableCell>
                <TableCell align="left">Status de pagamento</TableCell>
                <TableCell align="left">Ajustes</TableCell>
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
                  <TableCell align="left">{item.sale.customer.complete_name}</TableCell>
                  <TableCell align="left">{item.sale.branch?.name}</TableCell>
                  <TableCell align="left">{''}</TableCell>
                  <TableCell align="left">{formatToBRL('')}</TableCell>
                  <TableCell align="left">{formatToBRL(item.difference_value)}</TableCell>
                  <TableCell align="left">{numeral(item.transfer_percentage / 100).format('0,0%')}</TableCell>
                  <TableCell align="left">{formatToBRL(item.sale.total_value)}</TableCell>
                  <TableCell align="left">
                  <PaymentStatusChip status={item.sale.payment_status} />
                   </TableCell>
                  <TableCell align="left">{''}</TableCell>
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

      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <CommissionForm />
      </Drawer>

      <Drawer anchor="right" open={openDetail} onClose={toggleDrawerDetails(false)}>
        <CommissionDetails data={formData} onChange={handleInputChange} edit={isEditing} setEdit={setIsEditing} />
      </Drawer>
    </>


  )
}

export default Commission;