import { useContext, useEffect, useState } from 'react';
import {
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StatusIcon from '@mui/icons-material/AssignmentTurnedIn';
import DescriptionIcon from '@mui/icons-material/Description';
import StatusChip from '../DocumentStatusIcon';
import saleService from '@/services/saleService';
import EditSalePage from '../../Edit-sale';
import SaleDetailPage from '../../Sale-detail';
import CreateSale from '../../Add-sale';
import { KanbanDataContext } from '@/app/context/kanbancontext';
import SkeletonCard from '@/app/components/apps/project/components/SkeletonCard';

const SaleListCards = ({ leadId = null }) => {
  const theme = useTheme();

  const [salesList, setSalesList] = useState([]);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { idSaleSuccess, setIdSaleSuccess } = useContext(KanbanDataContext);

  const handleEditClick = (id) => {
    setSelectedSaleId(id);
    setEditModalOpen(true);
    console.log('Edit Sale ID: ', id);
  };

  const handleDetailClick = (id) => {
    setSelectedSaleId(id);
    setDetailModalOpen(true);
  };

  const handleCreateClick = () => {
    setCreateModalOpen(true);
  };

  useEffect(() => {
    if (idSaleSuccess !== null) {
      handleEditClick(idSaleSuccess);
      setIdSaleSuccess(null);
    }
  }, [idSaleSuccess]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await saleService.getSaleByLead(leadId);
        setSalesList(response.results);
      } catch (error) {
        console.log('Error: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [leadId]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={8}>
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
        ) : salesList.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body2" color={theme.palette.text.secondary}>
              Nenhuma fatura encontrada.
            </Typography>
          </Grid>
        ) : (
          salesList.map((sale) => (
            <Card
              key={sale.id}
              variant="outlined"
              sx={{
                p: 3,
                mb: 3,
                backgroundColor: theme.palette.background.paper,
                borderLeft: `5px solid ${
                  sale.status === 'F' ? theme.palette.success.main : theme.palette.warning.main
                }`,
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <PersonIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    Cliente: {sale.customer?.complete_name || 'N/A'}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <AttachMoneyIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                  <Typography variant="body1">
                    Valor Total:{' '}
                    {sale.total_value
                      ? new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(sale.total_value)
                      : 'N/A'}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <StatusIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
                  <Typography variant="body1">
                    Status: <StatusChip status={sale.status} />
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Tooltip title="Editar Venda">
                    <IconButton
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditClick(sale.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Detalhes da Venda">
                    <IconButton
                      variant="outlined"
                      color="primary"
                      onClick={() => handleDetailClick(sale.id)}
                    >
                      <DescriptionIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Grid>

      <Grid item xs={4}>
        <Box display="flex" justifyContent="flex-end" alignItems="flex-start">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            fullWidth
          >
            Nova Venda
          </Button>
        </Box>
      </Grid>

      {/* Modal de Edição */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Editar Venda</DialogTitle>
        <DialogContent>
          <EditSalePage saleId={selectedSaleId} onClosedModal={() => setEditModalOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes */}
      <Dialog
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Detalhes da Venda</DialogTitle>
        <DialogContent>
          <SaleDetailPage saleId={selectedSaleId} onClosedModal={() => setDetailModalOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Modal de Criar Venda */}
      <Dialog
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Nova Venda</DialogTitle>
        <DialogContent>
          <CreateSale onClosedModal={() => setCreateModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default SaleListCards;
