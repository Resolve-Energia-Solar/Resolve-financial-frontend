'use client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ReleasesForm from './forms/ReleasesForm';
import { Chip, CircularProgress, Typography } from '@mui/material';
import { Drawer } from '@mui/material';
import PaymentCommission from '@/hooks/commission/PaymentCommission';
import { useTheme } from '@mui/material/styles';
import theme from '@/utils/theme';
function Releases({ data }) {
console.log(data)

  const {
    handleClickRow,
    toggleDrawer,
    open,
    row
  } = PaymentCommission()


  return (

    <>
      <Box sx={{ boxShadow: '4', padding: '20px' }} >

        <Box sx={{ p: 2, height: '50%', padding: '0px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>

          <Box sx={{ p: 2, width: '40%', height: '50%', padding: '0px'}} >

            <Box sx={{ p: 2, backgroundColor: 'secondary.main', height: '50%', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px'}}>

              <Typography color='#FFFFFF'> Franquia</Typography>
              <Typography color='#FFFFFF' variant='h6'>Umarizal</Typography>

            </Box>

            <Box sx={{ p: 2, height: '50%', padding: '10px', display: 'flex', alignItems: 'center', marginBottom: '15px', backgroundColor: 'secondary.main' }}>

              <Typography variant='h6' sx={{ marginRight: 2, color: '#FFFFFF'}}>Majoração: </Typography>
              <Typography color='#FFFFFF' >R$ 27.752,22</Typography>

            </Box>


            <Box sx={{ p: 2, height: '50%', padding: '10px', display: 'flex', alignItems: 'center', backgroundColor: 'secondary.main' }}>

              <Typography variant='h6' sx={{ marginRight: 2, color: '#FFFFFF'}}>Total: </Typography>
              <Typography  color='#FFFFFF'>R$1.000.000,58</Typography>

            </Box>
          </Box>

          <Box sx={{ p: 2, width: '30%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'secondary.main', marginTop: '15px' }}>

            <Typography variant='h6' sx={{ marginBottom: '8px', color:'#FFFFFF' }}>Nova comissão</Typography>

            <Button variant="text" onClick={toggleDrawer(true)} sx={{ width: '100%', border: '1px solid transparent', boxShadow: '2', backgroundColor: 'primary.contrastText' }}>Adicionar</Button>

          </Box>
        </Box>

        <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
          <ReleasesForm />
        </Drawer>

        {data.length > 0 ? <TableContainer sx={{ borderRadius: '8px', boxShadow: '5' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Unidade</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Valor projeto</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>N° de parcelas</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Percentual de pagamentos</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Data de pagamento</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Reajuste</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow
                  key={item.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: row === item.id && 'primary.light' }}
                  onClick={() => handleClickRow(item)}
                >
                  <TableCell align="center"> <Chip>label={item.status ? 'Liberado' : 'Bloqueado'} sx={{ backgroundColor: item.status ? 'success.main' : 'warning.main' }}</Chip> </TableCell>
                  <TableCell align="center">{item.sale.branch.name}</TableCell>
                  <TableCell align="center">{item.total_value}</TableCell>
                  <TableCell align="center">{item.installments_value}</TableCell>
                  <TableCell align="center">{item.percentage}</TableCell>
                  <TableCell align="center">{item.signature_date && format(new Date(item.signature_date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell align="center">{item.reajuste}</TableCell>
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

export default Releases;