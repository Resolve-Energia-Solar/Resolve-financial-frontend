
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
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Nome cliente</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Unidade</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Especificação de pagamento</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Valor do projeto</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Diferença</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Percentual de repasse franquia</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Valor final</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status de pagamento</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ajustes</TableCell>
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
                  <TableCell align="center">{item.sale.customer.complete_name}</TableCell>
                  <TableCell align="center">{item.sale.branch?.name}</TableCell>
                  <TableCell align="center">{item.status}</TableCell>
                  <TableCell align="center">{''}</TableCell>
                  <TableCell align="center">{item.difference_value}</TableCell>
                  <TableCell align="center">{numeral(item.sale.transfer_percentage / 100).format('0,0%')}</TableCell>
                  <TableCell align="center">{item.sale.total_value}</TableCell>
                  <TableCell align="center"><Chip> label={item.payment_status
                    ? 'Pago' : 'Pendente'} sx={{
                      backgroundColor: item.payment_status
                        ? 'success.main' : 'warning.main'
                    }}</Chip></TableCell>
                  <TableCell align="center">{''}</TableCell>
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