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

      const projectData = fetchedSale?.projects

      function formatToBRL (value) {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(parseFloat(value))
      }

      function fillDateFields () {
        const today = new Date()
        return {
          dia: String(today.getDate()).padStart(2, '0'),
          mes: String(today.getMonth() + 1).padStart(2, '0'),
          ano: String(today.getFullYear()),
        }
      }

      const dateFields = fillDateFields()
      const data = {
        id_customer: fetchedSale?.customer?.complete_name || '',
        id_first_document: fetchedSale?.customer?.first_document || '',
        id_second_document: '',
        id_customer_address: '',
        id_customer_house: '',
        id_customer_zip: '',
        id_customer_city: '',
        id_customer_locality: '',
        id_customer_state: '',
        quantity_material_1: '',
        quantity_material_2: '',
        quantity_material_3: '',
        id_material_3: '',
        id_material_1: '',
        id_material_2: '',
        watt_pico: '',
        project_value_format: formatToBRL(fetchedSale?.total_value) || '',
        id_payment: '',
        observation_payment: '',
        dia: dateFields.dia,
        mes: dateFields.mes,
        ano: dateFields.ano,
      }

      console.log('Dados preenchidos:', data)

      if (projectData && Array.isArray(projectData)) {
        const projectDetails = projectData.map(project => {
          return {
            projectId: project.id,
            productName: project.product?.name || 'Sem nome do produto',
            description: project.product?.description || 'Sem descrição',
            materials:
              project.product?.materials?.map(material => ({
                materialId: material.material?.id || '',
                name: material.material?.name || 'Nome não especificado',
                amount: material.amount || '',
                price: material.material?.price || '',
              })) || [],
          }
        })

        const fetchedProjectUnit = await unitService.getUnitsByProject(projectDetails[0].projectId)

        console.log('Detalhes do endereço do projeto:', fetchedProjectUnit)

        if (fetchedProjectUnit?.results?.length > 0) {
          const address = fetchedProjectUnit.results[0].address

          data.id_customer_address = address?.street || ''
          data.id_customer_house = address?.number || ''
          data.id_customer_zip = address?.zip_code || ''
          data.id_customer_city = address?.city || ''
          data.id_customer_locality = address?.neighborhood || ''
          data.id_customer_state = address?.state || ''
        }

        console.log('Dados atualizados:', data)
        function formatAmount (amount) {
          return parseFloat(amount).toFixed(0)
        }
        const firstProjectMaterials = projectDetails[0]?.materials || []

        data.quantity_material_1 = formatAmount(firstProjectMaterials[0]?.amount || '0')
        data.id_material_1 = firstProjectMaterials[0]?.name || ''

        data.quantity_material_2 = formatAmount(firstProjectMaterials[1]?.amount || '0')
        data.id_material_2 = firstProjectMaterials[1]?.name || ''

        data.quantity_material_3 = formatAmount(firstProjectMaterials[2]?.amount || '0')
        data.id_material_3 = firstProjectMaterials[2]?.name || ''

        console.log('Dados atualizados:', data)
      } else {
        console.log('Nenhum dado disponível em projects.')
      }

      const TYPE_CHOICES = [
        ["C", "Crédito"],
        ["D", "Débito"],
        ["B", "Boleto"],
        ["F", "Financiamento"],
        ["PI", "Parcelamento interno"],
        ["P", "Pix"],
      ];
      

      const fetchedPayment = await paymentService.getAllPaymentsBySale(sale.id)
      console.log('Dados de pagamento:', fetchedPayment)

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

        console.log('Detalhes dos pagamentos mapeados:', paymentDetails)
      }

      console.log('Dados atualizados:', data)

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
