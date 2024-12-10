'use client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import ReleasesForm from './forms/ReleasesForm';
import { Drawer } from '@mui/material';
import PaymentCommission from '@/hooks/commission/PaymentCommission';

function Releases({ data }) {

  const {
    toggleDrawer,
    open
  } = PaymentCommission()


  return (

    <>
      <Box sx={{ boxShadow: '4', padding: '20px' }} >
        <Box sx={{ p: 2, height: '50%', padding: '5px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>

          <Box sx={{ p: 2, border: '1px none grey', width: '40%', height: '50%', }} >

            <Box sx={{ p: 2, backgroundColor: '#ECF2FF', height: '50%', padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px' }}>
              <Typography> Franquia</Typography>
              <Typography variant='h6'>Umarizal</Typography>
            </Box>

            <Box sx={{ p: 2, height: '50%', padding: '10px', display: 'flex', alignItems: 'center', marginBottom: '15px', backgroundColor: '#ECF2FF	' }}>
              <Typography variant='h6' sx={{ marginRight: 2 }}>Majoração: </Typography>
              <Typography >R$ 27.752,22</Typography>
            </Box>

            <Box sx={{ p: 2, height: '50%', padding: '10px', display: 'flex', alignItems: 'center', backgroundColor: '#FFA07A' }}>
              <Typography variant='h6' sx={{ marginRight: 2 }}>Total: </Typography>
              <Typography>R$1.000.000,58</Typography>
            </Box>
          </Box>

          <Box sx={{ p: 2, width: '30%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#ECF2FF', marginTop: '15px' }}>
            <Typography variant='h6' sx={{ marginBottom: '8px' }}>Nova comissão</Typography>
            <Button variant="text" onClick={toggleDrawer(true)} sx={{ width: '100%', border: '1px solid transparent', boxShadow: '2', backgroundColor: 'white' }}>Adicionar</Button>
          </Box>
        </Box>

        <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
          <ReleasesForm />
        </Drawer>

        <TableContainer sx={{ borderRadius: '8px', boxShadow: '5' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Unidade</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Valor projeto</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Categoria</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>N° de parcelas</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Percentual de pagamentos</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Data de pagamento</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Reajuste</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                // onClick={() => handleClickRow(item)}
                >
                  <TableCell align="center">{row.status}</TableCell>
                  <TableCell align="center">{row.unidade}</TableCell>
                  <TableCell align="center">{row.valor_projeto}</TableCell>
                  <TableCell align="center">{row.categoria}</TableCell>
                  <TableCell align="center">{row.n_parcelas}</TableCell>
                  <TableCell align="center">{row.percentual_pagamento}</TableCell>
                  <TableCell align="center">{row.signature_date && format(new Date(item.signature_date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell align="center">{row.reajuste}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>


    </>

  )
}

export default Releases;