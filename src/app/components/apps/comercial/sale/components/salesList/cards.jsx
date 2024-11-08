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
import StatusChip from '../DocumentStatusIcon';
import saleService from '@/services/saleService';
import EditSalePage from '../../Edit-sale';
import SaleDetailPage from '../../Sale-detail';
import CreateSale from '../../Add-sale';
import { KanbanDataContext } from '@/app/context/kanbancontext';
import SkeletonCard from '@/app/components/apps/project/components/SkeletonCard';
import Contract from '@/app/components/templates/ContractPreview';
import axios from 'axios';

const SaleListCards = ({ leadId = null }) => {
  const theme = useTheme();

  const [salesList, setSalesList] = useState([]);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);

  const [isSendingContract, setIsSendingContract] = useState(false);
  const [sendingContractId, setSendingContractId] = useState(null);

  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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

  const handleOpen = (sale) => {
    setCurrentSale(sale);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendContract = async (sale) => {
    console.log('Enviando contrato:', sale);
    setSendingContractId(sale.id);
    setIsSendingContract(true);

    try {
      const documentData = {
        Address: sale.customer_address || 'Endereço Fictício',
        Phone: sale?.customer?.phone_numbers[0]?.phone_number || 'Telefone Fictício',
      };
      const path = `/Contratos/Contrato-${sale?.customer?.complete_name}.pdf`;

      const documentResponse = await axios.post('/api/clicksign/createDocument', {
        data: documentData,
        path: path,
        usePreTemplate: false,
      });

      const documentKey = documentResponse.data?.document?.key;
      if (!documentKey) {
        throw new Error('Falha na criação do documento');
      }
      console.log('Documento criado com sucesso:', documentKey);

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
      setSnackbarMessage('Erro ao enviar contrato.');
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

                  <Tooltip title="Preview do Contrato">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(sale)}
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
          <EditSalePage saleId={selectedSaleId} onClosedModal={() => setEditModalOpen(false)} />
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
          <CreateSale onClosedModal={() => setCreateModalOpen(false)} leadId={leadId} />
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
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbarMessage.includes('Erro') ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default SaleListCards;
