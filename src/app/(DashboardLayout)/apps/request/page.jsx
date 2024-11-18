"use client";

import { useState } from "react";
import {
  Container,
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
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const requestsType = [
  {
    id: 1,
    name: "Vistoria Final",
  },
  {
    id: 1,
    name: "Parecer de acesso",
  },
];

const data = [
  {
    id: 1,
    project: {
      id: 1,
      project_number: "12254",
      sale: {
        customer: {
          id: 1,
          name: "John Doe",
          email: "mynbi@example.com",
          contract_number: "RES00005",
        },
      },
    },
    branch: {
      id: 1,
      address: {
        id: 1,
        zipcode: "66690720",
        rua: "Manaus",
        bairro: "aguas",
        localidade: "ananindeua",
        estado: "Rio de Janeiro",
        pais: "Brasil",
      },
    },
    type: {
      id: 1,
      name: "Vistorial Equatorial",
      descricao: "Vistorial Equatorial",
      deadline: 7,
    },
    request_date: "2024-11-12",
    due_date: "2024-11-12",
    status: "Solicitado",
    situation: [
      { id: 1, name: "Projeto errado" },
      { id: 2, name: "Projeto errado" },
    ],
    request_id: "",
    completed_at: "2024-11-12",
    protocol_one: "56565658",
    protocol_two: "3475637845",
    user: { id: 1, name: "Max Oliveira" },
  },
  {
    id: 2,
    project: {
      id: 1,
      project_number: "12254",
      sale: {
        customer: {
          id: 1,
          name: "John Doe",
          email: "mynbi@example.com",
          contract_number: "RES00005",
        },
      },
    },
    branch: {
      id: 1,
      address: {
        id: 1,
        zipcode: "66690720",
        rua: "Manaus",
        bairro: "aguas",
        localidade: "ananindeua",
        estado: "Rio de Janeiro",
        pais: "Brasil",
      },
    },
    type: {
      id: 1,
      name: "Vistorial Equatorial",
      descricao: "Vistorial Equatorial",
      deadline: 7,
    },
    request_date: "2024-11-12",
    due_date: "2024-11-12",
    status: "Solicitado",
    situation: [
      { id: 1, name: "Projeto errado" },
      { id: 2, name: "Projeto errado" },
    ],
    request_id: "",
    completed_at: "2024-11-12",
    protocol_one: "",
    protocol_two: "",
    user: { id: 1, name: "Max Oliveira" },
  },
  {
    id: 3,
    project: {
      id: 1,
      project_number: "7545",
      sale: {
        customer: {
          id: 1,
          name: "John Doe",
          email: "mynbi@example.com",
          contract_number: "RES00005",
        },
      },
    },
    branch: {
      id: 1,
      address: {
        id: 1,
        zipcode: "66690720",
        rua: "Manaus",
        bairro: "aguas",
        localidade: "ananindeua",
        estado: "Rio de Janeiro",
        pais: "Brasil",
      },
    },
    type: {
      id: 1,
      name: "Vistorial Equatorial",
      descricao: "Vistorial Equatorial",
      deadline: 7,
    },
    request_date: "2024-11-12",
    due_date: "2024-11-12",
    status: "Solicitado",
    situation: [
      { id: 1, name: "Projeto errado" },
      { id: 2, name: "Projeto errado" },
    ],
    request_id: "",
    completed_at: "2024-11-12",
    protocol_one: "",
    protocol_two: "",
    user: { id: 1, name: "Max Oliveira" },
  },
];

const Request = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState();

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setFormData(item);
    setIsEditing(false);
    setIsDrawerOpen(true);
  };

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

  return (
    <div >
      <TableContainer component={Paper}>
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
            {data.map((item) => (
              <TableRow key={item.id} onClick={() => handleRowClick(item)}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{`${item.project.project_number} - ${item.project.sale.customer.name}`}</TableCell>
                <TableCell>
                  {`${item.branch.address.zipcode}, | ${item.branch.address.localidade}, - ${item.branch.address.rua}, - ${item.branch.address.bairro}`}
                </TableCell>
                <TableCell>{item.type.name}</TableCell>
                <TableCell>
                  {item.situation.map((situation) => (
                    <div>{situation.name}</div>
                  ))}
                </TableCell>
                <TableCell>{item.request_date}</TableCell>
                <TableCell>{item.completed_at}</TableCell>
                <TableCell>
                  {due_date(item.completed_at, item.type.deadline)}
                </TableCell>
                <TableCell>{item.protocol_one}</TableCell>
                <TableCell>{item.protocol_two}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.user.name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleRowClick(item)}>
                    <InfoIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Drawer para o painel de detalhes */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={handleCloseDrawer}>
        {selectedItem && (
          <div style={{ width: 400, padding: "20px" }}>
            <Typography variant="h6" gutterBottom>
              {isEditing ? "Editar Item" : "Detalhes do Item"}
            </Typography>

            <TextField
              label="Endereço"
              name="address_id"
              value={`${formData.branch.address.zipcode} | ${formData.branch.address.localidade} - ${formData.branch.address.rua} - ${formData.branch.address.bairro}`}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled
            />

            <TextField
              label="Tipo da Solicitação"
              name="type_id"
              value={`${formData.project.project_number} - ${formData.project.sale.customer.name}`}
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
              value={formData.completed_at}
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
              fullWidth
              margin="normal"
              disabled={!isEditing}
            >
              <MenuItem value="Deferido">Deferido</MenuItem>
              <MenuItem value="Indeferido">Indeferido</MenuItem>
              <MenuItem value="Solicitado">Solicitado</MenuItem>
            </TextField>
            <TextField
              label="Status"
              select
              name="situation_id"
              type="text"
              value={formData.status}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            >
              <MenuItem value="Deferido">Deferido</MenuItem>
              <MenuItem value="Indeferido">Indeferido</MenuItem>
              <MenuItem value="Solicitado">Solicitado</MenuItem>
            </TextField>
            <TextField
              label="Solicitante"
              type="text"
              value={formData.user.name}
              fullWidth
              margin="normal"
              disabled
            />
            <div style={{ marginTop: "20px" }}>
              <Button
                variant="contained"
                color={isEditing ? "secondary" : "primary"}
                onClick={isEditing ? handleSave : handleEditToggle}
                startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                fullWidth
              >
                {isEditing ? "Salvar" : "Editar"}
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Request;
