import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Skeleton, useTheme } from '@mui/material';
import processService from '@/services/processService';

const HorizontalProcessCards = () => {
  const [stepCount, setStepCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

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
      sx={{ backgroundColor: theme.palette.primary.Box }}
    >
      {stepCount.map((item, index) => (
        <Card 
          key={index} 
          sx={{ 
            width: '250px', 
            height: '75px', 
            flexShrink: 0,
            borderRadius: 2,
            py: 2, 
            px: 2, 
            
          }} 
          elevation={2}
        >
          <CardContent 
            sx={{ 
              py: 0, 
              px: 0, 
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              textAlign: 'start',
              // spacing: 10,
            }}>
            <Typography sx={{ fontWeight: 400, fontSize: '16px', mb: 0.2 }}>{item.step}</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>{item.total_processes}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default HorizontalProcessCards;
