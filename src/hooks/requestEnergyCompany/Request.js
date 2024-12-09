import requestConcessionaireService from "@/services/requestConcessionaireService";
import situationEnergyService from "@/services/situationEnergyService";
import { useEffect, useState } from "react";

export default function RequestEnergyCompany() {

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState();
  const [selectedValues, setSelectedValues] = useState([]);
  const [situationOptions, setSituationOptions] = useState([])

  const handleRowClick = async (item) => {
    setFormData(item)
    setSelectedItem(item);
    setSelectedValues(item.situation);
    setIsEditing(false);
    setIsDrawerOpen(true);
    fetchSituations()
  };


  const fetchSituations = async () => {
    try {
      const situationData = await situationEnergyService.index();
      setSituationOptions(situationData.results)

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const dataCreate = await requestConcessionaireService.update(formData.id, {
        status: formData.status,
        company_id: formData.company.id,
        request_date: formData.request_date,
        conclusion_date: formData.conclusion_date,
        type_id: formData.type.id,
        project_id: formData.project.id,
        interim_protocol: formData.interim_protocol,
        final_protocol: formData.final_protocol,
        situation_ids: formData.situation.map((option) => option.id)
      })
      fetchData()
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
    setIsEditing(false);
  };

  const due_date = (datee, days) => {
    const dataAtual = new Date();
    const dataApos7Dias = new Date(datee);
    dataApos7Dias.setDate(dataApos7Dias.getDate() + days);

    return datee;
  };

  const [requestData, setRequestData] = useState();
  const [load, setLoad] = useState(false);

  useEffect(() => {

    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const requestConceData = await requestConcessionaireService.index();

      setLoad(true)
      setRequestData(requestConceData.results)

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  }

  const handleChangeSituation = (event, newValue) => {

    // const values = newValue.map((option) => option.id);
    setSelectedValues(newValue);
    handleInputChange({ target: { name: 'situation', value: newValue } })
  };

  return {
    selectedItem,
    isDrawerOpen,
    isEditing,
    formData,
    selectedValues,
    situationOptions,
    handleChangeSituation,
    requestData,
    load,
    due_date,
    handleSave,
    handleCloseDrawer,
    handleEditToggle,
    handleRowClick,
    handleInputChange
  }

}