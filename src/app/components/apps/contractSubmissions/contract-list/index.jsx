'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Fade,
  Slide,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  CardActions,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import axios from 'axios';
import contractService from '@/services/contract-submissions';
import ContractChip from '../components/contractChip';
import EventsTimeline from '../components/EventsTimeline';

function ContractSubmissions({ sale }) {
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);

  const [openEventsModal, setOpenEventsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState([]);

  const openModalEvents = (events) => {
    setOpenEventsModal(true);
    setSelectedEvent(events);
    handleMenuClose();
  };

  const closeModalEvents = () => {
    setOpenEventsModal(false);
    setSelectedEvent([]);
  };

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event, contract) => {
    setAnchorEl(event.currentTarget);
    setSelectedContract(contract);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContract(null);
  };

  useEffect(() => {
    const fetchContractsBySale = async () => {
      try {
        console.log(`Buscando contratos para venda: ${sale?.id}`);
        const contractsResponse = await contractService.getContractsBySaleId(sale?.id);

        console.log('Contratos retornados:', contractsResponse);
        setContracts(contractsResponse.results || []);

        if (contractsResponse.results && contractsResponse.results.length > 0) {
          const documentKeys = contractsResponse.results.map((contract) => contract.key_number);

          const documentPromises = documentKeys.map((key) =>
            axios.get(`/api/clicksign/getDocument/${key}`).catch((error) => {
              console.error(`Erro ao buscar o contrato com chave ${key}:`, error.message);
              return null;
            }),
          );
          const documentResponses = await Promise.all(documentPromises);
          const documentData = documentResponses
            .filter((response) => response !== null)
            .map((response) => response.data);

          console.log('Dados de documentos:', documentData);
          setContracts(documentData);
        }
      } catch (error) {
        console.error('Erro ao buscar contratos ou metadados do documento:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (sale?.id) {
      fetchContractsBySale();
    } else {
      console.error('ID da venda não fornecido.');
      setLoading(false);
    }
  }, [sale?.id]);

  if (loading) {
    return (
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card elevation={10}>
              <CardContent>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="rectangular" width="100%" height={10} sx={{ mt: 2 }} />
              </CardContent>
              <CardActions disableSpacing sx={{ justifyContent: 'flex-end', display: 'flex' }}>
                <Skeleton variant="circular" width={24} height={24} />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Fade in={!loading}>
      <Box sx={{ p: 3 }}>
        <Typography mb={5} variant="h4" gutterBottom>
          Envios para Clicksign
        </Typography>

        {contracts.length === 0 ? (
          <Box textAlign="center" mt={10} mb={5}>
            <Typography variant="body1" color="text.secondary">
              Sem envios disponíveis.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {contracts.map((contract) => (
              <Grid item xs={12} sm={6} md={4} key={contract.key}>
                <Slide direction="up" in={!loading} mountOnEnter unmountOnExit>
                  <Card
                    sx={{
                      position: 'relative',
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.05)' },
                      boxShadow: 3,
                      borderRadius: 2,
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box>
                          <Typography variant="h6">{contract.document?.filename}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Data de Upload:{' '}
                            {new Date(contract.document?.uploaded_at).toLocaleDateString('pt-BR')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Data de Vencimento:{' '}
                            {new Date(contract.document?.deadline_at).toLocaleDateString('pt-BR')}
                          </Typography>
                        </Box>
                        <ContractChip status={contract.document?.status} />
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Link para visualização:{' '}
                          <a
                            href={contract.document?.downloads?.original_file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#1976d2', textDecoration: 'none' }}
                          >
                            Abrir Contrato
                          </a>
                        </Typography>

                        <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'flex-end' }}>
                          <Tooltip title="Mais opções">
                            <IconButton
                              size="small"
                              onClick={(event) => handleMenuOpen(event, contract)}
                            >
                              <MoreVert />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Submenu */}
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => openModalEvents(selectedContract?.document?.events || [])}
          >
            Eventos
          </MenuItem>
        </Menu>

        <Dialog open={openEventsModal} onClose={closeModalEvents} maxWidth="lg">
          <DialogTitle sx={{ textAlign: 'center' }}>Eventos</DialogTitle>
          <DialogContent>
            <EventsTimeline events={selectedEvent} />
          </DialogContent>
        </Dialog>
      </Box>
    </Fade>
  );
}

export default ContractSubmissions;
