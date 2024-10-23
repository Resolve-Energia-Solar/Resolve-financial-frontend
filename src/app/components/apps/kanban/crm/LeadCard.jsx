import { Paper, Box, Typography, useTheme } from '@mui/material';
import { Email, Phone, AccessTime, TagSharp } from '@mui/icons-material';

const LeadCard = ({ lead, handleLeadClick }) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: theme.palette.background.paper,
        transition: 'background-color 0.2s ease',
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
        cursor: 'pointer',
        boxShadow: theme.shadows[1],
      }}
      onClick={() => handleLeadClick(lead)}
    >
      <Box display="flex" justifyContent="space-between" flexDirection={'column'}>
        <Typography variant="body2" fontWeight={600} color={theme.palette.text.primary}>
          {lead.name}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mt={1}>
        <TagSharp sx={{ fontSize: '1rem', color: theme.palette.text.secondary, mr: 1 }} />
        <Typography variant="body2" color="textSecondary">
          Origem: {lead.origem}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mt={1}>
        <Email sx={{ fontSize: '1rem', color: theme.palette.text.secondary, mr: 1 }} />
        <Typography variant="body2" color={theme.palette.text.primary}>
          {lead.contact_email}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mt={1}>
        <Phone sx={{ fontSize: '1rem', color: theme.palette.text.secondary, mr: 1 }} />
        <Typography variant="body2" color={theme.palette.text.primary}>
          {lead.phone}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mt={1}>
        <AccessTime sx={{ fontSize: '1rem', color: theme.palette.text.secondary, mr: 1 }} />
        <Typography variant="body2" color="textSecondary">
          Criado em: {new Date(lead.created_at).toLocaleDateString('pt-BR')}
        </Typography>
      </Box>
    </Paper>
  );
};

export default LeadCard;
