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
  useTheme,
  CircularProgress,
  Modal,
} from '@mui/material';

import PreviewIcon from '@mui/icons-material/Preview';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StatusIcon from '@mui/icons-material/AssignmentTurnedIn';
import SendIcon from '@mui/icons-material/Send';
import DescriptionIcon from '@mui/icons-material/Description';
import SaleForm from './SaleForm';
import saleService from '@/services/saleService';
import StatusChip from '../../comercial/sale/components/DocumentStatusIcon';
import ClickSignService from '@/services/ClickSign';
import Contract from '@/app/components/templates/ContractPreview';

const ProposalManager = ({
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
  const theme = useTheme();
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [saleData, setSaleData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isSendingContract, setIsSendingContract] = useState(false);
  const [sendingContractId, setSendingContractId] = useState(null);
  const [contractPreview, setContractPreview] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
    setSendingContractId(sale.id);
    setIsSendingContract(true);
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
      setSendingContractId(null);
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
      setSnackbarMessage('Erro ao enviar contrato.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setIsSendingContract(false);
    }
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
            Adicionar Proposta
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
                    <PersonIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                    <Typography variant="body1">
                      Vendedor: {sale.seller?.complete_name || 'N/A'}
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
                    <IconButton
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditSale(sale)}
                    >
                      <EditIcon />
                    </IconButton>
                    <Tooltip title="Preview do Contrato">
                      <IconButton
                        color="primary"
                        onClick={handleOpen}
                        sx={{
                          borderRadius: '8px',
                          padding: '8px',
                        }}
                      >
                        <PreviewIcon />
                      </IconButton>
                    </Tooltip>

                    <Modal open={open} onClose={handleClose}>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '80%',
                          bgcolor: 'background.paper',
                          boxShadow: 24,
                          p: 4,
                          maxHeight: '90vh',
                          overflowY: 'auto',
                        }}
                      >
                        <Contract
                          id_customer={sale.customerName}
                          id_first_document={sale.firstDocument}
                          id_second_document={sale.secondDocument}
                          id_customer_address={sale.customerAddress}
                          id_customer_house={sale.customerHouse}
                          id_customer_zip={sale.customerZip}
                          id_customer_city={sale.customerCity}
                          id_customer_locality={sale.customerLocality}
                          id_customer_state={sale.customerState}
                          quantity_material_3={sale.quantityMaterial3}
                          id_material_3={sale.material3}
                          id_material_1={sale.material1}
                          id_material_2={sale.material2}
                          watt_pico={sale.wattPico}
                          project_value_format={sale.projectValueFormat}
                          id_payment_method={sale.paymentMethod}
                          id_payment_detail={sale.paymentDetail}
                          observation_payment={sale.observationPayment}
                          dia={new Date().getDate()}
                          mes={new Date().toLocaleString('default', { month: 'long' })}
                          ano={new Date().getFullYear()}
                        />
                      </Box>
                    </Modal>
                    <Tooltip title="Enviar Contrato">
                      <IconButton
                        color="primary"
                        onClick={() => handleSendContract(sale)}
                        disabled={sendingContractId === sale.id}
                        sx={{
                          borderRadius: '8px',
                          padding: '8px',
                        }}
                      >
                        {sendingContractId === sale.id ? (
                          <CircularProgress size={24} />
                        ) : (
                          <SendIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Gerar Proposta">
                      <IconButton
                        color="primary"
                        onClick={() => console.log('Gerar proposta')}
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

export default ProposalManager;
