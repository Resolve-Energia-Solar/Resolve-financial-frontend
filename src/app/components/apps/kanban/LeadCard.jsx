import { Paper, Box, Typography, IconButton } from '@mui/material';
import { Star, StarBorder, Email, Phone, AccessTime } from '@mui/icons-material';

const LeadCard = ({ lead, leadStars, handleStarClick, handleLeadClick }) => (
  <Paper
    sx={{
      p: 2,
      mb: 2,
      backgroundColor: '#fff',
      transition: 'background-color 0.2s ease',
    }}
    onClick={() => handleLeadClick(lead)}
  >
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h6">{lead.name}</Typography>
      <Box display="flex" alignItems="center">
        {[1, 2, 3, 4, 5].map((star) => (
          <IconButton key={star} size="small" onClick={(e) => handleStarClick(lead.id, star)}>
            {leadStars[lead.id] >= star ? <Star sx={{ color: 'gold', fontSize: '1rem' }} /> : <StarBorder sx={{ color: 'grey', fontSize: '1rem' }} />}
          </IconButton>
        ))}
      </Box>
    </Box>
    <Box display="flex" alignItems="center" mt={1}>
      <Email sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
      <Typography variant="body2">{lead.contact_email}</Typography>
    </Box>
    <Box display="flex" alignItems="center" mt={1}>
      <Phone sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
      <Typography variant="body2">{lead.phone}</Typography>
    </Box>
    <Box display="flex" alignItems="center" mt={1}>
      <AccessTime sx={{ fontSize: '1rem', color: 'grey', mr: 1 }} />
      <Typography variant="caption" color="textSecondary">Criado em: {new Date(lead.created_at).toLocaleDateString('pt-BR')}</Typography>
    </Box>
  </Paper>
);

export default LeadCard;
