import leadService from '@/services/leadService'
import { useState, useEffect } from 'react'

const useLeadManager = (
  initialLeads = [],
  initialStatuses = [],
  { onDeleteLead, onUpdateLeadColumn },
) => {
  const [leadStars, setLeadStars] = useState({})
  const [selectedLead, setSelectedLead] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [leadData, setLeadData] = useState({
    name: '',
    contact_email: '',
    phone: '',
    byname: '',
    first_document: '',
    second_document: '',
    birth_date: '',
    gender: '',
    origin: '',
    type: '',
    seller: [],
    sdr: [],
    addresses: [],
    column: {
      name: '',
    },
  })
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [leadsList, setLeadsList] = useState(initialLeads)
  const [statusesList, setStatusesList] = useState(initialStatuses)

  const [tabIndex, setTabIndex] = useState(0)

  useEffect(() => {
    setLeadsList(initialLeads)
    setStatusesList(initialStatuses)
  }, [initialLeads, initialStatuses])


  const handleUpdateColumnName = async (statusId, newColumnName) => {
    try {
      await onUpdateLeadColumn(statusId, newColumnName)
      setStatusesList(prevStatuses =>
        prevStatuses.map(status =>
          status.id === statusId ? { ...status, name: newColumnName } : status,
        ),
      )
      setSnackbarMessage('Coluna atualizada com sucesso!')
      setSnackbarOpen(true)
    } catch (error) {
      console.error('Erro ao atualizar a coluna:', error)
      setSnackbarMessage('Erro ao atualizar a coluna.')
      setSnackbarOpen(true)
    }
  }

  const handleDeleteLead = async () => {
    if (selectedLead) {
      try {
        await onDeleteLead(selectedLead.id)
        setLeadsList(prevLeads => prevLeads.filter(lead => lead.id !== selectedLead.id))
        setSnackbarMessage('Lead excluído com sucesso!')
        setSnackbarOpen(true)
      } catch (error) {
        setSnackbarMessage('Erro ao excluir lead.')
        setSnackbarOpen(true)
      }
    }
  }

  const onDragEnd = async result => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId !== destination.droppableId) {
      const leadId = parseInt(draggableId)
      const destinationColumnId = parseInt(destination.droppableId)

      setLeadsList(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId
            ? { ...lead, column: { ...lead.column, id: destinationColumnId } }
            : lead,
        ),
      )

      try {
        await leadService.patchLead(leadId, {
          column_id: destinationColumnId,
        })

        setSnackbarMessage('Lead movido com sucesso!')
        setSnackbarOpen(true)
      } catch (error) {
        console.error('Erro ao mover o lead:', error)
        setSnackbarMessage('Erro ao mover o lead.')
        setSnackbarOpen(true)

        setLeadsList(prevLeads =>
          prevLeads.map(lead =>
            lead.id === leadId
              ? { ...lead, column: { ...lead.column, id: source.droppableId } }
              : lead,
          ),
        )
      }
    }
  }

  const handleLeadClick = async lead => {
    try {
      const leadBody = await leadService.getLeadById(lead.id)

      setSelectedLead({
        ...leadBody,
      })

      setLeadData({
        id: leadBody.id,
        name: leadBody.name,
        type: leadBody.type || '',
        byname: leadBody.byname || '',
        first_document: leadBody.first_document || '',
        second_document: leadBody.second_document || '',
        birth_date: leadBody.birth_date || '',
        gender: leadBody.gender || '',
        contact_email: leadBody.contact_email || '',
        phone: leadBody.phone || '',
        origin: leadBody.origin || '',
        funnel: leadBody.funnel || '',
        created_at: leadBody.created_at || '',
        addresses_ids: leadBody.addresses.map(addr => addr.id) || [],
        column: leadBody.column?.name || 'N/A',
        seller_id: leadBody.seller_id || null,
        sdr_id: leadBody.sdr_id || null,
        column_id: leadBody.column_id || null,
      })

      setTabIndex(0)
      setOpenModal(true)
    } catch (error) {
      console.error('Erro ao buscar os dados do lead:', error)
    }
  }

  return {
    leadsList,
    statusesList,
    leadData,
    setLeadData,
    selectedLead,
    setSelectedLead,
    openModal,
    setOpenModal,
    snackbarMessage,
    snackbarOpen,
    setSnackbarOpen,
    handleUpdateColumnName,
    handleDeleteLead,
    onDragEnd,
    handleLeadClick,
    setTabIndex,
    tabIndex,
    setSnackbarMessage
  }
}

export default useLeadManager
