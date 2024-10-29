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
  Modal,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StatusIcon from '@mui/icons-material/AssignmentTurnedIn';
import DescriptionIcon from '@mui/icons-material/Description';
import saleService from '@/services/saleService';
import StatusChip from '../../comercial/sale/components/DocumentStatusIcon';
import Contract from '@/app/components/templates/ContractPreview';
import ProposalForm from '../../proposal/Add-proposal';

const ProposalManager = ({
  sellers = [],
  sdrs = [],
  branches = [],
  campaigns = [],
  managers = [],
  supervisors = [],
  allUsers = [],
  leadData = [],
  proposals = [],
}) => {
  const theme = useTheme();

  const [showSaleForm, setShowSaleForm] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalData, setProposalData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isSendingContract, setIsSendingContract] = useState(false);
  const [sendingContractId, setSendingContractId] = useState(null);
  const [contractPreview, setContractPreview] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);

  const handleOpen = (proposal) => {
    s;
    console.log('Abrindo contrato:', proposal);
    setCurrentSale(proposal);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentSale(null);
  };

  const handleAddProposal = () => {
    setProposalData({
      lead_id: null,
      created_by_id: null,
      due_date: null,
      value: null,
      status: 'P',
      observation: null,
      kits: [],
    });
    setShowProposalForm(true);
  };

  const handleEditProposal = (proposal) => {
    setProposalData(proposal);
    setShowProposalForm(true);
  };

  const handleCloseProposalForm = () => {
    setShowProposalForm(false);
    setProposalData(null);
  };

  const handleSaveSale = async () => {
    setIsSaving(true);
    try {
      if (proposalData?.id) {
        await saleService.updateSale(proposalData.id, proposalData);
      } else {
        await saleService.createSale(proposalData);
      }
      setShowSaleForm(false);
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

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="flex-start" mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddProposal}
            startIcon={<AddIcon />}
          >
            Adicionar Proposta
          </Button>
        </Box>
      </Grid>

      {proposals.filter((proposal) => proposal.id).length === 0 && !showSaleForm && (
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" mt={4}>
            <Typography variant="h6" gutterBottom>
              Nenhuma proposta encontrada
            </Typography>
          </Box>
        </Grid>
      )}

      {proposals.filter((proposal) => proposal.id).length > 0 &&
        !showProposalForm &&
        proposals
          .filter((proposal) => proposal.id)
          .map((proposal) => (
            <Grid item xs={12} key={proposal.id}>
              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  mb: 3,
                  backgroundColor: theme.palette.background.paper,
                  borderLeft: `5px solid ${
                    proposal.status === 'F'
                      ? theme.palette.success.main
                      : theme.palette.warning.main
                  }`,
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <PersonIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Cliente: {proposal.lead?.name || 'N/A'}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={1}>
                    <AttachMoneyIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                    <Typography variant="body1">
                      Valor Total:{' '}
                      {proposal.value
                        ? new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(proposal.value)
                        : 'N/A'}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={1}>
                    <StatusIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
                    <Typography variant="body1">
                      Status: <StatusChip status={proposal.status} />
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Tooltip title="Editar Proposta">
                      <IconButton
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditSale(proposal)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Criar Venda">
                      <IconButton
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditSale(proposal)}
                      >
                        <AddShoppingCartIcon />
                      </IconButton>
                    </Tooltip>
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
                    </Modal>
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

      {showProposalForm && (
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ p: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {proposalData?.id ? 'Editar Proposta' : 'Adicionar Proposta'}
              </Typography>
              <ProposalForm
                sellers={sellers}
                sdrs={sdrs}
                branches={branches.results}
                campaigns={campaigns.results}
                managers={managers}
                supervisors={supervisors}
                allUsers={allUsers}
                leadData={leadData}
              />
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
