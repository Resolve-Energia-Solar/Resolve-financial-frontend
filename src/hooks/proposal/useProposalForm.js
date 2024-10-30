import { useState, useEffect } from 'react'
import proposalService from '@/services/proposalService'

const useProposalForm = (initialData, id) => {
  const [formData, setFormData] = useState({
    lead_id: null,
    created_by_id: null,
    due_date: null,
    value: null,
    status: null,
    observation: null,
    kits: [],
  })

  const [formErrors, setFormErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    if (initialData) {
      setFormData({
        lead_id: initialData.lead?.id || null,
        created_by_id: initialData.created_by?.id || null,
        due_date: initialData.due_date ? initialData.due_date : null,
        value: initialData.value || null,
        status: initialData.status || null,
        observation: initialData.observation || null,
        kits: initialData.kits || [],
      })
    }
  }, [initialData])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async (selectedLead, selectedKitIds, handleCloseForm) => {
    const dataToSend = {
      ...formData,
      lead_id: selectedLead,
      created_by_id: formData.created_by_id,
      due_date: formData.due_date,
      value: formData.value,
      status: formData.status,
      observation: formData.observation,
      kits: selectedKitIds,
    }

    if (!dataToSend.lead_id) {
      alert('O campo "Lead" é obrigatório.')
      return
    }
    if (dataToSend.kits.length === 0) {
      alert('Selecione pelo menos um kit para a proposta.')
      return
    }

    try {
      await proposalService.createProposal(dataToSend)
      setFormErrors({})
      setSuccess(true)
      setSnackbar({ open: true, message: 'Proposta criada com sucesso!', severity: 'success' })
      if (handleCloseForm) {
        setTimeout(() => {
          handleCloseForm()
        }, 4000)
      }
    } catch (err) {
      setSuccess(false)
      setFormErrors(err.response?.data || {})
      setSnackbar({ open: true, message: 'Erro ao criar proposta.', severity: 'error' })
      console.error(err.response?.data || err)
    }
  }

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  return {
    formData,
    handleChange,
    handleSave,
    formErrors,
    success,
    setFormData,
    snackbar,
    closeSnackbar,
  }
}

export default useProposalForm
