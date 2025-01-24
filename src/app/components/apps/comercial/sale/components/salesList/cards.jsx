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
  Modal,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StatusIcon from '@mui/icons-material/AssignmentTurnedIn';
import DescriptionIcon from '@mui/icons-material/Description';
import PreviewIcon from '@mui/icons-material/Preview';
import SendIcon from '@mui/icons-material/Send';
import StatusChip from '../../../../../../../utils/status/DocumentStatusIcon';
import saleService from '@/services/saleService';
import EditSaleTabs from '../../Edit-sale';
import SaleDetailPage from '../../Sale-detail';
import CreateSale from '../../Add-sale';
import { KanbanDataContext } from '@/app/context/kanbanCRMcontext';
import SkeletonCard from '@/app/components/apps/project/components/SkeletonCard';
import Contract from '@/app/components/templates/ContractPreview';
import axios from 'axios';
import leadService from '@/services/leadService';

const SaleListCards = ({ leadId, lead }) => {
  const theme = useTheme();

  console.log('leadId: ', lead);

  const [salesList, setSalesList] = useState([]);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);

  const [isSendingContract, setIsSendingContract] = useState(false);
  const [sendingContractId, setSendingContractId] = useState(null);

  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  console.log('salesList: ', salesList);
  const { idSaleSuccess, setIdSaleSuccess } = useContext(KanbanDataContext);

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

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const handleOpen = async (saleId) => {
    try {
      const sale = await saleService.getSaleById(saleId);

      setCurrentSale(sale);

      setOpen(true);
    } catch (error) {
      console.error('Erro ao buscar dados da venda:', error.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendContract = async (saleId, file) => {
    setSendingContractId(saleId);
    setIsSendingContract(true);
  
    try {
      const sale = await saleService.getSaleById(saleId);
      console.log('Dados da venda:', sale);
  
      const missingFields = [];
      if (!sale?.customer?.complete_name) missingFields.push('Nome Completo');
      if (!sale?.customer?.email) missingFields.push('Email');
      if (!sale?.customer?.first_document) missingFields.push('Documento');
      if (!sale?.customer?.birth_date) missingFields.push('Data de Nascimento');
      if (!sale?.customer?.phone_numbers?.[0]?.phone_number) missingFields.push('Telefone');
  
      if (missingFields.length > 0) {
        setSnackbarMessage(
          `Os seguintes campos obrigatórios estão faltando: ${missingFields.join(', ')}`,
        );
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
        return;
      }
  
      const data = {
        id_customer: "João Silva",
        id_first_document: "123.456.789-00",
        id_second_document: "MG-12.345.678",
        id_customer_address: "Rua das Flores",
        id_customer_house: "123",
        id_customer_zip: "12345-678",
        id_customer_city: "Bairro das Rosas",
        id_customer_locality: "Belo Horizonte",
        id_customer_state: "MG",
        quantity_material_3: "20",
        id_material_3: "Painéis Solares XYZ",
        id_material_1: "Inversor Solar ABC",
        id_material_2: "Estrutura de Suporte",
        watt_pico: "5.0",
        project_value_format: "25.000,00",
        id_payment_method: "Boleto",
        id_payment_detail: "À vista",
        observation_payment: "Com desconto de 10%",
        dia: "09",
        mes: "Janeiro",
        ano: "2025",
      };
  
      const base64Response = await axios.post('/api/document/base64', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      const base64File = base64Response.data?.base64;
      if (!base64File) {
        throw new Error('Falha na conversão do arquivo em Base64');
      }
      console.log('Arquivo convertido para Base64');
  
      const path = `/Contratos/Contrato-${sale?.customer?.complete_name}.pdf`;
  
      const documentResponse = await axios.post('/api/clicksign/uploadDocument', {
        content_base64: base64File,
        path: path,
        name: `Contrato de ${sale?.customer?.complete_name}`,
      });
  
      const documentKey = documentResponse.data?.document?.key;
      if (!documentKey) {
        throw new Error('Falha no upload do documento');
      }
      console.log('Documento enviado com sucesso:', documentKey);
  
      // Criação do signatário
      const signerResponse = await axios.post('/api/clicksign/createSigner', {
        documentation: sale?.customer?.first_document,
        birthday: sale?.customer?.birth_date,
        phone_number: sale?.customer?.phone_numbers[0]?.phone_number,
        email: sale?.customer?.email,
        name: sale?.customer?.complete_name,
        auth: 'whatsapp',
        methods: { selfie_enabled: false, handwritten_enabled: false },
      });
  
      const signerKey = signerResponse.data?.signer?.key;
      if (!signerKey) {
        throw new Error('Falha na criação do signatário');
      }
      console.log('Signatário criado:', signerKey);
  
      // Adiciona o signatário ao documento
      const addSignerResponse = await axios.post('/api/clicksign/addSignerDocument', {
        signerKey: signerKey,
        documentKey: documentKey,
        signAs: 'contractor',
      });
  
      const requestSignatureKey = addSignerResponse.data?.list?.request_signature_key;
      if (!requestSignatureKey) {
        throw new Error('Falha ao adicionar o signatário ao documento');
      }
      console.log('Signatário adicionado ao documento:', requestSignatureKey);
  
      // Envia notificações
      await axios.post('/api/clicksign/notification/email', {
        request_signature_key: requestSignatureKey,
        message: 'Por favor, assine o contrato.',
      });
      console.log('Notificação por e-mail enviada');
  
      await axios.post('/api/clicksign/notification/whatsapp', {
        request_signature_key: requestSignatureKey,
      });
      console.log('Notificação por WhatsApp enviada');
  
      setSnackbarMessage('Contrato enviado com sucesso!');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('Erro ao enviar contrato:', error.message);
      setSnackbarMessage(`Erro ao enviar contrato: ${error.message}`);
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setIsSendingContract(false);
      setSendingContractId(null);
    }
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
        const response = await leadService.getAllSalesByLead(leadId);
        setSalesList(response || []);
      } catch (error) {
        console.log('Error: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [leadId, refresh]);

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
          salesList?.sales.map((sale) => (
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
                    Cliente: {salesList.customer?.complete_name || 'N/A'}
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

                  <Tooltip title="Preview do Contrato">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(sale.id)}
                      sx={{
                        borderRadius: '8px',
                        padding: '8px',
                      }}
                    >
                      <PreviewIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Enviar Contrato">
                    <IconButton
                      color="primary"
                      onClick={() => handleSendContract(sale.id)}
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

      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Editar Venda</DialogTitle>
        <DialogContent
          sx={{
            height: { xs: '80vh', md: '60vh' },
            overflowY: 'auto',
          }}
        >
          <EditSaleTabs
            saleId={selectedSaleId}
            onClosedModal={() => setEditModalOpen(false)}
            refresh={handleRefresh}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Detalhes da Venda</DialogTitle>
        <DialogContent
          sx={{
            height: { xs: '80vh', md: '60vh' },
            overflowY: 'auto',
          }}
        >
          <SaleDetailPage saleId={selectedSaleId} onClosedModal={() => setDetailModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Nova Venda</DialogTitle>
        <DialogContent>
          <CreateSale
            onClosedModal={() => setCreateModalOpen(false)}
            leadId={leadId}
            refresh={handleRefresh}
          />
        </DialogContent>
      </Dialog>

      <Modal open={open} onClose={handleClose}>
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
              id_first_document={currentSale.customer?.first_document || 'N/A'}
              id_second_document={currentSale.customer?.second_document || 'N/A'}
              id_customer_address={currentSale.customer?.address || 'N/A'}
              id_customer_house={currentSale.customer?.house_number || 'N/A'}
              id_customer_zip={currentSale.customer?.zip_code || 'N/A'}
              id_customer_city={currentSale.customer?.city || 'N/A'}
              id_customer_locality={currentSale.customer?.locality || 'N/A'}
              id_customer_state={currentSale.customer?.state || 'N/A'}
              quantity_material_3={currentSale.quantity_material_3 || 'N/A'}
              id_material_3={currentSale.material_3 || 'N/A'}
              id_material_1={currentSale.material_1 || 'N/A'}
              id_material_2={currentSale.material_2 || 'N/A'}
              watt_pico={currentSale.watt_pico || 'N/A'}
              project_value_format={
                currentSale.total_value
                  ? new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(currentSale.total_value)
                  : 'N/A'
              }
              id_payment_method={currentSale.payment_method || 'N/A'}
              id_payment_detail={currentSale.payment_detail || 'N/A'}
              observation_payment={currentSale.observation_payment || 'N/A'}
              dia={new Date().getDate()}
              mes={new Date().toLocaleString('default', { month: 'long' })}
              ano={new Date().getFullYear()}
            />
          )}
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={
            snackbarMessage.includes('Erro')
              ? 'error'
              : snackbarMessage.includes('sucesso')
              ? 'success'
              : 'warning'
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default SaleListCards;
