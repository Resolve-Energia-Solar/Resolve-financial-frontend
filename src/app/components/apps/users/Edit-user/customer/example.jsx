'use client';
import React, { useState } from 'react';
import {
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  Grid,
  Stack,
  FormControlLabel,
  TextField,
} from '@mui/material';
import CustomSwitch from '@/app/components/forms/theme-elements/CustomSwitch';
import { IconSquareRoundedPlus, IconTrash } from '@tabler/icons-react';

const CreatePhone = () => {
  const [phones, setPhones] = useState([]);

  const handleAddPhone = () => {
    setPhones((prev) => [...prev, { phone: '', is_main: false, country_code: '' }]);
  };

  const handleDeletePhone = (index) => {
    setPhones((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index, key, value) => {
    setPhones((prev) =>
      prev.map((phone, i) => (i === index ? { ...phone, [key]: value } : phone))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(phones);
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ width: '100%', overflowX: 'auto' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6" fontSize="14px">
                      Código do País
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" fontSize="14px">
                      Telefone
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" fontSize="14px">
                      Principal
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" fontSize="14px">
                      Ações
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {phones.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                      <Button variant="contained" color="primary" onClick={handleAddPhone}>
                        Adicionar um novo telefone
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  phones.map((phone, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          value={phone.country_code}
                          onChange={(e) => handleChange(index, 'country_code', e.target.value)}
                          fullWidth
                          label="Código do País"
                          placeholder="Ex: +55"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={phone.phone}
                          onChange={(e) => handleChange(index, 'phone', e.target.value)}
                          fullWidth
                          label="Telefone"
                          placeholder="Ex: 99999-9999"
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          control={
                            <CustomSwitch
                              checked={phone.is_main}
                              onChange={(e) => handleChange(index, 'is_main', e.target.checked)}
                            />
                          }
                          label={phone.is_main ? 'Sim' : 'Não'}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Add Item">
                          <IconButton onClick={handleAddPhone} color="primary">
                            <IconSquareRoundedPlus width={22} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Item">
                          <IconButton color="error" onClick={() => handleDeletePhone(index)}>
                            <IconTrash width={22} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
          <Button variant="contained" onClick={handleSubmit}>
            Salvar
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CreatePhone;
