import { useState } from 'react';
import {
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StatusIcon from '@mui/icons-material/AssignmentTurnedIn';
import SaleForm from './LeadSale';
import saleService from '@/services/saleService';
import StatusChip from '../../comercial/sale/components/DocumentStatusIcon';
import SendIcon from '@mui/icons-material/Send';
import DescriptionIcon from '@mui/icons-material/Description';
import ClickSignService from '@/services/ClickSign';
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
  const [isSendingContract, setIsSendingContract] = useState(false);

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

  const handleSendContract = async (sale) => {
    console.log('Enviando contrato:', sale);
    try {
      setIsSendingContract(true);

      const documentData = {
        Address: sale.customer_address || 'Endereço Fictício',
        Phone: sale?.customer?.phone_numbers[0]?.phone_number || 'Telefone Fictício',
      };
      const path = `/Contratos/Contrato-${sale?.customer?.complete_name}.pdf`;

      const documentoCriado = await ClickSignService.v1.createDocumentModel(documentData, path);

      if (!documentoCriado || !documentoCriado.document || !documentoCriado.document.key) {
        throw new Error('Falha na criação do documento');
      }

      const documentKey = documentoCriado.document.key;
      console.log('Documento criado com sucesso:', documentKey);

      const signer = await ClickSignService.v1.createSigner(
        sale?.customer?.first_document,
        sale?.customer?.birth_date,
        sale?.customer?.phone_numbers[0]?.phone_number,
        sale?.customer?.email,
        sale?.customer?.complete_name,
        'whatsapp',
        { selfie_enabled: false, handwritten_enabled: false },
      );

      if (!signer || !signer.signer || !signer.signer.key) {
        throw new Error('Falha na criação do signatário');
      }

      const signerKey = signer.signer.key;
      console.log('Signatário criado:', signerKey);

      const listaAdicionada = await ClickSignService.AddSignerDocument(
        signerKey,
        documentKey,
        'contractor',
        'Por favor, assine o contrato.',
      );

      if (
        !listaAdicionada ||
        !listaAdicionada.list ||
        !listaAdicionada.list.request_signature_key
      ) {
        throw new Error('Falha ao adicionar o signatário ao documento');
      }

      const requestSignatureKey = listaAdicionada.list.request_signature_key;
      console.log('Signatário adicionado ao documento:', listaAdicionada);

      const emailNotificacao = await ClickSignService.notification.email(
        requestSignatureKey,
        'Por favor, assine o contrato.',
      );
      console.log('Notificação por e-mail enviada:', emailNotificacao);

      const whatsappNotificacao = await ClickSignService.notification.whatsapp(requestSignatureKey);
      console.log('Notificação por WhatsApp enviada:', whatsappNotificacao);

      setSnackbarMessage('Contrato enviado com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setIsSendingContract(false);
    } catch (error) {
      if (error.response && error.response.data) {
        console.error(
          'Erro ao processar o contrato:',
          JSON.stringify(error.response.data, null, 2),
        );
        setSnackbarMessage(`Erro: ${error.response.data.message || 'Erro ao enviar contrato.'}`);
        setSnackbarSeverity('error');
      } else {
        console.error('Erro ao processar o contrato:', error.message);
        setSnackbarMessage(error.message || 'Erro ao enviar contrato.');
        setSnackbarSeverity('error');
      }
      setSnackbarOpen(true);
      setIsSendingContract(false);
    }
  };

  const handleGenerateProposal = () => {
    console.log('Gerar proposta');
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

      {sales.filter((sale) => sale.lead_id === leadData.id).length > 0 &&
        !showSaleForm &&
        sales
          .filter((sale) => sale.lead_id === leadData.id)
          .map((sale) => (
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

                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <IconButton
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditSale(sale)}
                    >
                      <EditIcon />
                    </IconButton>
                    <Tooltip title="Enviar Contrato">
                      <IconButton
                        color="primary"
                        onClick={() => handleSendContract(sale)}
                        disabled={isSendingContract}
                        sx={{
                          borderRadius: '8px',
                          padding: '8px',
                        }}
                      >
                        <SendIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Gerar Proposta">
                      <IconButton
                        color="primary"
                        onClick={handleGenerateProposal}
                        sx={{
                          borderRadius: '8px',
                          padding: '8px',
                        }}
                      >
                        <DescriptionIcon />
                      </IconButton>
                    </Tooltip>
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
