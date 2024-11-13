'use client';
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
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import EditChecklistPage from '../Edit-checklist';

const CheckListRateio = ({ units = [] }) => {
  console.log('units: ', units);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  
  const handleEdit = (unitId) => {
    setSelectedUnitId(unitId);
    setEditModalOpen(true);
  }

  return (
    <Box>
      <Paper variant="outlined">
        <TableContainer sx={{ whiteSpace: { xs: 'nowrap', md: 'unset' } }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <Typography variant="h6" fontSize="14px">
                    Nome
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6" fontSize="14px">
                    Adequação de Fornecimento
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6" fontSize="14px">
                    Geradora
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6" fontSize="14px">
                    Tipo de Fornecimento
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6" fontSize="14px">
                    Ações
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {units.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Button variant="contained" color="primary">
                      Adicionar uma nova parcela
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                units.map((unit, index) => (
                  <TableRow key={unit.id}>
                    <TableCell align="center">
                      <Typography variant="body2">{unit?.name}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      {unit.supply_adquance?.map((item) => (
                        <Typography key={item.id} variant="body2">
                          {item?.name}
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {unit?.main_unit ? 'Geradora' : 'Beneficiária'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">{unit?.type}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Item">
                        <IconButton color="primary" onClick={() => handleEdit(unit.id)}>
                          <Edit width={22} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Item">
                        <IconButton color="error">
                          <IconTrash width={22} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Button variant="contained" color="primary">
                    Adicionar Unidade
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal de Edição */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Editar Unidade</DialogTitle>
        <DialogContent>
          <EditChecklistPage onClosedModal={() => setEditModalOpen(false)} unitId={selectedUnitId} />
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} color="primary">
            Cancelar
          </Button>
        </DialogActions> */}
      </Dialog>

    </Box>
  );
};

export default CheckListRateio;
