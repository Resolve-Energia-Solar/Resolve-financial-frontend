import React from 'react';
import { Box, List, ListItem, ListItemText, Typography, Divider, Avatar, ListItemAvatar } from '@mui/material';
import { AssignmentTurnedIn, Visibility, ContactMail, FollowTheSigns } from '@mui/icons-material';
import { motion } from 'framer-motion';

const activities = [
  {
    id: 1,
    date: '2024-11-10',
    description: 'Alterado Qualificação.',
    icon: <AssignmentTurnedIn color="primary" />,
    user: {
      name: 'Beatriz Costa',
      avatar: 'https://i.pravatar.cc/150?img=10',
    },
  },
  {
    id: 2,
    date: '2024-11-12',
    description: 'Alterado RG/IE.',
    icon: <Visibility color="secondary" />,
    user: {
      name: 'Kevin Soares',
      avatar: 'https://i.pravatar.cc/150?img=6',
    },
  },
  {
    id: 3,
    date: '2024-11-14',
    description: 'Alterado CPF/CNPJ.',
    icon: <ContactMail color="success" />,
    user: {
      name: 'Beatriz Costa',
      avatar: 'https://i.pravatar.cc/150?img=10',
    },
  },
  {
    id: 4,
    date: '2024-11-16',
    description: 'Alterado CPF/CNPJ.',
    icon: <FollowTheSigns color="warning" />,
    user: {
      name: 'Kevin Soares',
      avatar: 'https://i.pravatar.cc/150?img=6',
    },
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Activities() {
  return (
    <Box sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper', borderRadius: 2, p: 2, boxShadow: 3 }}>
      <Typography variant="h6" gutterBottom>
        Histórico de Atividades
      </Typography>
      <List>
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{ marginBottom: '16px' }}
          >
            <ListItem>
              <ListItemAvatar>
                <Avatar src={activity.user.avatar} alt={activity.user.name} />
              </ListItemAvatar>
              <ListItemText
                primary={activity.description}
                secondary={`Por: ${activity.user.name} em ${new Date(activity.date).toLocaleDateString('pt-BR')}`}
              />
            </ListItem>
            {index < activities.length - 1 && <Divider />}
          </motion.div>
        ))}
      </List>
    </Box>
  );
}
