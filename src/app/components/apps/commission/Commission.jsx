
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import CommissionForm from './forms/CommissionForm';
import { useState } from 'react';
import { Drawer } from '@mui/material';
import CommissionDetails from './forms/CommissionDetails';

function Commission({ data }) {
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetails] = useState(false);
  const [formData, setFormData] = useState();
  const [isEditing, setIsEditing] = useState(true);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const toggleDrawerDetails = (newOpen) => () => {
    setOpenDetails(newOpen);
  };

  const handleClickRow = (item) => {
    setFormData(item)
    setOpenDetails(true)
  }


  const handleInputChange = (e) => {

    console.log(e)
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  return (

    <>
      <Box sx={{ boxShadow: '4', padding: '20px' }} >
        <Box sx={{ p: 2, border: '1px none grey', height: '50%', padding: '0px', marginBottom: '15px' }}>
          <Box sx={{ p: 2, boxShadow: '4', backgroundColor: '#FFA07A', width: '40%', padding: '20px', display: 'flex', marginBottom: '25px' }}>
            <Typography variant='h6' sx={{ marginRight: 2 }}>Total de comissão: </Typography>
            <Typography >R$ 7.000,00 </Typography>
          </Box>

        </Box>

        <TableContainer sx={{ border: 'none', borderRadius: '8px', boxShadow: '5' }}>
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
                  key={item.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  onClick={() => handleClickRow(item)}
                >



                  <TableCell align="center">{item.nome_cliente}</TableCell>
                  <TableCell align="center">{item.sale.branch?.name}</TableCell>
                  <TableCell align="center">{item.status}</TableCell>
                  <TableCell align="center">{item.status}</TableCell>
                  <TableCell align="center">{item.difference_value}</TableCell>
                  <TableCell align="center">{item.transfer_percentage}</TableCell>
                  <TableCell align="center">{item.status}</TableCell>
                  <TableCell align="center">{item.status}</TableCell>
                  <TableCell align="center">{item.installment_value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="text" sx={{ marginRight: '10px' }}>Editar</Button>
          <Button variant="text" onClick={toggleDrawer(true)}>Adicionar</Button>
        </Box>
      </Box>

      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <CommissionForm />
      </Drawer>
      <Drawer anchor="right" open={openDetail} onClose={toggleDrawerDetails(false)}>
        <CommissionDetails data={formData} onChange={handleInputChange} edit={isEditing} setEdit={setIsEditing}/>
      </Drawer>
    </>


  )
}

export default Commission;