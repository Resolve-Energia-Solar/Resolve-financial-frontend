'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Modal,
  Snackbar,
  Alert,
  Button,
  Fade,
  Slide,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PreviewIcon from '@mui/icons-material/Preview';
import saleService from '@/services/saleService';
import Contract from '../../templates/ContractPreview';
import axios from 'axios';

function ContractSubmissions({ sale }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSale, setCurrentSale] = useState(null);
  const [open, setOpen] = useState(false);
  const [sendingContractId, setSendingContractId] = useState(null);
  const [isSendingContract, setIsSendingContract] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleOpen = async (saleId) => {
    try {
      const fetchedSale = await saleService.getSaleById(saleId);
      setCurrentSale(fetchedSale);
      setOpen(true);
    } catch (error) {
      console.error('Erro ao buscar dados da venda:', error.message);
    }
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get('/api/clicksign/submissions');
        setSubmissions(response.data);
      } catch (error) {
        console.error('Erro ao buscar envios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleSendContract = async () => {
    if (!sale?.id) {
      setSnackbarMessage('ID da venda não encontrado.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setSendingContractId(sale.id);
    setIsSendingContract(true);

    try {
      const fetchedSale = await saleService.getSaleById(sale.id);
      console.log('Dados da venda:', fetchedSale);

      const missingFields = [];
      if (!fetchedSale?.customer?.complete_name) missingFields.push('Nome Completo');
      if (!fetchedSale?.customer?.email) missingFields.push('Email');
      if (!fetchedSale?.customer?.first_document) missingFields.push('Documento');
      if (!fetchedSale?.customer?.birth_date) missingFields.push('Data de Nascimento');
      if (!fetchedSale?.customer?.phone_numbers?.[0]?.phone_number) missingFields.push('Telefone');

      if (missingFields.length > 0) {
        setSnackbarMessage(
          `Os seguintes campos obrigatórios estão faltando: ${missingFields.join(', ')}`,
        );
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
        return;
      }

      const documentData = {
        Address: fetchedSale.customer_address || 'Endereço Fictício',
        Phone: fetchedSale?.customer?.phone_numbers[0]?.phone_number || 'Telefone Fictício',
      };
      const path = `/Contratos/Contrato-${fetchedSale?.customer?.complete_name}.pdf`;

      const documentResponse = await axios.post('/api/clicksign/createDocument', {
        data: documentData,
        path,
        usePreTemplate: false,
      });

      const documentKey = documentResponse.data?.document?.key;
      if (!documentKey) {
        throw new Error('Falha na criação do documento');
      }
      console.log('Documento criado com sucesso:', documentKey);

      const signerResponse = await axios.post('/api/clicksign/createSigner', {
        documentation: fetchedSale?.customer?.first_document,
        birthday: fetchedSale?.customer?.birth_date,
        phone_number: fetchedSale?.customer?.phone_numbers[0]?.phone_number,
        email: fetchedSale?.customer?.email,
        name: fetchedSale?.customer?.complete_name,
        auth: 'whatsapp',
        methods: { selfie_enabled: false, handwritten_enabled: false },
      });

      const signerKey = signerResponse.data?.signer?.key;
      if (!signerKey) {
        throw new Error('Falha na criação do signatário');
      }
      console.log('Signatário criado:', signerKey);

      const addSignerResponse = await axios.post('/api/clicksign/addSignerDocument', {
        signerKey,
        documentKey,
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
      setSnackbarMessage(`Erro ao enviar contrato: ${error.message}`);
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setIsSendingContract(false);
      setSendingContractId(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Fade in={!loading}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Envios para Clicksign
        </Typography>

        {submissions.length === 0 ? (
          <Box textAlign="center" mt={10} mb={5}>
            <Typography variant="body1" color="text.secondary">
              Sem envios disponíveis.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {submissions.map((submission, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Slide direction="up" in={!loading} mountOnEnter unmountOnExit>
                  <Card sx={{ transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                    <CardContent>
                      <Typography variant="h6">{submission.clientName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Data: {new Date(submission.date).toLocaleDateString('pt-BR')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {submission.status}
                      </Typography>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        )}

        <Box
          sx={{
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            padding: 2,
            backgroundColor: 'background.paper',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen(sale?.id)}
            startIcon={<PreviewIcon />}
            sx={{
              borderRadius: '8px',
              paddingX: 3,
            }}
          >
            Preview do Contrato
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleSendContract(sale?.id)}
            startIcon={sendingContractId === sale?.id ? <CircularProgress size={20} /> : <SendIcon />}
            disabled={sendingContractId === sale?.id}
            sx={{
              borderRadius: '8px',
              paddingX: 3,
            }}
          >
            Enviar Contrato
          </Button>
        </Box>

        <Modal open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60%',
              bgcolor: 'background.paper',
              boxShadow: 3,
              p: 4,
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: 2,
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
            severity={snackbarSeverity}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
}

export default ContractSubmissions;
