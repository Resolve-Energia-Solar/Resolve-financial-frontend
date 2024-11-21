import { useState, useEffect } from 'react'
import proposalService from '@/services/proposalService'
import { useSelector } from 'react-redux'

const useProposalForm = (initialData, id) => {
  const user = useSelector(state => state.user?.user)

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
        due_date: initialData.due_date || null,
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
    const formattedValue = parseFloat(formData.value)

    const dataToSend = {
      ...formData,
      lead_id: selectedLead,
      created_by_id: formData.created_by_id,
      due_date: formData.due_date,
      value: formattedValue,
      status: formData.status,
      observation: formData.observation,
      products_id: selectedKitIds,
    };
    

    if (!dataToSend.lead_id) {
      setSnackbar({ open: true, message: 'O campo "Lead" é obrigatório.', severity: 'warning' })
      return
    }
    if (dataToSend.products_id.length === 0) {
      setSnackbar({
        open: true,
        message: 'Selecione pelo menos um kit para a proposta.',
        severity: 'warning',
      })
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

  const handleUpdate = async (id, selectedLead, selectedKitIds, handleCloseForm) => {
    const dataToSend = {
      ...formData,
      lead_id: selectedLead,
      created_by_id: formData.created_by_id,
      due_date: formData.due_date,
      value: formData.value,
      status: formData.status,
      observation: formData.observation,
      products_id: selectedKitIds,
    };
  
    if (!dataToSend.lead_id) {
      setSnackbar({ open: true, message: 'O campo "Lead" é obrigatório.', severity: 'warning' });
      return;
    }
    if (!dataToSend.products_id || dataToSend.products_id.length === 0) {
      setSnackbar({
        open: true,
        message: 'Selecione pelo menos um kit para a proposta.',
        severity: 'warning',
      });
      return;
    }
  
    try {
      await proposalService.updateProposal(id, dataToSend);
      setFormErrors({});
      setSuccess(true);
      setSnackbar({ open: true, message: 'Proposta atualizada com sucesso!', severity: 'success' });
      if (handleCloseForm) {
        setTimeout(() => {
          handleCloseForm();
        }, 4000);
      }
    } catch (err) {
      setSuccess(false);
      setFormErrors(err.response?.data || {});
      setSnackbar({ open: true, message: 'Erro ao atualizar proposta.', severity: 'error' });
      console.error(err.response?.data || err);
    }
  };
  
  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  return {
    formData,
    handleChange,
    handleSave,
    handleUpdate,
    formErrors,
    success,
    setFormData,
    snackbar,
    closeSnackbar,
  }
}

export default useProposalForm
