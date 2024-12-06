'use client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import DataDebtor from './debtor.json';
import Button from '@mui/material/Button';


function Debtor({ data }) {


    return (

        <>
            <Box sx={{ p: 2, border: '1px none grey', height: '50%', padding: '5px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>

                <Box sx={{ p: 2, border: '1px none grey', width: '40%', height: '50%', }} >

                    <Box sx={{ p: 2, border: '1px solid grey', height: '50%', padding: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px' }}>
                        <Typography> Franquia</Typography>
                        <Typography variant='h6'>Umarizal</Typography>
                    </Box>

                    <Box sx={{ p: 2, border: '1px solid grey', height: '50%', padding: '10px', display: 'flex',  alignItems: 'center', marginBottom: '15px' }}>
                        <Typography variant='h6' sx={{ marginRight: 2 }}>Saldo: </Typography>
                        <Typography >-R$ 27.752,22</Typography>
                    </Box>

                    <Box sx={{ p: 2, border: '1px solid grey', height: '50%', padding: '10px', display: 'flex', alignItems: 'center' }}>
                        <Typography variant='h6' sx={{ marginRight: 2 }}>Total: </Typography>
                        <Typography>R$1.000.000,58</Typography>
                    </Box>
                </Box>

                <Box sx={{ p: 2, border: '1px solid grey', width: '30%', height: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography >Saldo</Typography>
                    <Button variant="text" sx={{ width: '100%' }}>Adicionar</Button>
                </Box>
            </Box>

            <TableContainer sx={{ border: '1px solid grey', borderRadius: '8px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Unidade</TableCell>
                            <TableCell align="right">Valor</TableCell>
                            <TableCell align="right">Categoria</TableCell>
                            <TableCell align="right">Data de lançamento</TableCell>
                            <TableCell align="right">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {DataDebtor.map((row) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="right">{row.unidade}</TableCell>
                                <TableCell align="right">{row.valor}</TableCell>
                                <TableCell align="right">{row.categoria}</TableCell>
                                <TableCell align="right">{row.data_lancamento}</TableCell>
                                <TableCell align="right">{row.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>

    )
}

export default Debtor;