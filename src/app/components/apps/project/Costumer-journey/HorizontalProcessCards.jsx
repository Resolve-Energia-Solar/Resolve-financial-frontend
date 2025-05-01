import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, Card, CardContent, Typography, Skeleton, useTheme, IconButton } from '@mui/material';
import processService from '@/services/processService';
import { alpha } from '@mui/material/styles';

const HorizontalProcessCards = () => {
  const [stepCount, setStepCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const scrollRef = useRef();

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

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
        sx={{ backgroundColor: theme.palette.primary.Box }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} 
            sx={{
              minWidth: '170px',
              height: '75px',
              width: 'auto',
              flexShrink: 0,
              borderRadius: 2,
              py: 2,
              px: 2,
              border: '1px solid rgba(137, 143, 148, 0.17)',
              boxShadow: 4,
              boxShadow: '8px 8px 12px rgba(0, 0, 0, 0.14)'
            }} 
            elevation={3}
          >
            <CardContent 
              sx={{
                py: 0,
                px: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                textAlign: 'start',
              }}
            >
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="40%" />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={() => scroll('left')}>
        <ChevronLeft />
      </IconButton>
      <Box
        ref={scrollRef}
        display="flex"
        flexDirection="row"
        gap={1}
        overflow="auto"
        padding={2}
        sx={{ backgroundColor: theme.palette.primary.Box }}
      >
        {stepCount.map((item, index) => (
          <Card
            key={index}
            sx={{
              minWidth: '170px',
              height: '85px',
              width: 'auto',
              flexShrink: 0,
              borderRadius: 2,
              py: 2,
              px: 2,
              border: '1px solid rgba(137, 143, 148, 0.07)',
              backgroundColor: alpha(theme.palette.secondary.light, 0.2),
              boxShadow: 4,
              boxShadow: '8px 8px 12px rgba(0, 0, 0, 0.14)',
              
            }}
            elevation={3}
          >
            <CardContent
              sx={{
                py: 0,
                px: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                textAlign: 'start',
              }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 0.5, mt: 0, opacity: '0.5' }}>{item.step}</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: '20px', mb: 2 }}>{item.total_processes}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      <IconButton onClick={() => scroll('right')}>
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default HorizontalProcessCards;
