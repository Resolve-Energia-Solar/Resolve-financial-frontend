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
import {
  Add as AddIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
  AssignmentTurnedIn as StatusIcon,
  Description as DescriptionIcon,
  AddShoppingCart as AddShoppingCartIcon,
} from '@mui/icons-material';
import axios from 'axios';
import saleService from '@/services/saleService';
import StatusChip from '@/app/components/apps/comercial/sale/components/DocumentStatusIcon';
import Contract from '@/app/components/templates/ContractPreview';
import ProposalForm from './ProposalForm';

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

  const [isSaleFormVisible, setSaleFormVisible] = useState(false);
  const [isProposalFormVisible, setProposalFormVisible] = useState(false);
  const [currentProposalData, setCurrentProposalData] = useState(null);
  const [isSaving, setSaving] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isSendingContract, setSendingContract] = useState(false);
  const [sendingContractId, setSendingContractId] = useState(null);
  const [contractPreview, setContractPreview] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const openModal = (proposal) => {
    setSelectedSale(proposal);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedSale(null);
  };

  const handleAddProposal = () => {
    setCurrentProposalData({
      lead_id: null,
      created_by_id: null,
      due_date: null,
      value: null,
      status: 'P',
      observation: null,
      kits: [],
    });
    setProposalFormVisible(true);
  };

  const handleEditProposal = (proposal) => {
    setCurrentProposalData(proposal);
    setProposalFormVisible(true);
  };

  const closeProposalForm = () => {
    setProposalFormVisible(false);
    setCurrentProposalData(null);
  };

  const saveSale = async () => {
    setSaving(true);
    try {
      if (currentProposalData?.id) {
        await saleService.updateSale(currentProposalData.id, currentProposalData);
      } else {
        await saleService.createSale(currentProposalData);
      }
      setSaleFormVisible(false);
      setSnackbarMessage('Venda salva com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Erro ao salvar a venda.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const sendContract = async (sale) => {
    setSendingContractId(sale.id);
    setSendingContract(true);

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
      if (!documentKey) throw new Error('Falha na criação do documento');

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
      if (!signerKey) throw new Error('Falha na criação do signatário');

      const addSignerResponse = await axios.post('/api/clicksign/addSignerDocument', {
        signerKey: signerKey,
        documentKey: documentKey,
        signAs: 'contractor',
      });

      const requestSignatureKey = addSignerResponse.data?.list?.request_signature_key;
      if (!requestSignatureKey) throw new Error('Falha ao adicionar o signatário ao documento');

      await axios.post('/api/clicksign/notification/email', {
        request_signature_key: requestSignatureKey,
        message: 'Por favor, assine o contrato.',
      });

      await axios.post('/api/clicksign/notification/whatsapp', {
        request_signature_key: requestSignatureKey,
      });

      setSnackbarMessage('Contrato enviado com sucesso!');
      setSnackbarSeverity('success');
    } catch (error) {
      setSnackbarMessage('Erro ao enviar contrato.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setSendingContract(false);
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

      {proposals.filter((proposal) => proposal.id).length === 0 && !isSaleFormVisible && (
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" mt={4}>
            <Typography variant="h6" gutterBottom>
              Nenhuma proposta encontrada
            </Typography>
          </Box>
        </Grid>
      )}

      {proposals.filter((proposal) => proposal.id).length > 0 &&
        !isProposalFormVisible &&
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
                        onClick={() => handleEditProposal(proposal)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Criar Venda">
                      <IconButton
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditProposal(proposal)}
                      >
                        <AddShoppingCartIcon />
                      </IconButton>
                    </Tooltip>
                    <Modal open={isModalOpen} onClose={closeModal}>
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
                        {selectedSale && (
                          <Contract
                            id_customer={selectedSale.customer?.complete_name || 'N/A'}
                            id_first_document={selectedSale.firstDocument || 'N/A'}
                            id_second_document={selectedSale.secondDocument || 'N/A'}
                            id_customer_address={selectedSale.customerAddress || 'N/A'}
                            id_customer_house={selectedSale.customerHouse || 'N/A'}
                            id_customer_zip={selectedSale.customerZip || 'N/A'}
                            id_customer_city={selectedSale.customerCity || 'N/A'}
                            id_customer_locality={selectedSale.customerLocality || 'N/A'}
                            id_customer_state={selectedSale.customerState || 'N/A'}
                            quantity_material_3={selectedSale.quantityMaterial3 || 'N/A'}
                            id_material_3={selectedSale.material3 || 'N/A'}
                            id_material_1={selectedSale.material1 || 'N/A'}
                            id_material_2={selectedSale.material2 || 'N/A'}
                            watt_pico={selectedSale.wattPico || 'N/A'}
                            project_value_format={selectedSale.total_value || 'N/A'}
                            id_payment_method={selectedSale.paymentMethod || 'N/A'}
                            id_payment_detail={selectedSale.paymentDetail || 'N/A'}
                            observation_payment={selectedSale.observationPayment || 'N/A'}
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

      {isProposalFormVisible && (
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ p: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {currentProposalData?.id ? 'Editar Proposta' : 'Adicionar Proposta'}
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
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ProposalManager;

