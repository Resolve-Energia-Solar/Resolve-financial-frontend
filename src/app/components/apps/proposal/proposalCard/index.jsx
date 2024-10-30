import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Tooltip,
  IconButton,
  useTheme,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EditIcon from '@mui/icons-material/Edit';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import BadgeIcon from '@mui/icons-material/Badge';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import StatusChip from '../DocumentStatusIcon/index';

export default function ProposalCard({ proposal, handleEditProposal }) {
  const theme = useTheme();

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
                  proposal.status === 'A' ? theme.palette.success.main : 
                  proposal.status === 'P' ? theme.palette.warning.main : 
                  theme.palette.error.main,
                mr: 1,
              }}
            />
            <Typography variant="body1">
              Status: <StatusChip status={proposal.status} />
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <EventIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
            <Typography variant="body1">
              Prazo para Aceitação: {proposal.due_date ? new Date(proposal.due_date).toLocaleDateString('pt-BR') : 'N/A'}
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
                onClick={() => handleEditProposal(proposal)}
              >
                <AddShoppingCartIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Ver Proposta">
              <IconButton
                color="primary"
                onClick={() => console.log('Gerar proposta')}
                sx={{
                  borderRadius: '8px',
                  padding: '8px',
                }}
              >
                <DescriptionIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}
