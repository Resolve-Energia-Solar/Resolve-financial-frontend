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
  Chip,
  Grid,
  Switch,
} from '@mui/material';
import { ArrowBack, Edit, KeyboardArrowRight } from '@mui/icons-material';
import { IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import scheduleService from '@/services/scheduleService';
import SupplyChip from '../../../checklist/components/SupplyChip';
import ScheduleFormCreate from '../../../inspections/schedule/Add-schedule';
import ScheduleFormEdit from '../../../inspections/schedule/Edit-schedule';
import AutoCompleteUser from '../../../comercial/sale/components/auto-complete/Auto-Input-User';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import TableSkeleton from '../../../comercial/sale/components/TableSkeleton';
import projectService from '@/services/projectService';

const SERVICE_INSPECTION_ID = process.env.NEXT_PUBLIC_SERVICE_INSPECTION_ID;

const ListInspection = ({ projectId = null, product = [], customerId }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedscheduleId, setSelectedscheduleId] = useState(null);
  const [AddModalOpen, setAddModalOpen] = useState(false);
  const [openModelInspectionNotAssociated, setOpenModelInspectionNotAssociated] = useState(false);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [confirmAssociateModalOpen, setConfirmAssociateModalOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [loadingInspections, setLoadingInspections] = useState(true);
  const [inspectionSelected, setInspectionSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inspectionsNotAssociated, setInspectionsNotAssociated] = useState([]);
  const [reload, setReload] = useState(false);
  const [schedules, setschedules] = useState([]);

  const reloadPage = () => {
    setReload(!reload);
  };

  useEffect(() => {
    setCustomer(customerId);
  }, [customerId]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const fields =
          'id,schedule_date,schedule_start_time,schedule_end_time,status,final_service_opinion.name';
        const response = await scheduleService.index({
          project: projectId,
          fields: 'id,schedule_date,schedule_start_time,schedule_end_time,status',
        });

        // Obter os detalhes do projeto para verificar a vistoria principal
        const projectResponse = await projectService.find(projectId, {
          fields: 'inspection',
        });

        const inspectionIdPrincipal = projectResponse.inspection || null;

        const updatedschedules = response.results.map((schedule) => ({
          ...schedule,
          isChecked: schedule.id === inspectionIdPrincipal,
        }));

        setschedules(updatedschedules);
      } catch (error) {
        console.error('Erro ao buscar unidades: ', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchSchedules();
    }
  }, [projectId, reload]);

  useEffect(() => {
    const fetch = async () => {
      setLoadingInspections(true);
      try {
        const response = await scheduleService.index({
          customer: customer,
          fields: 'id,schedule_date,schedule_start_time,schedule_end_time,status',
          expand: 'final_service_opinion',
        });
        // Se necessário, você pode filtrar os resultados aqui
        setInspectionsNotAssociated(response);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      } finally {
        setLoadingInspections(false);
      }
    };

    if (customer) {
      fetch();
    }
  }, [customer, reload]);

  const handleSwitchChange = async (checked, scheduleId) => {
    const previousschedules = [...schedules];
    const updatedschedules = schedules.map((schedule) =>
      schedule.id === scheduleId
        ? { ...schedule, isChecked: checked }
        : { ...schedule, isChecked: false },
    );
    setschedules(updatedschedules);

    try {
      if (checked) {
        await projectService.Update(projectId, { inspection: scheduleId });
      } else {
        await projectService.Update(projectId, { inspection: null });
      }
    } catch (error) {
      setschedules(previousschedules);
    }
  };

  const handleEdit = (scheduleId) => {
    setSelectedscheduleId(scheduleId);
    setEditModalOpen(true);
  };

  const handleAdd = () => {
    setAddModalOpen(true);
  };

  const handleDelete = async (scheduleId) => {
    try {
      await scheduleService.update(scheduleId, { project: null });

      const scheduleRemoved = schedules.find((schedule) => schedule.id === scheduleId);
      if (scheduleRemoved && scheduleRemoved.isChecked) {
        await projectService.Update(projectId, { inspection: null });
      }

      reloadPage();
      setConfirmDeleteModalOpen(false);
    } catch (error) {
      console.error('Erro ao excluir a unidade', error);
    }
  };

  const AssociateProject = async (inspectionId) => {
    try {
      await scheduleService.update(inspectionId, { project: projectId });
      reloadPage();
      setConfirmAssociateModalOpen(false);
      setOpenModelInspectionNotAssociated(false);
    } catch (error) {
      console.error('Erro ao associar a unidade', error);
    }
  };

  const openDeleteModal = (scheduleId) => {
    setInspectionSelected(scheduleId);
    setConfirmDeleteModalOpen(true);
  };

  const openAssociateModal = (scheduleId) => {
    setInspectionSelected(scheduleId);
    setConfirmAssociateModalOpen(true);
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
                    Status do Agendamento
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6" fontSize="14px">
                    Parecer Final
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6" fontSize="14px">
                    Principal
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
              {loading ? (
                <TableSkeleton rows={1} columns={6} />
              ) : schedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2">Nenhuma vistoria agendada</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell align="center">
                      <Typography variant="body2">{schedule?.schedule_date}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">{schedule?.schedule_start_time}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        <SupplyChip status={schedule?.status} />
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {schedule?.final_service_opinion?.name ? (
                          <Chip label={schedule?.final_service_opinion?.name} />
                        ) : (
                          <Chip label="Em Análise" color="info" />
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={schedule?.isChecked || false}
                        onChange={(e) => handleSwitchChange(e.target.checked, schedule.id)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Item">
                        <IconButton color="primary" onClick={() => handleEdit(schedule.id)}>
                          <Edit width={22} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Desassociar Item">
                        <IconButton color="error" onClick={() => openDeleteModal(schedule.id)}>
                          <ArrowBack width={22} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <Grid container justifyContent="center" align="center" mt={1}>
            <Button variant="contained" color="primary" onClick={handleAdd}>
              Agendar Vistoria
            </Button>
          </Grid>
          <Grid container justifyContent="center" align="center" mt={1} mb={2}>
            <Typography
              variant="body2"
              color="primary"
              component="a"
              sx={{ cursor: 'pointer' }}
              onClick={() => setOpenModelInspectionNotAssociated(true)}
            >
              Adicionar uma vistoria já existente
            </Typography>
          </Grid>
        </TableContainer>
      </Paper>

      {/* Modal de Edição */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Editar vistoria</DialogTitle>
        <DialogContent>
          <ScheduleFormEdit
            onClosedModal={() => setEditModalOpen(false)}
            scheduleId={selectedscheduleId}
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
            projectId={projectId}
            customerId={customerId}
            onClosedModal={() => setAddModalOpen(false)}
            onRefresh={reloadPage}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openModelInspectionNotAssociated}
        onClose={() => setOpenModelInspectionNotAssociated(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Adicionar uma vistoria já existente</DialogTitle>
        <DialogContent>
          <TableContainer sx={{ whiteSpace: { xs: 'nowrap', md: 'unset' } }}>
            <Grid item xs={12} sm={6} style={{ marginBottom: '10px' }}>
              <CustomFormLabel htmlFor="name">Buscar por cliente</CustomFormLabel>
              <AutoCompleteUser fullWidth value={customer} onChange={(id) => setCustomer(id)} />
            </Grid>
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
              {loadingInspections ? (
                <TableSkeleton rows={5} columns={5} />
              ) : (
                <TableBody>
                  {inspectionsNotAssociated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2">
                          Nenhuma vistoria encontrada para este cliente
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    inspectionsNotAssociated.results.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell align="center">
                          <Typography variant="body2">{schedule?.schedule_date}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">{schedule?.schedule_start_time}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">{schedule?.schedule_end_time}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            <SupplyChip status={schedule?.status} />
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Editar Item">
                            <IconButton color="primary" onClick={() => handleEdit(schedule.id)}>
                              <Edit width={22} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Associar Item">
                            <IconButton
                              color="success"
                              onClick={() => openAssociateModal(schedule.id)}
                            >
                              <KeyboardArrowRight width={22} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              )}
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
        <DialogTitle>Confirmar Desassociação</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Tem certeza que deseja desassociar esta vistoria do projeto? Esta ação não pode ser
            desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteModalOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => handleDelete(inspectionSelected)} color="error">
            Confirmar
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
            Tem certeza que deseja associar esta vistoria ao projeto? Esta ação não pode ser
            desfeita.
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
