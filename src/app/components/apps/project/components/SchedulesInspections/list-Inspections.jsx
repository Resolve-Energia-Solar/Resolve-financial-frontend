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
import { Edit, KeyboardArrowRight } from '@mui/icons-material';
import { IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import scheduleService from '@/services/scheduleService';
import SupplyChip from '../../../checklist/components/SupplyChip';
import ScheduleFormCreate from '../../../inspections/schedule/Add-schedule';
import ScheduleFormEdit from '../../../inspections/schedule/Edit-schedule';

const SERVICE_INSPECTION_ID = process.env.NEXT_PUBLIC_SERVICE_INSPECTION_ID;

const ListInspection = ({ projectId = null, product = [], customerId = null }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [AddModalOpen, setAddModalOpen] = useState(false);
  const [openModelInspectionNotAssociated, setOpenModelInspectionNotAssociated] = useState(false);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [confirmAssociateModalOpen, setConfirmAssociateModalOpen] = useState(false);

  const [inspectionSelected, setInspectionSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const [inspectionsNotAssociated, setInspectionsNotAssociated] = useState([]);

  const [reload, setReload] = useState(false);

  const reloadPage = () => {
    setReload(!reload);
  };

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await scheduleService.getAllSchedulesInspectionByProject(projectId);
        console.log('response', response.results);
        setLoading(false);
        setUnits(response.results);
      } catch (error) {
        console.log('Error: ', error);
      }
    };
    fetchUnits();
  }, [projectId, reload]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await scheduleService.getAllSchedulesInspectionByCustomer(customerId);
        const filteredResults = response.results.filter((item) => item.project?.sale_id === null);
        setInspectionsNotAssociated(filteredResults);
        console.log('--->', filteredResults);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      }
    };

    if (customerId) {
      fetch();
    }
  }, [customerId, reload]);

  const [units, setUnits] = useState([]);
  console.log('product', product);

  const handleEdit = (unitId) => {
    setSelectedUnitId(unitId);
    setEditModalOpen(true);
  };

  const handleAdd = () => {
    setAddModalOpen(true);
  };

  const handleDelete = async (unitId) => {
    try {
      await scheduleService.deleteSchedule(unitId);
      setUnits((prevUnits) => prevUnits.filter((unit) => unit.id !== unitId));
      setConfirmDeleteModalOpen(false);
    } catch (error) {
      console.error('Erro ao excluir a unidade', error);
    }
  };

  const AssociateProject = async (inspectionId) => {
    try {
      await scheduleService.patchSchedule(inspectionId, { project_id: projectId });
      reloadPage();
      setConfirmAssociateModalOpen(false);
      setOpenModelInspectionNotAssociated(false);
    } catch (error) {
      console.error('Erro ao associar a unidade', error);
    }
  };

  const openDeleteModal = (unitId) => {
    setInspectionSelected(unitId);
    setConfirmDeleteModalOpen(true);
  };

  const openAssociateModal = (unitId) => {
    setInspectionSelected(unitId);
    setConfirmAssociateModalOpen(true);
  };

  if (loading) {
    return <Typography variant="body2">Carregando...</Typography>;
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
                    Data da Vistoria
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6" fontSize="14px">
                    Horário de Início
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6" fontSize="14px">
                    Horário de Término
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6" fontSize="14px">
                    Status do Agendamento
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
                    <Typography variant="body2">Nenhuma vistoria agendada</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                units.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell align="center">
                      <Typography variant="body2">{unit?.schedule_date}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">{unit?.schedule_start_time}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">{unit?.schedule_end_time}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        <SupplyChip status={unit?.status} />
                      </Typography>
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
                    Agendar Vistoria
                  </Button>
                  <Typography
                    variant="body2"
                    color="primary"
                    component="a"
                    display="block"
                    mt={1}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setOpenModelInspectionNotAssociated(true)}
                  >
                    Adicionar uma vistoria já existente
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal de Edição */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Editar vistoria</DialogTitle>
        <DialogContent>
          <ScheduleFormEdit
            onClosedModal={() => setEditModalOpen(false)}
            scheduleId={selectedUnitId}
            onRefresh={reloadPage}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Adicionar */}
      <Dialog open={AddModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Agendar uma Vistoria</DialogTitle>
        <DialogContent>
          <ScheduleFormCreate
            CreateSale={() => setAddModalOpen(false)}
            serviceId={SERVICE_INSPECTION_ID}
            projectId={projectId}
            products={[product]}
            customerId={customerId}
            onClosedModal={() => setAddModalOpen(false)}
            onRefresh={reloadPage}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openModelInspectionNotAssociated} onClose={() => setOpenModelInspectionNotAssociated(false)} maxWidth="md" fullWidth>
        <DialogTitle>Adicionar uma vistoria já existente</DialogTitle>
        <DialogContent>
          <TableContainer sx={{ whiteSpace: { xs: 'nowrap', md: 'unset' } }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Typography variant="h6" fontSize="14px">
                      Data da Vistoria
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6" fontSize="14px">
                      Horário de Início
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6" fontSize="14px">
                      Horário de Término
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6" fontSize="14px">
                      Status
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
                {inspectionsNotAssociated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2">Nenhuma vistoria encontrada para este cliente</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  inspectionsNotAssociated.map((unit) => (
                    <TableRow key={unit.id}>
                      <TableCell align="center">
                        <Typography variant="body2">{unit?.schedule_date}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">{unit?.schedule_start_time}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">{unit?.schedule_end_time}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2">
                          <SupplyChip status={unit?.status} />
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Editar Item">
                          <IconButton color="primary" onClick={() => handleEdit(unit.id)}>
                            <Edit width={22} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Associar Item">
                          <IconButton color="success" onClick={() => openAssociateModal(unit.id)}>
                            <KeyboardArrowRight width={22} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmDeleteModalOpen}
        onClose={() => setConfirmDeleteModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
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
          <Button onClick={() => handleDelete(inspectionSelected)} color="error">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmAssociateModalOpen}
        onClose={() => setConfirmAssociateModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirmar Associação</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Tem certeza que deseja associar esta vistoria ao projeto? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmAssociateModalOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => AssociateProject(inspectionSelected)} color="warning">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListInspection;
