'use client';

import { useState } from 'react';
import saleService from '@/services/saleService';
import axios from 'axios';
import contractService from '@/services/contract-submissions';

export default function useSendContract() {
  const [sendingContractId, setSendingContractId] = useState(null);
  const [isSendingContract, setIsSendingContract] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const sendContract = async (sale) => {
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
      if (!documentKey) throw new Error('Falha na criação do documento');

      await contractService.createContract({
        sale_id: sale.id,
        submit_datetime: new Date().toISOString(),
        status: 'P',
        due_date: new Date(new Date().setDate(new Date().getDate() + 7))
          .toISOString()
          .split('T')[0],
        key_number: documentKey,
        link: `https://clicksign.com/documents/${documentKey}`,
      });

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
      if (!signerKey) throw new Error('Falha na criação do signatário');

      const addSignerResponse = await axios.post('/api/clicksign/addSignerDocument', {
        signerKey,
        documentKey,
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
      setSnackbarMessage(`Erro ao enviar contrato: ${error.message}`);
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setIsSendingContract(false);
      setSendingContractId(null);
    }
  };

  return {
    sendContract,
    isSendingContract,
    sendingContractId,
    snackbarMessage,
    snackbarSeverity,
    snackbarOpen,
    handleCloseSnackbar,
  };
}
