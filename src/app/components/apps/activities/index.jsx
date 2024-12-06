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

export default function Activities({ lead }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const contentTypeLead = 36;
  const contentTypeProposal = 45;
  const contentTypeSale = 41;
  const leadID = lead?.id;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = Cookies.get('access_token');
        if (!token) {
          throw new Error('Token de acesso não encontrado.');
        }

        const activityData = [];

        if (leadID) {
          const leadData = await HistoryService.getHistory(contentTypeLead, leadID, token);
          activityData.push(...(leadData.changes || []));
        }

        if (lead?.sales?.length > 0) {
          for (const sale of lead.sales) {
            if (sale?.id) {
              try {
                const saleData = await HistoryService.getHistory(contentTypeSale, sale.id, token);
                activityData.push(...(saleData.changes || []));
              } catch (error) {
                console.error(`Erro ao buscar histórico para venda ${sale.id}:`, error.message);
                setError(`Erro ao carregar histórico da venda ${sale.id}.`);
              }
            }
          }
        }

        if (lead?.proposals?.[0]?.id) {
          const proposalData = await HistoryService.getHistory(
            contentTypeProposal,
            lead.proposals[0].id,
            token,
          );
          activityData.push(...(proposalData.changes || []));
        }

        setActivities(activityData);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError(err.response.data.message || 'Histórico não encontrado.');
        } else {
          setError(err.message || 'Erro ao carregar atividades.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [leadID, lead]);

  const getInitials = (name) => {
    return name[0];
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
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
        maxWidth: 600,
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Histórico de Atividades
      </Typography>
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
                  {getInitials(activity.author.complete_name)}
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
                      Realizado por: {activity.author.complete_name}
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
