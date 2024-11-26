'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Fade,
  Slide,
} from '@mui/material';
import axios from 'axios';
import contractService from '@/services/contract-submissions';

function ContractSubmissions({ sale }) {
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState([]);


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
          console.log('contratos', contracts);
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
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
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
            {contracts.map((contract, index) => (
              <Grid item xs={12} sm={6} md={4} key={contract.key}>
                <Slide direction="up" in={!loading} mountOnEnter unmountOnExit>
                  <Card
                    sx={{
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.05)' },
                      boxShadow: 3,
                      borderRadius: 2,
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">{contract.document?.filename}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Data de Upload:{' '}
                        {new Date(contract.document?.uploaded_at).toLocaleDateString('pt-BR')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {contract.document?.status}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Data de Vencimento:{' '}
                        {new Date(contract.document?.deadline_at).toLocaleDateString('pt-BR')}
                      </Typography>
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
