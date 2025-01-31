'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  ListItemAvatar,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import HistoryService from '@/services/historyService';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function History({ contentType, objectId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('contentType: ', contentType);
  console.log('objectId: ', objectId);
  console.log('activities: ', activities);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = Cookies.get('access_token');
        if (!token) throw new Error('Token não encontrado.');

        const data = await HistoryService.getHistory(contentType, objectId, token, true);
        setActivities(data.history || []);
      } catch (err) {
        setError(err.message || 'Erro ao carregar atividades.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [contentType, objectId]);

  const getInitials = (name) => name[0];

  if (loading) {
    return (
      <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100%', mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 2,
        // boxShadow: 1,
        mt: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>Histórico de Atividades</Typography>
      <List>
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{ marginBottom: '16px' }}
          >
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
                  {getInitials(activity.author.complete_name.toUpperCase() || activity.author.email.toUpperCase())}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`Alteração em ${activity.changes.map((c) => c.field_label).join(', ')}`}
                secondary={
                  <>
                    <Typography variant="body2">
                      Realizado em: {new Date(activity.timestamp).toLocaleString('pt-BR')}
                    </Typography>
                    <Typography variant="body2">
                      Realizado por: {activity.author.complete_name || activity.author.email}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            {index < activities.length - 1 && <Divider />}
          </motion.div>
        ))}
      </List>
    </Box>
  );
}
