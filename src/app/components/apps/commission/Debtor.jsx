'use client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Drawer } from '@mui/material';
import DebtorForm from './forms/DebtorForm';
import { Chip, CircularProgress, Typography } from '@mui/material';
import PaymentCommission from '@/hooks/commission/PaymentCommission';
import theme from '@/utils/theme';
import PaymentStatusChip from '@/utils/status/PaymentStatusChip';
function Debtor({ data }) {

    console.log(data);

    const {
        handleClickRow,
        toggleDrawer,
        open,
        row
    } = PaymentCommission()


    return (

        <>
            <Box sx={{  margin: '0px'}} >

                <Box sx={{ p: 2, height: '50%', padding: '0px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>

                    <Box sx={{ p: 2, width: '40%', height: '50%', padding: '0px' }} >

                        <Box sx={{ p: 2, backgroundColor: theme.palette.secondary.main, height: '50%', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px' }}>

                            <Typography color='#FFFFFF'> Franquia</Typography>
                            <Typography variant='h6' color='#FFFFFF'>Umarizal</Typography>

                        </Box>

                        <Box sx={{ p: 2, height: '50%', padding: '10px', display: 'flex', alignItems: 'center', marginBottom: '15px', backgroundColor: theme.palette.secondary.main }}>

                            <Typography variant='h6' sx={{ marginRight: 2, color: '#FFFFFF' }}>Saldo: </Typography>
                            <Typography color='#FFFFFF'>-R$ 27.752,22</Typography>

                        </Box>

                        <Box sx={{ p: 2, height: '50%', padding: '10px', display: 'flex', alignItems: 'center', backgroundColor: theme.palette.secondary.main }}>

                            <Typography variant='h6' sx={{ marginRight: 2, color: '#FFFFFF' }}>Total: </Typography>
                            <Typography color='#FFFFFF'>R$1.000.000,58</Typography>

                        </Box>
                    </Box>

                    <Box sx={{ p: 2, width: '30%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'secondary.main', marginTop: '15px' }}>

                        <Typography variant='h6' sx={{ marginBottom: '8px', color: '#FFFFFF' }}>Saldo</Typography>

                        <Button variant="text" onClick={toggleDrawer(true)} sx={{ width: '100%', boxShadow: '2', backgroundColor: 'primary.contrastText' }}>Adicionar</Button>

                    </Box>
                </Box>

                <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                    <DebtorForm />
                </Drawer>

                {data.length > 0 ? <TableContainer sx={{ borderRadius: '8px', boxShadow: '5' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Unidade</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Valor</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Categoria</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Data de lançamento</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
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
                                    <TableCell align="center">{item.unidade}</TableCell>
                                    <TableCell align="center">{item.valprojeto}</TableCell>
                                    <TableCell align="center">{item.categoria}</TableCell>
                                    <TableCell align="center">{item.signature_date && format(new Date(item.signature_date), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell align="center">
                                        <PaymentStatusChip status={item.payment_status} />
                                    </TableCell>
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

export default Debtor;