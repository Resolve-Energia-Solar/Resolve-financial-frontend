import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { Divider } from '@mui/material';

const NotificationListItem = ({ notification, onClick, isSelected }) => {
  console.log(notification)
  const { id, actor, verb, action_object, description, timesince, unread, recipient } = notification;
  const theme = useTheme();

  return (
    <ListItemButton
      onClick={onClick}
      selected={isSelected}
      sx={{ mb: 1, py: 2 }}
      alignItems="flex-start"
    >
      <ListItemIcon sx={{ minWidth: '50px', mt: '0' }}>
        <Badge variant={unread ? 'dot' : undefined} color="primary">
          <Avatar src={recipient?.profile_picture} alt={actor} />
        </Badge>
      </ListItemIcon>
      <ListItemText
        primary={
          <Stack>
            <Typography variant="subtitle2" fontWeight={600}>
              {actor}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {verb} {action_object}
            </Typography>
            <Divider sx={{marginBlock: 0.5 }} />
          </Stack>
        }
        secondary={
          <>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {timesince}
            </Typography>
          </>
        }
      />
    </ListItemButton>
  );
};

export default NotificationListItem;
