import { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Modal,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StatusIcon from '@mui/icons-material/AssignmentTurnedIn';
import DescriptionIcon from '@mui/icons-material/Description';
import StatusChip from '../DocumentStatusIcon';
import Contract from '@/app/components/templates/ContractPreview';
import saleService from '@/services/saleService';
import EditSalePage from '../../Edit-sale';
import SaleDetailPage from '../../Sale-detail';
import CreateSale from '../../Add-sale';

const SaleListCards = ({ leadId = null }) => {
  const theme = useTheme();

  const [salesList, setSalesList] = useState([]);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleEditClick = (id) => {
    setSelectedSaleId(id);
    setEditModalOpen(true);
  };

  const handleDetailClick = (id) => {
    setSelectedSaleId(id);
    setDetailModalOpen(true);
  };

  const handleCreateClick = () => {
    setCreateModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await saleService.getSaleByLead(leadId);
        setSalesList(response.results);
      } catch (error) {
        console.log('Error: ', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Grid container spacing={2}>
      {salesList.map((sale) => (
        <Grid item xs={8} key={sale.id}>
          <Card
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

                {/* <Modal>
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60%',
                    bgcolor: 'background.paper',
                    boxShadow: 2,
                    p: 4,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                  }}
                >
                  {currentSale && (
                    <Contract
                      id_customer={currentSale.customer?.complete_name || 'N/A'}
                      id_first_document={currentSale.firstDocument || 'N/A'}
                      id_second_document={currentSale.secondDocument || 'N/A'}
                      id_customer_address={currentSale.customerAddress || 'N/A'}
                      id_customer_house={currentSale.customerHouse || 'N/A'}
                      id_customer_zip={currentSale.customerZip || 'N/A'}
                      id_customer_city={currentSale.customerCity || 'N/A'}
                      id_customer_locality={currentSale.customerLocality || 'N/A'}
                      id_customer_state={currentSale.customerState || 'N/A'}
                      quantity_material_3={currentSale.quantityMaterial3 || 'N/A'}
                      id_material_3={currentSale.material3 || 'N/A'}
                      id_material_1={currentSale.material1 || 'N/A'}
                      id_material_2={currentSale.material2 || 'N/A'}
                      watt_pico={currentSale.wattPico || 'N/A'}
                      project_value_format={currentSale.total_value || 'N/A'}
                      id_payment_method={currentSale.paymentMethod || 'N/A'}
                      id_payment_detail={currentSale.paymentDetail || 'N/A'}
                      observation_payment={currentSale.observationPayment || 'N/A'}
                      dia={new Date().getDate()}
                      mes={new Date().toLocaleString('default', { month: 'long' })}
                      ano={new Date().getFullYear()}
                    />
                  )}
                </Box>
              </Modal> */}

                {/* <Tooltip title="Gerar Proposta">
                <IconButton
                  color="primary"
                  sx={{
                    borderRadius: '8px',
                    padding: '8px',
                  }}
                >
                  <DescriptionIcon />
                </IconButton>
              </Tooltip> */}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
      <Grid item xs={4}>
        <Box display="flex" justifyContent="flex-start">
          <Button variant="contained" color="primary" startIcon={<AddIcon />} fullWidth onClick={handleCreateClick}>
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
