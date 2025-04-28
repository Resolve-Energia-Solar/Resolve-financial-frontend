import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Skeleton } from '@mui/material';
import processService from '@/services/processService';

const HorizontalProcessCards = () => {
  const [stepCount, setStepCount] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStepCount = async () => {
      try {
        const response = await processService.processCountByStep();
        if (response) {
          setStepCount(response);
        }
      } catch (error) {
        console.error('Erro ao buscar contagem de processos por etapa:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStepCount();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="row"
        gap={2}
        overflow="auto"
        padding={2}
        sx={{ backgroundColor: '#f5f5f5' }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} sx={{ width: 150, height: 100, flexShrink: 0 }} elevation={3}>
            <CardContent sx={{ padding: 1, textAlign: 'center' }}>
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="40%" />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="row"
      gap={2}
      overflow="auto"
      padding={2}
      sx={{ backgroundColor: '#f5f5f5' }}
    >
      {stepCount.map((item, index) => (
        <Card key={index} sx={{ width: 150, height: 100, flexShrink: 0 }} elevation={3}>
          <CardContent sx={{ padding: 1, textAlign: 'center' }}>
            <Typography variant="subtitle1">{item.step}</Typography>
            <Typography variant="h6">{item.total_processes}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default HorizontalProcessCards;
