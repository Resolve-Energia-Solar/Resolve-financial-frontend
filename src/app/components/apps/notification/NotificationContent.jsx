import React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const NotificationContent = ({ notification }) => {
  const theme = useTheme();

  if (!notification) {
    return (
      <Box
        p={3}
        height="50vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h4">
          Por favor, selecione uma notificação
        </Typography>
      </Box>
    );
  }

  // Função auxiliar para renderizar valores de forma segura
  const safeRender = (val, fallbackProp) => {
    if (typeof val === 'object' && val !== null) {
      // Tente acessar uma propriedade específica (por exemplo, "name")
      return val.name || JSON.stringify(val);
    }
    return val;
  };

  // Mapeamento dos níveis para nomes em português
  const levelMap = {
    info: 'Informação',
    warning: 'Aviso',
    error: 'Erro'
  };

  return (
    <Box p={3}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ pb: 3 }}>
        <Avatar
          alt={
            notification.recipient?.complete_name ||
            (typeof notification.actor === 'object'
              ? notification.actor.name || JSON.stringify(notification.actor)
              : notification.actor)
          }
          src={notification.recipient?.profile_picture}
          sx={{ width: 40, height: 40 }}
        />
        <Box>
          <Typography variant="h6">
            {safeRender(notification.actor)}
          </Typography>
          {notification.recipient && (
            <Typography variant="body2">
              {notification.recipient.complete_name}
            </Typography>
          )}
        </Box>
        <Chip
          label={levelMap[notification.level] || 'Informação'}
          sx={{ ml: 'auto', height: '21px' }}
          size="small"
          color={
            notification.level === 'warning'
              ? 'warning'
              : notification.level === 'error'
                ? 'error'
                : 'primary'
          }
        />
      </Stack>
      <Divider />
      <Box sx={{ py: 2 }}>
        <Typography variant="h4" gutterBottom>
          {`${safeRender(notification.actor)} ${safeRender(notification.verb)} ${safeRender(notification.action_object)}`}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {safeRender(notification.description)}
        </Typography>
        <Typography variant="caption">
          Recebida {safeRender(notification.timesince)} atrás
        </Typography>
      </Box>
    </Box>
  );
};

export default NotificationContent;
