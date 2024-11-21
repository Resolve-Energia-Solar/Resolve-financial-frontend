"use client";

import { useEffect, useState } from "react";
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
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Loading from "@/app/loading";
import { LoadingButton } from "@mui/lab";


const RequestCE = () => {

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState();
  const [selectedValues, setSelectedValues] = useState([]);
  const [situationOptions, setSituationOptions] = useState([])

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setFormData(item);
    setIsEditing(false);
    setIsDrawerOpen(true);
    fetchSituations()

  };


  const fetchSituations = async () => {
    try {
      const situationData = await situationEnergyService.index();
      setSituationOptions(situationData.results)
      setSelectedValues(situationData.results);
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

  const handleSave = () => {
    console.log("Dados salvos:", formData);
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
    const fetchData = async () => {
      try {
        const requestConceData = await requestConcessionaireService.index();
        console.log('asdasdasd', requestConceData);


        setLoad(true)
        setRequestData(requestConceData.results)

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    }
    fetchData()
  }, [])


  const handleChangeSituation = (event, newValue) => {
    const values = newValue.map((option) => option.id);
    setSelectedValues(newValue);
    handleInputChange({ target: { name: 'situation', value: values } })
  };

  return (
    <div >
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
                  <TableCell>{`${item.project.project_number} - ${item.project.sale?.customer?.name}`}</TableCell>
                  <TableCell width={'100%'}>
                    {`${item.unit?.address?.zip_code}, ${item.unit?.address.street}, ${item.unit?.address.neighborhood}, ${item.unit?.address?.city} - ${item.unit?.address?.state},  ${item.unit?.address.number}`}
                  </TableCell>
                  <TableCell>{item.type.name}</TableCell>
                  <TableCell>
                    {item.situation.map((situation) => (
                      <div>{situation.name}</div>
                    ))}
                  </TableCell>
                  <TableCell>{item.request_date}</TableCell>
                  <TableCell>{item.conclusion_date}</TableCell>
                  <TableCell>
                    {due_date(item.conclusion_date, item.type.deadline)}
                  </TableCell>
                  <TableCell>{item.protocol_one}</TableCell>
                  <TableCell>{item.protocol_two}</TableCell>
                  <TableCell>{item.status}</TableCell>
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

      {/* Drawer para o painel de detalhes */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={handleCloseDrawer}>
        {selectedItem && situationOptions.length > 0 ? (
          <div style={{ width: 400, padding: "20px" }}>
            <Typography variant="h6" gutterBottom>
              {isEditing ? "Editar Item" : "Detalhes do Item"}
            </Typography>

            <TextField
              label="Endereço"
              name="address_id"
              value={formData.unit.id}
              onChange={handleInputChange}
              fullWidth
              select
              margin="normal"
              disabled
            >

            </TextField>
            <TextField
              label="Projeto"
              name="project"
              value={formData.project.id}
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
              value={formData.request_date}
              type="date"
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Data de Conclusão"
              name="price"
              type="date"
              value={formData.conclusion_date}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
            <TextField
              label="Protocolo Provisório"
              name="protocol_one"
              type="text"
              value={formData.protocol_one}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
            <TextField
              label="Protocolo Permanente"
              name="protocol_two"
              type="text"
              value={formData.protocol_two}
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
              disabled={!isEditing}
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
              value={formData?.user?.name}
              fullWidth
              margin="normal"
              disabled
            />
            <Box mt={4} >
              <Button
                variant="contained"
                color={isEditing ? "secondary" : "primary"}
                onClick={isEditing ? handleSave : handleEditToggle}
                startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                fullWidth
              >
                {isEditing ? "Salvar" : "Editar"}
              </Button>
            </Box>
          </div>
        ) : <Loading />}
      </Drawer>
    </div>
  );
};

export default RequestCE;
