import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Tooltip,
  IconButton,
  useTheme,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EditIcon from '@mui/icons-material/Edit';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import BadgeIcon from '@mui/icons-material/Badge';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CreateSale from '../../leads/Add-lead';
import ProposalStatusChip from '../components/ProposalStatusChip';

export default function ProposalCard({ proposal, handleEditProposal, onAddSale }) {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [proposalHTML, setProposalHTML] = useState('');
  const [error, setError] = useState(null);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setProposalHTML('');
  };

  const handleOpenCreateSale = () => {
    setCreateModalOpen(true);
  };

  const handleGenerateProposal = async (proposal) => {
    try {
      const response = await fetch('/api/proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: proposal.lead?.name || 'N/A',
          seller: proposal.lead.seller?.complete_name || 'N/A',
          total_value: proposal.value
            ? new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(proposal.value)
            : 'N/A',
          due_date: proposal.due_date
            ? new Date(proposal.due_date).toLocaleDateString('pt-BR')
            : 'N/A',
          status: proposal.status,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar proposta');
      }

      const data = await response.text();
      setProposalHTML(data);
      setDialogOpen(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erro ao gerar proposta');
    }
  };

  return (
    <Grid item xs={12} key={proposal.id}>
      <Card
        variant="outlined"
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: theme.palette.background.paper,
          borderLeft: `5px solid ${
            proposal.status === 'F' ? theme.palette.success.main : theme.palette.warning.main
          }`,
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <PersonIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
            <Typography variant="h6" gutterBottom>
              Cliente: {proposal.lead?.name || 'N/A'}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <BadgeIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
            <Typography variant="body1">
              Vendedor: {proposal.lead.seller?.complete_name || 'N/A'}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <AttachMoneyIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
            <Typography variant="body1">
              Valor Total:{' '}
              {proposal.value
                ? new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(proposal.value)
                : 'N/A'}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <AssignmentTurnedInIcon
              sx={{
                color:
                  proposal.status === 'A'
                    ? theme.palette.success.main
                    : proposal.status === 'P'
                    ? theme.palette.warning.main
                    : theme.palette.error.main,
                mr: 1,
              }}
            />
            <Typography variant="body1">
              Status: <ProposalStatusChip status={proposal.status} />
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <EventIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
            <Typography variant="body1">
              Prazo para Aceitação:{' '}
              {proposal.due_date ? new Date(proposal.due_date).toLocaleDateString('pt-BR') : 'N/A'}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Tooltip title="Editar Proposta">
              <IconButton
                variant="outlined"
                color="primary"
                onClick={() => handleEditProposal(proposal)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Criar Venda">
              <IconButton
                variant="outlined"
                color="primary"
                onClick={() => onAddSale(proposal)}
              >
                <AddShoppingCartIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Ver Proposta">
              <IconButton
                color="primary"
                onClick={() => handleGenerateProposal(proposal)}
                sx={{
                  borderRadius: '8px',
                  padding: '8px',
                }}
              >
                <DescriptionIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
            <DialogTitle>Nova Venda</DialogTitle>
            <DialogContent>
              <CreateSale onClosedModal={() => setCreateModalOpen(false)} />
            </DialogContent>
          </Dialog>

          <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md">
            <DialogTitle>Proposta Gerada</DialogTitle>
            <DialogContent>
              {error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: proposalHTML }} />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Fechar
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </Grid>
  );
}
