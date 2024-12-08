"use client";

import { useEffect, useState } from "react";

import requestConcessionaireService from "@/services/requestConcessionaireService"
import situationEnergyService from "@/services/situationEnergyService"
import {
  Drawer,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Autocomplete,
} from "@mui/material";

import Loading from "@/app/loading";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "../../layout/shared/breadcrumb/Breadcrumb";
import { CardContent } from "@mui/material";
import BlankCard from "@/app/components/shared/BlankCard";
import DashboardCards from "@/app/components/apps/invoice/components/kpis/DashboardCards";
import ListRequest from "@/app/components/apps/request/ListRequest";
import LateralForm from "@/app/components/apps/request/LateralForm";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Solicitações",
  },
];

const RequestCE = ({ project_id = null }) => {
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

  return (
    <div >
      <PageContainer title="Solicitações da Concessionária de Energia" description="Essa é a Lista de Pagamentos">
        <Breadcrumb title="Solicitações da Concessionária de Energia" items={BCrumb} />
        <BlankCard>
          <CardContent>
            <DashboardCards />
            {
              (load) ? <ListRequest data={requestData} onClick={handleRowClick} /> :
                < Loading />
            }
          </CardContent>
        </BlankCard>
      </PageContainer>
      {/* Drawer para o painel de detalhes */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={handleCloseDrawer}>
        {selectedItem && situationOptions.length > 0 &&
          <LateralForm handleChangeSituation={handleChangeSituation} isEditing={isEditing} formData={formData} due_date={due_date} handleInputChange={handleInputChange} options={situationOptions} multiSelectValues={selectedValues} 
          
          />
        }
      </Drawer>
    </div>
  );
};

export default RequestCE;
