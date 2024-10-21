import { useState } from 'react';
import { Grid, Button, Card, CardContent, Typography, Box, Snackbar, Alert, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StatusIcon from '@mui/icons-material/AssignmentTurnedIn';
import SaleForm from './LeadSale';
import saleService from '@/services/saleService';
import StatusChip from '../../comercial/sale/components/DocumentStatusIcon';

const SaleManager = ({
  sales = [],
  sellers = [],
  sdrs = [],
  branches = [],
  campaigns = [],
  managers = [],
  supervisors = [],
  allUsers = [],
  leadData = [],
}) => {
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [saleData, setSaleData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); 
  const [snackbarMessage, setSnackbarMessage] = useState(''); 
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleAddSale = () => {
    setSaleData({
      customer_id: null,
      seller_id: null,
      sales_supervisor_id: null,
      sales_manager_id: null,
      marketing_campaign_id: null,
      branch_id: null,
      total_value: '',
      is_sale: false,
      is_completed_document: false,
      lead_id: leadData.id, 
    });
    setShowSaleForm(true);
  };

  const handleEditSale = (sale) => {
    setSaleData(sale);
    setShowSaleForm(true);
  };

  const handleCloseSaleForm = () => {
    setShowSaleForm(false);
    setSaleData(null);
  };

  const handleSaveSale = async () => {
    setIsSaving(true);
    try {
      if (saleData?.id) {
        console.log('saleData.id:', saleData);
        await saleService.updateSale(saleData.id, saleData);
      } else {
        await saleService.createSale(saleData);
      }
      setShowSaleForm(false);
      setSaleData(null);
      setSnackbarMessage('Venda salva com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true); 
    } catch (error) {
      console.error('Erro ao salvar a venda:', error.response?.data || error.message);
      setSnackbarMessage('Erro ao salvar a venda.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true); 
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Grid container spacing={4}>
    
      <Grid item xs={12}>
        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddSale}
            startIcon={<AddIcon />}
          >
            Adicionar Venda
          </Button>
        </Box>
      </Grid>

      {sales.length === 0 && !showSaleForm && (
        <Grid item xs={12}>
          <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            <Typography variant="h6" gutterBottom>
              Nenhuma venda encontrada
            </Typography>
          </Box>
        </Grid>
      )}

      {sales.filter(sale => sale.lead_id === leadData.id).length > 0 &&
        !showSaleForm &&
        sales.filter(sale => sale.lead_id === leadData.id).map((sale) => (
          <Grid item xs={12} key={sale.id}>
            <Card
              variant="outlined"
              sx={{
                p: 3,
                mb: 3,
                backgroundColor: '#fff', 
                borderLeft: `5px solid ${sale.status === 'Concluída' ? '#4caf50' : '#ff9800'}`, 
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <PersonIcon sx={{ color: '#3f51b5', mr: 1 }} /> 
                  <Typography variant="h6" gutterBottom>
                    Cliente: {sale.customer?.complete_name || 'N/A'}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <PersonIcon sx={{ color: '#ff5722', mr: 1 }} />
                  <Typography variant="body1">
                    Vendedor: {sale.seller?.complete_name || 'N/A'}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <AttachMoneyIcon sx={{ color: '#4caf50', mr: 1 }} /> 
                  <Typography variant="body1">
                    Valor Total: {sale.total_value || 'N/A'}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <StatusIcon sx={{ color: '#607d8b', mr: 1 }} /> 
                  <Typography variant="body1">
                    Status: <StatusChip status={sale.status} />
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="flex-end" mt={3}>
                  <IconButton
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditSale(sale)}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

      {showSaleForm && (
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ p: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {saleData?.id ? 'Editar Venda' : 'Adicionar Venda'}
              </Typography>
              <SaleForm
                saleData={saleData}
                setSaleData={setSaleData}
                sellers={sellers}
                sdrs={sdrs}
                branches={branches.results}
                campaigns={campaigns.results}
                managers={managers}
                supervisors={supervisors}
                allUsers={allUsers}
                leadData={leadData}
              />
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCloseSaleForm}
                  sx={{ mr: 2 }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveSale}
                  disabled={isSaving}
                >
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default SaleManager;
