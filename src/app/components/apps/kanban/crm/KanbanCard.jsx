import { Paper, Box, Typography, useTheme, Rating, Avatar, Tooltip } from '@mui/material';
import { Phone, AccessTime, TagSharp, Bolt, WbSunny } from '@mui/icons-material';
import { keyframes } from '@emotion/react';

const KanbanCard = ({ lead, handleLeadClick, status, isLeadOverdue }) => {
  const theme = useTheme();

  const getTimeIconColor = () => {
    if (isLeadOverdue(lead, status)) {
      return theme.palette.error.main;
    }
    if (status === 'Primeiro Contato' || status === 'Terceiro Contato') {
      return theme.palette.warning.main;
    }
    return theme.palette.text.secondary;
  };

  const getInitials = (name) => {
    if (!name) return '';
    const words = name.split(' ');
    const initials = words.map((word) => word[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  };

  const formatPhone = (phone) => {
    if (!phone) return 'N/A';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const formatKwp = (kwp) => {
    if (!kwp) return 'N/A';
    return (
      parseFloat(kwp).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + ' kWp'
    );
  };

  const pulseAnimation = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  `;

  const overdueStyle = isLeadOverdue(lead, status)
    ? {
      animation: `${pulseAnimation} 1.5s infinite`,
      color: theme.palette.error.main,
    }
    : {};

  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        mx: 1,
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="p" fontWeight={600} color={theme.palette.text.primary}>
          {lead.name}
        </Typography>
        <AccessTime
          sx={{
            fontSize: '1.2rem',
            color: getTimeIconColor(),
            ...overdueStyle,
          }}
        />
      </Box>

      <Box display="flex" alignItems="center" mt={1}>
        <TagSharp sx={{ fontSize: '1rem', color: theme.palette.text.secondary, mr: 1 }} />
        <Typography variant="body2" color={theme.palette.text.secondary}>
          Origem: {lead.origin?.name || 'N/A'}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" mt={1}>
        <Phone sx={{ fontSize: '1rem', color: theme.palette.text.secondary, mr: 1 }} />
        <Typography variant="body2" color={theme.palette.text.primary}>
          {formatPhone(lead.phone)}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" mt={1}>
        <Bolt sx={{ fontSize: '1rem', color: theme.palette.text.secondary, mr: 1 }} />
        <Typography variant="body2" color={theme.palette.text.primary}>
          Consumo: {formatKwp(lead.kwp)}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" mt={1}>
        <Typography variant="body2" color={theme.palette.text.secondary}>
          Qualificação:
        </Typography>
        <Rating
          name="qualification"
          value={lead.qualification || 0}
          max={5}
          size="small"
          readOnly
          sx={{ ml: 1 }}
          icon={<WbSunny fontSize="inherit" sx={{ color: theme.palette.warning.main }} />}
          emptyIcon={<WbSunny fontSize="inherit" sx={{ color: theme.palette.action.disabled }} />}
        />
      </Box>

      <Box display="flex" alignItems="center" gap={1} mt={2}>
        <Tooltip title={`Vendedor: ${lead.seller?.complete_name || 'N/A'}`} arrow>
          <Avatar
            sx={{
              bgcolor: theme.palette.warning.main,
              color: theme.palette.common.black,
              width: 27,
              height: 27,
              fontSize: '0.75rem',
            }}
          >
            {getInitials(lead.seller?.complete_name)}
          </Avatar>
        </Tooltip>

        <Tooltip title={`SDR: ${lead.sdr?.complete_name || 'N/A'}`} arrow>
          <Avatar
            sx={{
              bgcolor: theme.palette.info.main,
              color: theme.palette.common.black,
              width: 27,
              height: 27,
              fontSize: '0.75rem',
            }}
          >
            {getInitials(lead.sdr?.complete_name)}
          </Avatar>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default KanbanCard;

