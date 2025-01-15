'use client'

import { useState } from 'react'
import saleService from '@/services/saleService'
import unitService from '@/services/unitService'
import Cookies from 'js-cookie'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://crm.resolvenergiasolar.com'

export default function useSendContract () {
  const [sendingContractId, setSendingContractId] = useState(null)
  const [isSendingContract, setIsSendingContract] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('info')
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const handleCloseSnackbar = () => setSnackbarOpen(false)

  const formatToBRL = value =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parseFloat(value))

  const fillDateFields = () => {
    const today = new Date()
    const months = [
      'janeiro',
      'fevereiro',
      'março',
      'abril',
      'maio',
      'junho',
      'julho',
      'agosto',
      'setembro',
      'outubro',
      'novembro',
      'dezembro',
    ]

    return {
      dia: String(today.getDate()).padStart(2, '0'),
      mes: months[today.getMonth()],
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

        const ProductKWP = project.product?.params
        data.watt_pico = ProductKWP || ''
      }

      const requestBody = {
        sale_id: sale.id,
        contract_data: data,
        document_type_id: 10
      }

      console.log('Request Body:', requestBody)
      const accessToken = Cookies.get('access_token')

      const response = await fetch(`${API_BASE_URL}/api/generate-contract/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar o contrato. Por favor, tente novamente.')
      }
      setSnackbarMessage('Contrato enviado com sucesso!')
      setSnackbarSeverity('success')
      setSnackbarOpen(true)
    } catch (error) {
      console.log('Error: ', error)
      setSnackbarMessage(error.message || 'Erro ao enviar o contrato.')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    } finally {
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
