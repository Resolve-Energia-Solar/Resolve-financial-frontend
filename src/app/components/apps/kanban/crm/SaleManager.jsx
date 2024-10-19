'use client';

import { useState } from 'react';
import { Grid, Button, Card, CardContent, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaleForm from './LeadSale';

const SaleManager = ({ sales = [], sellers = [], sdrs = [], branches = [], campaigns = [] }) => {
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [saleData, setSaleData] = useState(null);

  const handleAddSale = () => {
    setSaleData({
      customer: {},
      seller: '',
      sales_supervisor: '',
      sales_manager: '',
      marketing_campaign_id: '',
      branch_id: '',
      total_value: '',
      status: '',
      is_sale: false,
      is_completed_document: false,
      document_completion_date: '',
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

  return (
    <Grid container spacing={4}>
      {sales.length === 0 && !showSaleForm && (
        <Grid item xs={12}>
          <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            <Typography variant="h6" gutterBottom>
              Nenhuma venda encontrada
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSale}
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
            >
              Adicionar Venda
            </Button>
          </Box>
        </Grid>
      )}

      {sales.length > 0 &&
        !showSaleForm &&
        sales.map((sale) => (
          <Grid item xs={12} key={sale.id}>
            <Card variant="outlined" sx={{ p: 3, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cliente: {sale.customer?.complete_name || 'N/A'}
                </Typography>
                <Typography>Vendedor: {sale.seller?.complete_name || 'N/A'}</Typography>
                <Typography>Valor Total: {sale.total_value || 'N/A'}</Typography>
                <Typography>Status: {sale.status || 'N/A'}</Typography>

                <Box display="flex" justifyContent="flex-end" mt={3}>
                  <Button variant="outlined" color="primary" onClick={() => handleEditSale(sale)}>
                    Editar Venda
                  </Button>
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
                branches={branches}
                campaigns={campaigns}
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
                  onClick={() => console.log('Salvar venda')}
                >
                  Salvar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default SaleManager;
