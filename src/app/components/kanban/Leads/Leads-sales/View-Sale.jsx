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
  Paper,
  TableRow,
} from '@mui/material';

import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import LeadInfoHeader from '@/app/components/kanban/Leads/components/HeaderCard';
import { useSelector, useDispatch } from 'react-redux';
import useProposal from '@/hooks/proposal/useProposal';
import { PictureAsPdfTwoTone, TaskAlt, ThumbDownOffAlt } from '@mui/icons-material';
import ProposalService from '@/services/proposalService';

function LeadsViewSale({ leadId = null, proposalId = null, onClose=null, onRefresh=null }) {
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { proposalData } = useProposal(proposalId);

  const proposalStatus = {
    "A": { label: "Aceita", color: "#E9F9E6" },
    "R": { label: "Recusada", color: "#FEEFEE" },
    "P": { label: "Pendente", color: "#FFF7E5" },
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleUpdateProposal = async (status) => {
    try {
      await ProposalService.updateProposalPartial(proposalId, { status });
      enqueueSnackbar(`Proposta ${status === 'A' ? 'aceita' : 'recusada'} com sucesso!`, { variant: 'success' });
      if (onRefresh) onRefresh();
      if (onClose) onClose();
    } catch (error) {
      enqueueSnackbar('Erro ao atualizar a proposta.', { variant: 'error' });
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <LeadInfoHeader leadId={leadId} tabValue={20} />
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


      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, gap: 2 }}>
        <Box>
          <Button variant="contained" sx={{
            backgroundColor: 'transparent', color: '#303030', p: 1.2, border: '1px solid #303030', fontSize: '14px',
          }} startIcon={<PictureAsPdfTwoTone />}>
            <Typography variant="body1">Visualizar PDF</Typography>
          </Button>
        </Box>
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
      </Grid>
    </Grid>
  );
}

export default LeadsViewSale;
