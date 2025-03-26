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
import { useEffect, useState } from 'react';
import EditChecklistPage from '../Edit-checklist';
import CreateChecklistPage from '../Add-checklist';
import unitService from '@/services/unitService';
import SupplyChip from '../components/SupplyChip';

const CheckListRateio = ({ projectId = null }) => {

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState(null);

  const [AddModalOpen, setAddModalOpen] = useState(false);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState(null);

  const [reload, setReload] = useState(false);

  const reloadPage = () => {
    setReload(!reload);
  };

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        if (!projectId) return;
        const response = await unitService.index({
          project: projectId,
          fields: 'id,name,type,main_unit,supply_adquance.name,supply_adquance.id',
          expand: 'supply_adquance',
        });
        setUnits(response.results);
      } catch (error) {
        console.log('Error: ', error);
      }
    };
    fetchUnits();
  }, [projectId, reload]);

  const [units, setUnits] = useState([]);

  const handleEdit = (unitId) => {
    setSelectedUnitId(unitId);
    setEditModalOpen(true);
  };

  const handleAdd = () => {
    setAddModalOpen(true);
  };

  const handleDelete = async (unitId) => {
    try {
      await unitService.deleteUnit(unitId);
      setUnits((prevUnits) => prevUnits.filter((unit) => unit.id !== unitId));
      setConfirmDeleteModalOpen(false);
    } catch (error) {
      console.error('Erro ao excluir a unidade', error);
    }
  };

  const openDeleteModal = (unitId) => {
    setUnitToDelete(unitId);
    setConfirmDeleteModalOpen(true);
  };

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
                    <Typography variant="body2">Nenhuma unidade disponível</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                units.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell align="center">
                      <Typography variant="body2">{unit?.name || 'Não cadastrado'}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      {unit.supply_adquance?.map((item) => (
                        <Typography key={item.id} variant="body2">
                          {item?.name}
                        </Typography>
                      ))}
                      { unit.supply_adquance?.length === 0 && <Typography variant="body2">Nenhuma</Typography>}
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {unit?.main_unit ? 'Geradora' : 'Beneficiária'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2"><SupplyChip status={unit?.type} /></Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Item">
                        <IconButton color="primary" onClick={() => handleEdit(unit.id)}>
                          <Edit width={22} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Item">
                        <IconButton color="error" onClick={() => openDeleteModal(unit.id)}>
                          <IconTrash width={22} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Button variant="contained" color="primary" onClick={() => handleAdd()}>
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
          <EditChecklistPage
            onClosedModal={() => setEditModalOpen(false)}
            unitId={selectedUnitId}
            onRefresh={reloadPage}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Adicionar */}
      <Dialog open={AddModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Adicionar Unidade</DialogTitle>
        <DialogContent>
          <CreateChecklistPage
            onClosedModal={() => setAddModalOpen(false)}
            projectId={projectId}
            onRefresh={reloadPage}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={confirmDeleteModalOpen} onClose={() => setConfirmDeleteModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Tem certeza que deseja excluir esta unidade? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteModalOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => handleDelete(unitToDelete)} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CheckListRateio;
