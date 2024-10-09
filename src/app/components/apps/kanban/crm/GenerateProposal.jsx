import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
  IconButton,
  Radio,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

const GenerateProposalModal = ({
  open,
  onClose,
  sellers = [],
  supervisors = [],
  managers = [],
  branches = [],
  campaigns = [],
  lead, // Opcional: Passar o lead selecionado, se necessário
}) => {
  // Dados Mockados
  const mockProjects = [
    { id: 'proj1', name: 'Projeto Alpha', description: 'Descrição do Projeto Alpha' },
    { id: 'proj2', name: 'Projeto Beta', description: 'Descrição do Projeto Beta' },
    { id: 'proj3', name: 'Projeto Gamma', description: 'Descrição do Projeto Gamma' },
  ];

  const mockPaymentMethods = [
    { id: 'pay1', method: 'Cartão de Crédito' },
    { id: 'pay2', method: 'Boleto Bancário' },
    { id: 'pay3', method: 'Transferência Bancária' },
  ];

  const mockAddresses = [
    {
      id: 'addr1',
      street: 'Rua A',
      number: '123',
      city: 'São Paulo',
      state: 'SP',
      zip: '01000-000',
    },
    {
      id: 'addr2',
      street: 'Avenida B',
      number: '456',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zip: '20000-000',
    },
    {
      id: 'addr3',
      street: 'Travessa C',
      number: '789',
      city: 'Belo Horizonte',
      state: 'MG',
      zip: '30000-000',
    },
  ];

  // Estado do formulário
  const [proposalData, setProposalData] = useState({
    nome: '',
    cpf: '',
    data_nascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    rg: '',
    projetos: [], // Lista de IDs de projetos selecionados
    meios_pagamento: [],
    enderecos: [], // Lista de IDs de endereços selecionados
    principalEnderecoId: '', // ID do endereço principal
    principalProjetoId: '', // ID do projeto principal
  });

  // Estado das abas
  const [tabIndex, setTabIndex] = useState(0);

  // Estado para gerenciar os projetos disponíveis
  const [projects, setProjects] = useState(mockProjects);

  // Estado para gerenciar os endereços disponíveis
  const [addresses, setAddresses] = useState(mockAddresses);

  // Estados para adicionar novos meios de pagamento
  const [newPaymentMethod, setNewPaymentMethod] = useState('');

  // Estado para abrir/fechar o diálogo de adicionar endereço
  const [openAddAddressDialog, setOpenAddAddressDialog] = useState(false);

  // Estados para adicionar novo endereço
  const [newAddress, setNewAddress] = useState({
    street: '',
    number: '',
    city: '',
    state: '',
    zip: '',
  });

  // Estado para abrir/fechar o diálogo de adicionar projeto
  const [openAddProjectDialog, setOpenAddProjectDialog] = useState(false);

  // Estados para adicionar novo projeto
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
  });

  // Função para lidar com mudanças nos campos
  const handleInputChange = (field, value) => {
    setProposalData({ ...proposalData, [field]: value });
  };

  // Função para adicionar novo meio de pagamento
  const handleAddPaymentMethod = () => {
    if (newPaymentMethod.trim() === '') return;
    const newMethod = { id: uuidv4(), method: newPaymentMethod };
    setProposalData((prevData) => ({
      ...prevData,
      meios_pagamento: [...prevData.meios_pagamento, newMethod],
    }));
    setNewPaymentMethod('');
  };

  // Função para remover meio de pagamento
  const handleRemovePaymentMethod = (id) => {
    setProposalData((prevData) => ({
      ...prevData,
      meios_pagamento: prevData.meios_pagamento.filter((method) => method.id !== id),
    }));
  };

  // Função para abrir o diálogo de adicionar endereço
  const handleOpenAddAddressDialog = () => {
    setOpenAddAddressDialog(true);
  };

  // Função para fechar o diálogo de adicionar endereço
  const handleCloseAddAddressDialog = () => {
    setOpenAddAddressDialog(false);
    setNewAddress({
      street: '',
      number: '',
      city: '',
      state: '',
      zip: '',
    });
  };

  // Função para adicionar novo endereço
  const handleAddAddress = () => {
    const { street, number, city, state, zip } = newAddress;
    if (
      street.trim() === '' ||
      number.trim() === '' ||
      city.trim() === '' ||
      state.trim() === '' ||
      zip.trim() === ''
    )
      return;
    const newAddr = { id: uuidv4(), street, number, city, state, zip };
    setAddresses((prevAddresses) => [...prevAddresses, newAddr]);
    handleCloseAddAddressDialog();
  };

  // Função para remover endereço
  const handleRemoveAddress = (id) => {
    setAddresses((prevAddresses) => prevAddresses.filter((addr) => addr.id !== id));

    // Também remover do proposalData.enderecos se estava selecionado
    setProposalData((prevData) => ({
      ...prevData,
      enderecos: prevData.enderecos.filter((addrId) => addrId !== id),
      principalEnderecoId:
        prevData.principalEnderecoId === id ? '' : prevData.principalEnderecoId,
    }));
  };

  // Função para abrir o diálogo de adicionar projeto
  const handleOpenAddProjectDialog = () => {
    setOpenAddProjectDialog(true);
  };

  // Função para fechar o diálogo de adicionar projeto
  const handleCloseAddProjectDialog = () => {
    setOpenAddProjectDialog(false);
    setNewProject({
      name: '',
      description: '',
    });
  };

  // Função para adicionar novo projeto
  const handleAddProject = () => {
    const { name, description } = newProject;
    if (name.trim() === '' || description.trim() === '') return;
    const newProj = { id: uuidv4(), name, description };
    setProjects((prevProjects) => [...prevProjects, newProj]);
    handleCloseAddProjectDialog();
  };

  // Função para remover projeto
  const handleRemoveProject = (id) => {
    setProjects((prevProjects) => prevProjects.filter((proj) => proj.id !== id));

    // Também remover do proposalData.projetos se estava selecionado
    setProposalData((prevData) => ({
      ...prevData,
      projetos: prevData.projetos.filter((projId) => projId !== id),
      principalProjetoId:
        prevData.principalProjetoId === id ? '' : prevData.principalProjetoId,
    }));
  };

  // Função para salvar a proposta
  const handleSave = () => {
    console.log('Dados da proposta:', proposalData);
    onClose(); // Fechar o modal após salvar
  };

  // Função para mudar a aba
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Determinar se estamos na última aba
  const isLastTab = tabIndex === 3; // Índice da aba "Rateio"

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle>Gerar Proposta</DialogTitle>
        <DialogContent>
          {/* Abas */}
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            aria-label="Aba de Gerar Proposta"
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Cliente" />
            <Tab label="Projetos" />
            <Tab label="Pagamento" />
            <Tab label="Rateio" />
          </Tabs>
          <Box mt={2}>
            {/* Conteúdo das Abas */}
            {/* Aba Cliente */}
            {tabIndex === 0 && (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nome"
                      value={proposalData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="CPF"
                      value={proposalData.cpf}
                      onChange={(e) => handleInputChange('cpf', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Data de Nascimento"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={proposalData.data_nascimento}
                      onChange={(e) =>
                        handleInputChange('data_nascimento', e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Sexo"
                      value={proposalData.sexo}
                      onChange={(e) => handleInputChange('sexo', e.target.value)}
                    >
                      <MenuItem value="M">Masculino</MenuItem>
                      <MenuItem value="F">Feminino</MenuItem>
                      <MenuItem value="O">Outro</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="E-mail"
                      type="email"
                      value={proposalData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefone"
                      type="tel"
                      value={proposalData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="RG"
                      value={proposalData.rg}
                      onChange={(e) => handleInputChange('rg', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Aba Projetos */}
            {tabIndex === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Projetos
                </Typography>
                <Grid container spacing={2}>
                  {projects.map((project) => (
                    <Grid item xs={12} sm={6} md={4} key={project.id}>
                      <Card
                        variant="outlined"
                        sx={{
                          cursor: 'pointer',
                          borderColor: proposalData.projetos.includes(project.id)
                            ? 'primary.main'
                            : 'grey.300',
                          backgroundColor: proposalData.projetos.includes(project.id)
                            ? 'primary.light'
                            : 'background.paper',
                        }}
                        onClick={() => {
                          if (proposalData.projetos.includes(project.id)) {
                            handleInputChange(
                              'projetos',
                              proposalData.projetos.filter((id) => id !== project.id)
                            );
                          } else {
                            handleInputChange('projetos', [
                              ...proposalData.projetos,
                              project.id,
                            ]);
                          }
                        }}
                      >
                        <CardContent>
                          <Box display="flex" alignItems="center">
                            <Checkbox
                              checked={proposalData.projetos.includes(project.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleInputChange('projetos', [
                                    ...proposalData.projetos,
                                    project.id,
                                  ]);
                                } else {
                                  handleInputChange(
                                    'projetos',
                                    proposalData.projetos.filter((id) => id !== project.id)
                                  );
                                  if (proposalData.principalProjetoId === project.id) {
                                    handleInputChange('principalProjetoId', '');
                                  }
                                }
                              }}
                              color="primary"
                            />
                            <Typography variant="h6">{project.name}</Typography>
                          </Box>
                          <Typography variant="body2" color="textSecondary">
                            {project.description}
                          </Typography>
                          {proposalData.projetos.includes(project.id) && (
                            <Box display="flex" alignItems="center" mt={1}>
                              <Radio
                                checked={proposalData.principalProjetoId === project.id}
                                onChange={() => {
                                  handleInputChange('principalProjetoId', project.id);
                                }}
                                value={project.id}
                                name="principalProjeto"
                                color="primary"
                              />
                              <Typography variant="body2">Projeto Principal</Typography>
                            </Box>
                          )}
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveProject(project.id)}
                            sx={{ mt: 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}

                  {/* Botão para adicionar novo projeto */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleOpenAddProjectDialog}
                      fullWidth
                    >
                      Adicionar Novo Projeto
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Aba Pagamento */}
            {tabIndex === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Meios de Pagamento
                </Typography>
                <Grid container spacing={2}>
                  {proposalData.meios_pagamento.map((method) => (
                    <Grid item xs={12} sm={6} key={method.id}>
                      <Box display="flex" alignItems="center">
                        <TextField
                          select
                          fullWidth
                          label="Meio de Pagamento"
                          value={method.method}
                          onChange={(e) =>
                            setProposalData((prevData) => ({
                              ...prevData,
                              meios_pagamento: prevData.meios_pagamento.map((m) =>
                                m.id === method.id
                                  ? { ...m, method: e.target.value }
                                  : m
                              ),
                            }))
                          }
                        >
                          {mockPaymentMethods.map((pay) => (
                            <MenuItem key={pay.id} value={pay.method}>
                              {pay.method}
                            </MenuItem>
                          ))}
                        </TextField>
                        <IconButton
                          color="error"
                          onClick={() => handleRemovePaymentMethod(method.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                      <TextField
                        select
                        fullWidth
                        label="Adicionar Meio de Pagamento"
                        value={newPaymentMethod}
                        onChange={(e) => setNewPaymentMethod(e.target.value)}
                      >
                        {mockPaymentMethods.map((pay) => (
                          <MenuItem key={pay.id} value={pay.method}>
                            {pay.method}
                          </MenuItem>
                        ))}
                      </TextField>
                      <IconButton
                        color="primary"
                        onClick={handleAddPaymentMethod}
                        sx={{ ml: 1 }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Aba Rateio */}
            {tabIndex === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Endereços
                </Typography>
                <Grid container spacing={2}>
                  {addresses.map((address) => (
                    <Grid item xs={12} sm={6} md={4} key={address.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box display="flex" alignItems="center">
                            <Checkbox
                              checked={proposalData.enderecos.includes(address.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  handleInputChange('enderecos', [
                                    ...proposalData.enderecos,
                                    address.id,
                                  ]);
                                } else {
                                  handleInputChange(
                                    'enderecos',
                                    proposalData.enderecos.filter((id) => id !== address.id)
                                  );
                                  if (proposalData.principalEnderecoId === address.id) {
                                    handleInputChange('principalEnderecoId', '');
                                  }
                                }
                              }}
                              color="primary"
                            />
                            <Typography variant="body1">
                              {`${address.street}, ${address.number} - ${address.city}, ${address.state} (${address.zip})`}
                            </Typography>
                          </Box>
                          {proposalData.enderecos.includes(address.id) && (
                            <Box display="flex" alignItems="center" mt={1}>
                              <Radio
                                checked={proposalData.principalEnderecoId === address.id}
                                onChange={() => {
                                  handleInputChange('principalEnderecoId', address.id);
                                }}
                                value={address.id}
                                name="principalEndereco"
                                color="primary"
                              />
                              <Typography variant="body2">Endereço Principal</Typography>
                            </Box>
                          )}
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveAddress(address.id)}
                            sx={{ mt: 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleOpenAddAddressDialog}
                      fullWidth
                    >
                      Adicionar Novo Endereço
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            disabled={!isLastTab} // Desabilita se não estiver na última aba
          >
            Salvar Proposta
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para adicionar novo endereço */}
      <Dialog
        open={openAddAddressDialog}
        onClose={handleCloseAddAddressDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Adicionar Novo Endereço</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Rua"
                  value={newAddress.street}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, street: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Número"
                  value={newAddress.number}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, number: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Cidade"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="Estado"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="CEP"
                  value={newAddress.zip}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, zip: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddAddressDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleAddAddress} color="primary" variant="contained">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para adicionar novo projeto */}
      <Dialog
        open={openAddProjectDialog}
        onClose={handleCloseAddProjectDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Adicionar Novo Projeto</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome do Projeto"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição do Projeto"
                  multiline
                  rows={4}
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({ ...newProject, description: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddProjectDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleAddProject} color="primary" variant="contained">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GenerateProposalModal;
