'use client'

import { useState } from 'react'
import saleService from '@/services/saleService'
import axios from 'axios'
import contractService from '@/services/contract-submissions'
import unitService from '@/services/unitService'
import paymentService from '@/services/paymentService'

export default function useSendContract () {
  const [sendingContractId, setSendingContractId] = useState(null)
  const [isSendingContract, setIsSendingContract] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('info')
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const handleCloseSnackbar = () => setSnackbarOpen(false)

  const TYPE_CHOICES = [
    ['C', 'Crédito'],
    ['D', 'Débito'],
    ['B', 'Boleto'],
    ['F', 'Financiamento'],
    ['PI', 'Parcelamento interno'],
    ['P', 'Pix'],
  ]

  const formatToBRL = value =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parseFloat(value))

  const fillDateFields = () => {
    const today = new Date()
    return {
      dia: String(today.getDate()).padStart(2, '0'),
      mes: String(today.getMonth() + 1).padStart(2, '0'),
      ano: String(today.getFullYear()),
    }
  }

  const validateSaleData = sale => {
    const missingFields = []
    if (!sale?.customer?.complete_name) missingFields.push('Nome Completo')
    if (!sale?.customer?.email) missingFields.push('Email')
    if (!sale?.customer?.first_document) missingFields.push('Documento')
    if (!sale?.customer?.birth_date) missingFields.push('Data de Nascimento')
    if (
      !sale?.customer?.phone_numbers?.[0]?.phone_number ||
      !sale?.customer?.phone_numbers?.[0]?.area_code
    ) {
      missingFields.push('Telefone')
    }
    return missingFields
  }

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

      const missingFields = validateSaleData(fetchedSale)
      if (missingFields.length > 0) {
        setSnackbarMessage(
          `Os seguintes campos obrigatórios estão faltando: ${missingFields.join(', ')}`,
        )
        setSnackbarSeverity('warning')
        setSnackbarOpen(true)
        return
      }

      const dateFields = fillDateFields()
      const data = {
        id_customer: fetchedSale.customer.complete_name,
        id_first_document: fetchedSale.customer.first_document,
        project_value_format: formatToBRL(fetchedSale.total_value),
        observation_payment: '',
        dia: dateFields.dia,
        mes: dateFields.mes,
        ano: dateFields.ano,
      }

      const projectData = fetchedSale?.projects || []

      if (projectData.length > 0) {
        const project = projectData[0]

        const fetchedProjectUnit = await unitService.getUnitsByProject(project.id)

        const address = fetchedProjectUnit?.results?.[0]?.address || {}

        Object.assign(data, {
          id_customer_address: address.street || '',
          id_customer_house: address.number || '',
          id_customer_zip: address.zip_code || '',
          id_customer_city: address.city || '',
          id_customer_locality: address.neighborhood || '',
          id_customer_state: address.state || '',
        })

        const materials = project.product?.materials || []
        const ProductKWP = project.product?.params
        data.id_product_kwp = ProductKWP || ''

        if (materials.length > 0) {
          materials.forEach((material, index) => {
            data[`quantity_material_${index + 1}`] = parseFloat(material.amount).toFixed(0) || ''
            data[`id_material_${index + 1}`] = material.material?.name || ''
          })
        }
      }

      const fetchedPayment = await paymentService.getAllPaymentsBySale(sale.id)
      if (fetchedPayment?.results?.length > 0) {
        const paymentDetails = fetchedPayment.results.map(payment => ({
          type:
            TYPE_CHOICES.find(choice => choice[0] === payment.payment_type)?.[1] ||
            'Tipo não especificado',
          value: formatToBRL(payment.value),
        }))

        data.observation_payment = paymentDetails
          .map(payment => `${payment.type}: ${payment.value}`)
          .join(' | ')
      }

      const base64Response = await axios.post('/api/document/base64', data)
      const base64File = base64Response.data?.pdfBase64
      if (!base64File) throw new Error('Falha na conversão do arquivo em Base64')

      const path = `/Contratos/Contrato-${fetchedSale.customer.complete_name}.pdf`
      const documentResponse = await axios.post('/api/clicksign/createDocument', {
        content_base64: base64File,
        path,
      })

      const documentKey = documentResponse.data?.document?.key
      if (!documentKey) throw new Error('Falha na criação do documento')

      const signerResponse = await axios.post('/api/clicksign/createSigner', {
        documentation: fetchedSale.customer.first_document,
        birthday: fetchedSale.customer.birth_date,
        phone_number: `${fetchedSale.customer.phone_numbers[0]?.area_code || ''}${
          fetchedSale.customer.phone_numbers[0]?.phone_number || ''
        }`,
        email: fetchedSale.customer.email,
        name: fetchedSale.customer.complete_name,
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
