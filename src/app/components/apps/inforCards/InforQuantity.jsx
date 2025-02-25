import React from 'react';
import { Grid, Box, Stack, Typography } from '@mui/material';

const InforQuantity = ({ backgroundColor, iconColor, IconComponent, title, subtitle, count, onClick }) => (
  <Grid item xs={12} sm={4}>
    <Box
      bgcolor={backgroundColor}
      p={2}
      borderRadius={0.5}
      boxShadow={2}
      sx={{ cursor: 'pointer', transition: '0.3s', '&:hover': { boxShadow: 4 } }}
      onClick={onClick}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          width={40}
          height={40}
          bgcolor={iconColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius={0.5}
        >
          <IconComponent width={24} style={{ color: '#fff' }} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={600} color="text.primary">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          <Typography variant="h5" fontWeight={700} color="primary.main">
            {count}
          </Typography>
        </Box>
      </Stack>
    </Box>
  </Grid>
);

const ProjectCards = ({ cardsData, user_permissions = [] }) => (
  <Grid container spacing={3} sx={{ marginBottom: 3 }}>
    {cardsData
      .filter(card => !card.permission || user_permissions.includes(card.permission))
      .map((card, index) => (
        <InforQuantity
          key={index}
          backgroundColor={card.backgroundColor}
          iconColor={card.iconColor}
          IconComponent={card.IconComponent}
          title={card.title}
          subtitle={card.subtitle}
          count={card.count || 0}
          onClick={card.onClick}
        />
      ))}
  </Grid>
);

export default ProjectCards;
