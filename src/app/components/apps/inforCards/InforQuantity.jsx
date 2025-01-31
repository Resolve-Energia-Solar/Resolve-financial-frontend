import React from 'react';
import { Grid, Box, Stack, Typography, Chip } from '@mui/material';

// Componente InfoCard
const InforQuantity = ({ backgroundColor, iconColor, IconComponent, title, count, onClick }) => (
  <Grid item xs={12} sm={4}>
    <Box
      bgcolor={backgroundColor}
      p={1}
      sx={{ cursor: 'pointer' }}
      onClick={onClick} // Evento de clique aplicado aqui
    >
      <Stack direction="row" gap={2} alignItems="center">
        <Box
          width={35}
          height={35}
          bgcolor={iconColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
        <IconComponent width={22} style={{ color: '#fff' }} />
        </Box>
        <Box>
          <Typography>{title}</Typography>
          <Typography fontWeight={500}>{count}</Typography>
        </Box>
      </Stack>
    </Box>
  </Grid>
);

const ProjectCards = ({ cardsData }) => (
  <Grid container spacing={3} sx={{ marginBottom: 3 }}>
    {cardsData.map((card, index) => (
      <InforQuantity
        key={index}
        backgroundColor={card.backgroundColor}
        iconColor={card.iconColor}
        IconComponent={card.IconComponent}
        title={card.title}
        count={card.count || 0}
        onClick={card.onClick}
      />
    ))}
  </Grid>
);

export default ProjectCards;
