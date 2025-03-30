'use client';
import {
  Grid,
  Typography,
  Box,
  useTheme,
  Button,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from '@mui/material';

import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import LeadInfoHeader from '@/app/components/kanban/Leads/components/HeaderCard';
import { useSelector, useDispatch } from 'react-redux';
import useProposal from '@/hooks/proposal/useProposal';
import { PictureAsPdfTwoTone, TaskAlt, ThumbDownOffAlt } from '@mui/icons-material';
import ProposalService from '@/services/proposalService';
import saleService from '@/services/saleService';

function LeadsViewProposal({ leadId = null, proposalId = null, onClose = null, onRefresh = null }) {
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state.user);

  const { proposalData } = useProposal(proposalId);

  console.log('proposalData: ', proposalData);
  console.log('proposalId: ', proposalId);

  const proposalStatus = {
    A: { label: 'Aceita', color: '#E9F9E6' },
    R: { label: 'Recusada', color: '#FEEFEE' },
    P: { label: 'Pendente', color: '#FFF7E5' },
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleUpdateProposal = async (status) => {
    try {
      if (status === 'A') {
        await saleService.createPreSale({
          lead_id: leadId,
          commercial_proposal_id: proposalId,
        });
      }

      await ProposalService.update(proposalId, { status });

      enqueueSnackbar(`Proposta ${status === 'A' ? 'aceita' : 'recusada'} com sucesso!`, {
        variant: 'success',
      });

      if (onRefresh) onRefresh();
      if (onClose) onClose();
    } catch (error) {
      const errors = error?.response?.data;

      if (typeof errors === 'object' && errors !== null) {
        Object.entries(errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((message) => {
              enqueueSnackbar(`${field}: ${message}`, { variant: 'error' });
            });
          } else {
            enqueueSnackbar(`${field}: ${messages}`, { variant: 'error' });
          }
        });
      } else {
        enqueueSnackbar('Ocorreu um erro inesperado. Tente novamente.', { variant: 'error' });
      }
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <LeadInfoHeader leadId={leadId} />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '18px' }}>
          Contrato - Kit Solar 2034
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '14px' }}>
              Valor da proposta
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '14px', color: '#7E92A2', marginTop: 1 }}>
              {formatCurrency(proposalData?.value || 0)}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '14px' }}>
              Status
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '14px', color: '#7E92A2', marginTop: 1 }}>
              {proposalStatus[proposalData?.status]?.label}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '14px' }}>
              Data do vencimento
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '14px', color: '#7E92A2', marginTop: 1 }}>
              {new Date(proposalData?.due_date).toLocaleDateString('pt-BR')}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card sx={{ borderRadius: '12px', boxShadow: 3, p: 3, minHeight: '300px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src={'/images/svgs/solar-panel-icon-with-circle.png'}
                  alt={'solar panel icon'}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 0,
                    mr: 1,
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{ marginLeft: 3, fontSize: '14px', fontWeight: '800' }}
                >
                  Produtos da Proposta
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800 }}>Produto</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Quantidade</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {proposalData?.products?.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                      </TableRow>
                    ))}
                    {proposalData?.products && proposalData.products.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2}>Nenhum produto vinculado</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      <Grid
        item
        xs={12}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          gap: 2,
        }}
      >
        <Box>
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'transparent',
              color: '#303030',
              p: 1.2,
              border: '1px solid #303030',
              fontSize: '14px',
            }}
            startIcon={<PictureAsPdfTwoTone />}
          >
            <Typography variant="body1">Visualizar PDF</Typography>
          </Button>
        </Box>
        {proposalData?.status === 'P' && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#FFEBE4', color: '#FF532E', fontSize: '14px', p: 1.2 }}
              endIcon={<ThumbDownOffAlt />}
              onClick={() => handleUpdateProposal('R')}
            >
              <Typography variant="body1">Proposta recusada</Typography>
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#FFCC00', color: 'black', fontSize: '14px', p: 1.2 }}
              endIcon={<TaskAlt />}
              onClick={() => handleUpdateProposal('A')}
            >
              <Typography variant="body1">Proposta fechada</Typography>
            </Button>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}

export default LeadsViewProposal;
