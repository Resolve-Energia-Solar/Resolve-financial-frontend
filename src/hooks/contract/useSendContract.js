'use client'

import { useState } from 'react'
import saleService from '@/services/saleService'
import axios from 'axios'
import contractService from '@/services/contract-submissions'

export default function useSendContract () {
  const [sendingContractId, setSendingContractId] = useState(null)
  const [isSendingContract, setIsSendingContract] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('info')
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const handleCloseSnackbar = () => setSnackbarOpen(false)

  const sendContract = async sale => {
    if (!sale?.id) {
      setSnackbarMessage('ID da venda não encontrado.')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
      return
    }

    setSendingContractId(sale.id)
    setIsSendingContract(true)

    try {
      const fetchedSale = await saleService.getSaleById(sale.id)
      console.log('Dados da venda:', fetchedSale)

      const missingFields = []
      if (!fetchedSale?.customer?.complete_name) missingFields.push('Nome Completo')
      if (!fetchedSale?.customer?.email) missingFields.push('Email')
      if (!fetchedSale?.customer?.first_document) missingFields.push('Documento')
      if (!fetchedSale?.customer?.birth_date) missingFields.push('Data de Nascimento')
      if (
        !fetchedSale?.customer?.phone_numbers?.[0]?.phone_number ||
        !fetchedSale?.customer?.phone_numbers?.[0]?.area_code
      )
        missingFields.push('Telefone')

      if (missingFields.length > 0) {
        setSnackbarMessage(
          `Os seguintes campos obrigatórios estão faltando: ${missingFields.join(', ')}`,
        )
        setSnackbarSeverity('warning')
        setSnackbarOpen(true)
        return
      }

      const data = {
        id_customer: fetchedSale?.customer?.complete_name,
        id_first_document: fetchedSale?.customer?.first_document,
        id_second_document: '',
        id_customer_address: '',
        id_customer_house: '',
        id_customer_zip: '',
        id_customer_city: '',
        id_customer_locality: '',
        id_customer_state: '',
        quantity_material_3: '',
        id_material_3: '',
        id_material_1: '',
        id_material_2: '',
        watt_pico: '',
        project_value_format: fetchedSale.total_value,
        id_payment_method: '',
        id_payment_detail: '',
        observation_payment: '',
        dia: '',
        mes: '',
        ano: '',
      }

      const base64Response = await axios.post('/api/document/base64', data)

      const base64File = base64Response.data?.pdfBase64
      if (!base64File) {
        throw new Error('Falha na conversão do arquivo em Base64')
      }
      console.log('Arquivo convertido para Base64')

      const path = `/Contratos/Contrato-${sale?.customer?.complete_name}.pdf`

      const documentResponse = await axios.post('/api/clicksign/createDocument', {
        content_base64: base64File,
        path: path,
      })

      const documentKey = documentResponse.data?.document?.key
      if (!documentKey) throw new Error('Falha na criação do documento')

      const signerResponse = await axios.post('/api/clicksign/createSigner', {
        documentation: fetchedSale?.customer?.first_document,
        birthday: fetchedSale?.customer?.birth_date,
        phone_number: `${fetchedSale?.customer?.phone_numbers[0]?.area_code || ''}${
          fetchedSale?.customer?.phone_numbers[0]?.phone_number || ''
        }`,
        email: fetchedSale?.customer?.email,
        name: fetchedSale?.customer?.complete_name,
        auth: 'whatsapp',
        methods: { selfie_enabled: false, handwritten_enabled: false },
      })

      const signerKey = signerResponse.data?.signer?.key
      if (!signerKey) throw new Error('Falha na criação do signatário')

      const addSignerResponse = await axios.post('/api/clicksign/addSignerDocument', {
        signerKey,
        documentKey,
        signAs: 'contractor',
      })

      const requestSignatureKey = addSignerResponse.data?.list?.request_signature_key
      if (!requestSignatureKey) throw new Error('Falha ao adicionar o signatário ao documento')

      await contractService.createContract({
        sale_id: sale.id,
        submit_datetime: new Date().toISOString(),
        status: 'P',
        due_date: new Date(new Date().setDate(new Date().getDate() + 7))
          .toISOString()
          .split('T')[0],
        key_number: documentKey,
        request_signature_key: requestSignatureKey,
        link: `https://clicksign.com/documents/${documentKey}`,
      })

      await axios.post('/api/clicksign/notification/email', {
        request_signature_key: requestSignatureKey,
        message: 'Por favor, assine o contrato.',
      })

      await axios.post('/api/clicksign/notification/whatsapp', {
        request_signature_key: requestSignatureKey,
      })

      setSnackbarMessage('Contrato enviado com sucesso!')
      setSnackbarSeverity('success')
    } catch (error) {
      setSnackbarMessage(`Erro ao enviar contrato: ${error.message}`)
      setSnackbarSeverity('error')
    } finally {
      setSnackbarOpen(true)
      setIsSendingContract(false)
      setSendingContractId(null)
    }
  }

  return {
    sendContract,
    isSendingContract,
    sendingContractId,
    snackbarMessage,
    snackbarSeverity,
    snackbarOpen,
    handleCloseSnackbar,
  }
}
