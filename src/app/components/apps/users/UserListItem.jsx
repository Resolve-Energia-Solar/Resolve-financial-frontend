'use client';

import React from 'react';
import { ListItem, ListItemAvatar, ListItemText, Avatar, Box, IconButton } from '@mui/material';
import { IconUser, IconStar, IconTrash } from '@tabler/icons-react';

const ContactListItem = ({ first_name, last_name, profile_picture, department, onContactClick }) => {
  return (
    <ListItem
      button
      onClick={onContactClick}
      sx={{
        mb: 1,
        p: 2,
        borderRadius: '8px',
        backgroundColor: '#f0f0f0',
        '&:hover': { backgroundColor: '#e0e0e0' },
        transition: 'all 0.3s ease',
      }}
    >
      <ListItemAvatar>
        <Avatar alt={first_name} src={profile_picture}>
          <IconUser />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={`${first_name} ${last_name}`}
        secondary={department}
        primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1rem' }}
      />
      <Box>
        <IconButton>
          <IconTrash size="20" color="red" />
        </IconButton>
      </Box>
    </ListItem>
  );
};

export default ContactListItem;

