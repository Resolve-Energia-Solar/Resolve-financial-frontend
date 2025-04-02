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
      if (!sale?.id) {
        console.error('ID da venda não fornecido.');
        setLoading(false);
        return;
      }

      try {
        console.log(`Buscando contratos para venda: ${sale.id}`);
        const contractsResponse = await contractService.index({ sale: sale.id });

        console.log('Contratos retornados:', contractsResponse);

        const contracts = contractsResponse?.results || [];
        setContracts(contracts);

        if (contracts.length === 0) {
          console.warn('Nenhum contrato encontrado para esta venda.');
          return;
        }

        const documentPromises = contracts.map(({ envelope_id, key_number }) =>
          axios
            .get('/api/clicksign/getDocument', {
              params: {
                envelopes: envelope_id,
                documents: key_number,
              },
            })
            .then((response) => response.data)
            .catch((error) => {
              console.error(
                `Erro ao buscar o contrato com chave ${key_number} e envelope_id ${envelope_id}: ${error.message}`,
              );
              return null;
            }),
        );

        const documentResponses = await Promise.all(documentPromises);
        const formattedContracts = documentResponses
          .filter((doc) => doc !== null)
          .map((doc) => ({
            id: doc.data.id,
            filename: doc.data.attributes.filename,
            status: doc.data.attributes.status,
            uploadedAt: doc.data.attributes.created,
            modifiedAt: doc.data.attributes.modified,
            customerName: doc.data.attributes.metadata.customer_name,
            saleNumber: doc.data.attributes.metadata.sale_number,
            originalFileUrl: doc.data.links.files.original,
            signedFileUrl: doc.data.links.files.signed,
            zipedFileUrl: doc.data.links.files.ziped,
          }));

        setContracts(formattedContracts);
      } catch (error) {
        console.error('Erro ao buscar contratos ou metadados do documento:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContractsBySale();
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
        <Typography variant="h4" gutterBottom>
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
              <Grid item xs={12} sm={8} md={9} key={contract.id}>
                <Slide direction="up" in={!loading} mountOnEnter unmountOnExit>
                  <Card sx={{ boxShadow: 3, borderRadius: 2, position: 'relative' }}>
                    <CardContent>
                      <Box
                        sx={{
                          position: 'relative',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="h6">{contract.filename}</Typography>
                        <ContractChip status={contract.status} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Cliente: {contract.customerName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Venda: {contract.saleNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Data de Upload: {new Date(contract.uploadedAt).toLocaleDateString('pt-BR')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Última Modificação:{' '}
                        {new Date(contract.modifiedAt).toLocaleDateString('pt-BR')}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Arquivo Original:{' '}
                          <a
                            href={contract.originalFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Abrir
                          </a>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Arquivo Assinado:{' '}
                          <a
                            href={contract.signedFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Abrir
                          </a>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Arquivo Compactado:{' '}
                          <a href={contract.zipedFileUrl} target="_blank" rel="noopener noreferrer">
                            Abrir
                          </a>
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Fade>
  );
}

export default ContractSubmissions;
