import React from 'react';
import { Grid, Box, Stack, Typography, Chip } from '@mui/material';

// Componente InfoCard
const InfoCard = ({ backgroundColor, iconColor, IconComponent, title, value, count, onClick }) => (
  <Grid item xs={12} sm={6} lg={2.4}>
    <Box
      bgcolor={backgroundColor}
      p={1}
      sx={{ cursor: 'pointer', minHeight: 100 }} // Definindo uma altura mínima
      onClick={onClick}
      display="flex"
      alignItems="center" // Alinhando o conteúdo ao centro verticalmente
    >
      <Stack direction="row" gap={2} alignItems="center" justifyContent="center">
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
          <Typography fontWeight={200} fontSize={15}>
            {value}
          </Typography>
          {count && <Chip label={`Quantidade: ${count}`} size="small" sx={{ mt: 0.6 }} />}
        </Box>
      </Stack>
    </Box>
  </Grid>
);

const SaleCards = ({ cardsData, user_permissions = [] }) => (
  <Grid container spacing={3} sx={{ marginBottom: 3 }} justifyContent="space-between">
    {cardsData
      .filter(card => !card.permission || user_permissions.includes(card.permission))
      .map((card, index) => {
        const displayValue = card.isCurrency !== false
          ? Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.value || 0)
          : card.value;

        return (
          <InfoCard
            key={index}
            backgroundColor={card.backgroundColor}
            iconColor={card.iconColor}
            IconComponent={card.IconComponent}
            title={card.title}
            value={displayValue}
            count={card.count}
            onClick={card.onClick}
          />
        );
      })}
  </Grid>
);

export default SaleCards;
