import { useState, useEffect } from 'react';

const useLeadManager = (initialLeads = [], initialStatuses = [], { onUpdateLead, onAddLead, onDeleteLead, onUpdateLeadColumn }) => {
  const [leadStars, setLeadStars] = useState({});
  const [selectedLead, setSelectedLead] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
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
    seller: '',
    sdr: '',
    addresses: [],
    column: {
      name: '',
    },
  });
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [leadsList, setLeadsList] = useState(initialLeads);
  const [statusesList, setStatusesList] = useState(initialStatuses);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [sdrs, setSdrs] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setLeadsList(initialLeads);
    setStatusesList(initialStatuses);
  }, [initialLeads, initialStatuses]);

  const handleUpdateLead = async () => {
    if (selectedLead) {
      const updatedLead = {
        ...selectedLead,
        ...leadData,
        column: selectedLead.column.id,
        seller: leadData.seller || null,
        sdr: leadData.sdr || null,
        addresses: leadData.addresses || [],
      };

      try {
        await onUpdateLead(updatedLead);
        setLeadsList((prevLeads) =>
          prevLeads.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead)),
        );
        setSnackbarMessage('Lead atualizado com sucesso!');
        setSnackbarOpen(true);
        handleCloseModal();
      } catch (error) {
        setSnackbarMessage('Erro ao atualizar lead.');
        setSnackbarOpen(true);
        console.error('Erro ao atualizar lead:', error);
      }
    }
  };

  const handleUpdateColumnName = async (statusId, newColumnName) => {
    try {
      await onUpdateLeadColumn(statusId, newColumnName);
      setStatusesList((prevStatuses) =>
        prevStatuses.map((status) =>
          status.id === statusId ? { ...status, name: newColumnName } : status,
        ),
      );
      setSnackbarMessage('Coluna atualizada com sucesso!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erro ao atualizar a coluna:', error);
      setSnackbarMessage('Erro ao atualizar a coluna.');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteLead = async () => {
    if (selectedLead) {
      try {
        await onDeleteLead(selectedLead.id);
        setLeadsList((prevLeads) => prevLeads.filter((lead) => lead.id !== selectedLead.id));
        setSnackbarMessage('Lead excluído com sucesso!');
        setSnackbarOpen(true);
        handleCloseModal();
      } catch (error) {
        setSnackbarMessage('Erro ao excluir lead.');
        setSnackbarOpen(true);
      }
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      try {
        await onUpdateLeadColumn(draggableId, destination.droppableId);
        setLeadsList((prevLeads) =>
          prevLeads.map((lead) =>
            lead.id === parseInt(draggableId)
              ? { ...lead, columns: parseInt(destination.droppableId) }
              : lead,
          ),
        );
        setSnackbarMessage('Lead movido com sucesso!');
        setSnackbarOpen(true);
      } catch (error) {
        setSnackbarMessage('Erro ao mover o lead.');
        setSnackbarOpen(true);
      }
    }
  };

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    setLeadData({
      name: lead.name,
      contact_email: lead.contact_email,
      phone: lead.phone,
      byname: lead.byname || '',
      first_document: lead.first_document || '',
      second_document: lead.second_document || '',
      birth_date: lead.birth_date || '',
      gender: lead.gender || '',
      origin: lead.origin || '',
      type: lead.type || '',
      seller: lead.seller?.id || '',
      sdr: lead.sdr?.id || '',
      addresses: lead.addresses || [],
      column: {
        name: lead.column?.name || 'N/A',
      },
    });

    setTabIndex(0);
    setOpenModal(true);
  };

  return {
    leadsList,
    statusesList,
    leadData,
    setLeadData,
    selectedLead,
    setSelectedLead,
    openModal,
    setOpenModal,
    editMode,
    setEditMode,
    snackbarMessage,
    snackbarOpen,
    setSnackbarOpen,
    handleUpdateLead,
    handleUpdateColumnName,
    handleDeleteLead,
    onDragEnd,
    handleLeadClick,
    setTabIndex,
    tabIndex,
  };
};

export default useLeadManager;
