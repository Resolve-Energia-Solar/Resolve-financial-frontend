import React from 'react';
import { Grid, Box, Stack, Typography } from '@mui/material';

const InfoCard = ({ backgroundColor, iconColor,  IconComponent, title, count }) => (
  <Grid item xs={12} sm={6} lg={2.4}>
    <Box bgcolor={backgroundColor} p={1} sx={{ cursor: 'pointer' }}>
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

const SaleCards = ({ cardsData }) => (
  <Grid container spacing={3} sx={{ marginBottom: 3 }}>
    {cardsData.map((card, index) => (
      <InfoCard
        key={index}
        backgroundColor={card.backgroundColor}
        iconColor={card.iconColor}
        IconComponent={card.IconComponent}
        title={card.title}
        count={card.count}
      />
    ))}
  </Grid>
);

export default SaleCards;
