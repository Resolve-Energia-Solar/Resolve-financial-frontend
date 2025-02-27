import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Scrollbar from '@/app/components/custom-scroll/Scrollbar';
import { IconBellRinging, IconBell, IconBellQuestion } from '@tabler/icons-react';
import { Stack } from '@mui/system';
import Link from 'next/link';

import notificationService from '@/services/notificationService';

const Notifications = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  // Busca notificações não lidas
  const fetchNotifications = () => {
    setLoading(true);
    notificationService
      .getUnreadNotifications()
      .then((data) => {
        setNotifications(data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar notificações:', error);
        setLoading(false);
      });
  };

  // Marca uma notificação como lida sem fechar o dropdown
  const handleNotificationClick = async (notification) => {
    if (notification.unread) {
      try {
        await notificationService.updateNotificationPartial(notification.id, { unread: false });
        fetchNotifications();
      } catch (error) {
        console.error('Erro ao marcar como lida:', error);
      }
    }
  };

  // Marca todas as notificações como lidas e fecha o dropdown
  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => n.unread);
      await Promise.all(
        unreadNotifications.map((n) =>
          notificationService.updateNotificationPartial(n.id, { unread: false })
        )
      );
      fetchNotifications();
      handleClose2();
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          color: anchorEl2 ? 'primary.main' : 'text.secondary',
        }}
        onClick={handleClick2}
      >
        <Badge variant={notifications.length > 0 ? "dot" : undefined} color="primary">
          {loading ? (
            <IconBellQuestion size="21" stroke="1.5" />
          ) : notifications.length > 0 ? (
            <IconBellRinging size="21" stroke="1.5" />
          ) : (
            <IconBell size="21" stroke="1.5" />
          )}
        </Badge>
      </IconButton>
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '550px',
          },
        }}
      >
        <Stack
          direction="row"
          py={2}
          px={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Notificações</Typography>
          <Chip
            label={`${notifications.filter((n) => n.unread).length} ${notifications.filter((n) => n.unread).length === 1 ? 'nova' : 'novas'}`}
            color="primary"
            size="small"
          />
        </Stack>
        <Scrollbar sx={{ height: '385px' }}>
          {notifications.map((notification, index) => (
            <Box key={index}>
              <MenuItem
                sx={{ py: 2, px: 4 }}
                onClick={() => handleNotificationClick(notification)}
              >
                <Stack direction="row" spacing={2}>
                  <Avatar
                    src={notification.recipient.profile_picture}
                    alt={notification.recipient.complete_name}
                    sx={{
                      width: 48,
                      height: 48,
                    }}
                  />
                  <Box sx={{ position: 'relative', width: '100%' }}>
                    <Typography
                      variant="subtitle2"
                      color="textPrimary"
                      fontWeight={600}
                      noWrap
                      sx={{
                        width: '450px',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {notification.actor} {notification.verb} {notification.action_object}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                      noWrap
                      sx={{
                        width: '450px',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {notification.description}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="caption"
                      noWrap
                      sx={{
                        width: '450px',
                      }}
                    >
                      Há {notification.timesince}
                    </Typography>
                    <Badge
                      variant={notification.unread ? "dot" : undefined}
                      color="primary"
                      sx={{ position: 'absolute', top: 10, right: 15 }}
                    />
                  </Box>
                </Stack>
              </MenuItem>
              {index < notifications.length - 1 && <Divider />}
            </Box>
          ))}
          {notifications.filter((n) => n.unread).length < 1 && <MenuItem
                sx={{ py: 2, px: 4 }}
                onClick={() => handleNotificationClick(notification)}
              ><Typography>Nada a exibir, você não possui notificações não lidas.</Typography></MenuItem>}
        </Scrollbar>
        <Box p={3} pb={1} display="flex" gap={2}>
          {notifications.filter((n) => n.unread).length > 1 && <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleMarkAllAsRead}
          >
            Marcar todas como lidas
          </Button>}
          <Button
            href="/apps/notification"
            variant="outlined"
            component={Link}
            color="primary"
            fullWidth
          >
            Ver todas as notificações
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Notifications;
