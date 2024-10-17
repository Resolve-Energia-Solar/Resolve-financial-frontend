import addressService from '@/services/addressService';
import leadService from '@/services/leadService';
import userService from '@/services/userService';
import { useState, useEffect } from 'react';

const useLeadManager = (initialLeads = [], initialStatuses = [], {  onDeleteLead, onUpdateLeadColumn }) => {
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
    seller: [],
    sdr: [],
    addresses: [],
    column: {
      name: '',
    },
  });
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [leadsList, setLeadsList] = useState(initialLeads);
  const [statusesList, setStatusesList] = useState(initialStatuses);
  const [sellers, setSellers] = useState([]);
  const [sdrs, setSdrs] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [managers, setManagers] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await addressService.getAddresses();
        setAddresses(response);
        console.log('Endereços recebidos:', response);
      } catch (error) {
        console.error('Erro ao buscar endereços:', error);
      }
    };
  
    fetchAddresses();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getUser();
        const users = response.results || [];

        console.log('Usuários recebidos:', users);

        const filteredSellers = users.filter(user => user.role?.name === 'SELLER');
        const filteredSdrs = users.filter(user => user.role?.name === 'SDR');
        const filteredDesigners = users.filter(user => user.role?.name === 'DESIGNER');
        const filteredManagers = users.filter(user => user.role?.name === 'MANAGER');
        const filteredSupervisors = users.filter(user => user.role?.name === 'SUPERVISOR');

        setSellers(filteredSellers);
        setSdrs(filteredSdrs);
        setDesigners(filteredDesigners);
        setManagers(filteredManagers);
        setSupervisors(filteredSupervisors);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setLeadsList(initialLeads);
    setStatusesList(initialStatuses);
  }, [initialLeads, initialStatuses]);
  

  useEffect(() => {
    setLeadsList(initialLeads);
    setStatusesList(initialStatuses);
  }, [initialLeads, initialStatuses]);

  const handleUpdateLead = async () => {
    if (selectedLead) {
      const updatedLead = {
        name: leadData.name,
        contact_email: leadData.contact_email,
        phone: leadData.phone,
        byname: leadData.byname || null,
        first_document: leadData.first_document || null,
        second_document: leadData.second_document || null,
        birth_date: leadData.birth_date || null,
        gender: leadData.gender || null,
        origin: leadData.origin || null,
        type: leadData.type || null,
        seller_id: typeof leadData.seller === 'number' ? leadData.seller : null,
        sdr_id: typeof leadData.sdr === 'number' ? leadData.sdr : null,
        addresses_ids: Array.isArray(leadData.addresses_ids) ? leadData.addresses_ids : [leadData.addresses_ids], 
        column_id: selectedLead.column?.id || null,
      };
  
      try {
        const response = await leadService.patchLead(selectedLead.id, updatedLead);
  
        setLeadsList((prevLeads) =>
          prevLeads.map((lead) => (lead.id === response.data?.id ? response.data : lead))
        );
  
        setSnackbarMessage('Lead atualizado com sucesso!');
        setSnackbarOpen(true);
      } catch (error) {
        setSnackbarMessage('Erro ao atualizar lead.');
        setSnackbarOpen(true);
        console.error('Erro ao atualizar lead:', error.response?.data || error.message);
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
      const leadId = parseInt(draggableId); 
      const destinationColumnId = parseInt(destination.droppableId); 
  
      setLeadsList((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === leadId
            ? { ...lead, column: { ...lead.column, id: destinationColumnId } }
            : lead
        )
      );
  
      try {
        await leadService.patchLead(leadId, {
          column_id: destinationColumnId,
        });
  
        setSnackbarMessage('Lead movido com sucesso!');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Erro ao mover o lead:', error);
        setSnackbarMessage('Erro ao mover o lead.');
        setSnackbarOpen(true);
  
        setLeadsList((prevLeads) =>
          prevLeads.map((lead) =>
            lead.id === leadId
              ? { ...lead, column: { ...lead.column, id: source.droppableId } }
              : lead
          )
        );
      }
    }
  };
  
  const handleLeadClick = async (lead) => {
    try {
      const leadBody = await leadService.getLeadById(lead.id);
      console.log("Objeto lead completo:", leadBody);
  
      const selectedSeller = leadBody.seller ? sellers.find((seller) => seller.id === leadBody.seller.id) : null;
      const selectedSdr = leadBody.sdr ? sdrs.find((sdr) => sdr.id === leadBody.sdr.id) : null;
  
      console.log("Vendedor selecionado:", selectedSeller);
      console.log("SDR selecionado:", selectedSdr);
  
      setSelectedLead({
        ...leadBody,
        seller: selectedSeller,
        sdr: selectedSdr,
      });
  
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
        seller: selectedSeller?.id || 'N/A',
        sdr: selectedSdr?.id || 'N/A',
        addresses_ids: leadBody.addresses.map(addr => addr.id) || [],  
        column: leadBody.column?.name || 'N/A',
        seller_id: leadBody.seller_id || null,
        sdr_id: leadBody.sdr_id || null,
        column_id: leadBody.column_id || null,
      });
  
      setTabIndex(0);
      setOpenModal(true);
    } catch (error) {
      console.error("Erro ao buscar os dados do lead:", error);
    }
  };
  
  
  
  return {
    leadsList,
    statusesList,
    leadData,
    setLeadData,
    sellers,
    sdrs,
    designers,
    managers,
    supervisors,
    addresses,
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
