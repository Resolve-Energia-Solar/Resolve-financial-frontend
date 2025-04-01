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
import { IconEye, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import unitService from '@/services/unitService';
import SupplyChip from '../components/SupplyChip';
import ChecklistFormDetail from '.';

const CheckListRateioDetail = ({ projectId = null }) => {
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [reload, setReload] = useState(false);

  const reloadPage = () => {
    setReload(!reload);
  };

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await unitService.index({ project: projectId });
        setUnits(response.results);
      } catch (error) {
        console.log('Error: ', error);
      }
    };
    fetchUnits();
  }, [projectId, reload]);

  const [units, setUnits] = useState([]);

  const handleDetail = (unitId) => {
    setSelectedUnitId(unitId);
    setDetailModalOpen(true);
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
                      <Typography variant="body2">{unit?.name}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      {unit.supply_adquance?.map((item) => (
                        <Typography key={item.id} variant="body2">
                          {item?.name}
                        </Typography>
                      ))}
                      {unit.supply_adquance?.length === 0 && (
                        <Typography variant="body2">Nenhuma</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {unit?.main_unit ? 'Geradora' : 'Beneficiária'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        <SupplyChip status={unit?.type} />
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Detail Item">
                        <IconButton color="primary" onClick={() => handleDetail(unit.id)}>
                          <IconEye width={22} />
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

      {/* Modal de Edição */}
      <Dialog
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Visualizar Unidade</DialogTitle>
        <DialogContent>
          <ChecklistFormDetail
            onClosedModal={() => setDetailModalOpen(false)}
            unitId={selectedUnitId}
            onRefresh={reloadPage}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CheckListRateioDetail;
