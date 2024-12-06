"use client";

import { useEffect, useState } from "react";
import { format, isValid } from 'date-fns';
import requestConcessionaireService from "@/services/requestConcessionaireService"
import situationEnergyService from "@/services/situationEnergyService"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Drawer,
  Typography,
  IconButton,
  TextField,
  Button,
  MenuItem,
  Box,
  Autocomplete,
  Chip,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Loading from "@/app/loading";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "../../layout/shared/breadcrumb/Breadcrumb";
import { CardContent } from "@mui/material";
import BlankCard from "@/app/components/shared/BlankCard";
import DashboardCards from "@/app/components/apps/invoice/components/kpis/DashboardCards";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Solicitações",
  },
];

const RequestCE = ({ project_id=null }) => {
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


  function getStatusRequest(status) {

    let textStatus
    let iconColor

    switch (status) {

      case 'I':
        textStatus = 'Indeferido'
        iconColor = 'error'
        break
      case 'D':
        textStatus = 'Deferido'
        iconColor = 'success'
        break
      case 'S':
        textStatus = 'Solicitado'
        iconColor = 'warning'
        break
    }

    return { textStatus, iconColor }
  }


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
              (load) ? <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Projeto</TableCell>
                      <TableCell>Endereços</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Situação</TableCell>
                      <TableCell>Data de Solicitação</TableCell>
                      <TableCell>Data de Vencimento</TableCell>
                      <TableCell>Data de Conclusão</TableCell>
                      <TableCell>Protocol Provisório</TableCell>
                      <TableCell>Protocol Permanente</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Solicitante</TableCell>
                      <TableCell>Prazo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requestData.map((item) => (
                      <TableRow key={item.id} onClick={() => handleRowClick(item)}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{`${item.project.project_number} - ${item.project.sale?.customer?.complete_name}`}</TableCell>
                        <TableCell >
                          {`${item.unit?.address?.zip_code}, ${item.unit?.address.street}, ${item.unit?.address.neighborhood}, ${item.unit?.address?.city} - ${item.unit?.address?.state},  ${item.unit?.address.number}`}
                        </TableCell>
                        <TableCell>{item.type.name}</TableCell>
                        <TableCell>
                          {item.situation.map((situation) => (
                            <Chip key={item.id} label={situation.name} color={'primary'} sx={{ margin: 0.1 }} />
                          ))}
                        </TableCell>
                        <TableCell>{format(new Date(item.request_date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{format(new Date(item.conclusion_date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>
                          {format(new Date(item.conclusion_date), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>{item.interim_protocol}</TableCell>
                        <TableCell>{item.final_protocol}</TableCell>
                        <TableCell>
                          <Chip label={getStatusRequest(item.status).textStatus} color={getStatusRequest(item.status).iconColor} />
                        </TableCell>
                        <TableCell>{item.user?.name}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleRowClick(item)}>
                            <InfoIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer> :
                <Loading />
            }
          </CardContent>
        </BlankCard>
      </PageContainer>
      {/* Drawer para o painel de detalhes */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={handleCloseDrawer}>
        {selectedItem && situationOptions.length > 0 &&
          <div style={{ width: 400, padding: "20px" }}>
            <Typography variant="h6" gutterBottom>
              {isEditing ? "Editar Item" : "Detalhes do Item"}
            </Typography>

            <TextField
              label="Endereço"
              value={`${formData.unit?.address?.zip_code}, ${formData.unit?.address.street}, ${formData.unit?.address.neighborhood}, ${formData.unit?.address?.city} - ${formData.unit?.address?.state},  ${formData.unit?.address.number}`}
              fullWidth
              margin="normal"
              disabled
            >

            </TextField>
            <TextField
              label="Projeto"
              name="project"
              value={`${formData.project.project_number} | ${formData.project.sale?.customer?.complete_name}`}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled
            />

            <TextField
              select
              label="Tipo da Solicitação"
              name="type_id"
              value={formData.type.id}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled
            >
              <MenuItem value={formData.type.id}>{formData.type.name}</MenuItem>
            </TextField>

            <TextField
              label="Data de Solicitação"
              name="request_date"
              type="date"
              value={formData.request_date}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
            <TextField
              label="Data de Vencimento"
              value={due_date(formData.request_date, formData.type.dea)}
              type="date"
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Data de Conclusão"
              name="conclusion_date"
              type="date"
              value={formData.conclusion_date}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
            <TextField
              label="Protocolo Provisório"
              name="interim_protocol"
              type="text"
              value={formData.interim_protocol}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
            <TextField
              label="Protocolo Permanente"
              name="final_protocol"
              type="text"
              value={formData.final_protocol}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
            <TextField
              label="Status"
              select
              name="status"
              type="text"
              value={formData.status}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled={!isEditing || formData.status != 'S'}
            >
              <MenuItem value="D">Deferido</MenuItem>
              <MenuItem value="I">Indeferido</MenuItem>
              <MenuItem value="S">Solicitado</MenuItem>
            </TextField>
            <Autocomplete
              multiple
              options={situationOptions}
              getOptionLabel={(option) => option.name}
              value={selectedValues}
              onChange={handleChangeSituation}
              disabled={!isEditing}
              renderInput={(params) => (
                <TextField {...params} label="Selecione opções" variant="outlined" />
              )}
            />
            <TextField
              label="Solicitante"
              type="text"
              value={formData?.requested_by?.complete_name}
              fullWidth
              margin="normal"
              disabled
            />
            <Box mt={4} >
              <Button
                variant="contained"
                color={isEditing ? "primary" : "secondary"}
                onClick={isEditing ? handleSave : handleEditToggle}
                startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                fullWidth
              >
                {isEditing ? "Salvar" : "Editar"}
              </Button>
            </Box>
          </div>}
      </Drawer>
    </div>
  );
};

export default RequestCE;
