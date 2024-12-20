import React from 'react';
import { Grid, Box, Stack, Typography } from '@mui/material';
import { IconListDetails, IconPaperclip, IconSortAscending } from '@tabler/icons-react';

const InfoCard = ({ backgroundColor, iconColor, IconComponent, title, count }) => (
  <Grid item xs={12} sm={6} lg={3}>
    <Box backgroundColor={backgroundColor} p={3} sx={{ cursor: 'pointer' }}>
      <Stack direction="row" gap={2} alignItems="center">
        <Box
          width={38}
          height={38}
          bgcolor={iconColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            color="primary.contrastText"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <IconComponent width={22} />
          </Typography>
        </Box>
        <Box>
          <Typography>{title}</Typography>
          <Typography fontWeight={500}>{count}</Typography>
        </Box>
      </Stack>
    </Box>
  </Grid>
);

const SaleCards = () => (
  <Grid container spacing={3} sx={{ marginBottom: 3}}>
    <InfoCard
      backgroundColor="primary.light"
      iconColor="primary.main"
      IconComponent={IconListDetails}
      title="Em andamento"
      count="-"
    />
    <InfoCard
      backgroundColor="success.light"
      iconColor="success.main"
      IconComponent={IconListDetails}
      title="Finalizado"
      count="-"
    />
    <InfoCard
      backgroundColor="secondary.light"
      iconColor="secondary.main"
      IconComponent={IconPaperclip}
      title="pendente"
      count="-"
    />
    <InfoCard
      backgroundColor="warning.light"
      iconColor="warning.main"
      IconComponent={IconSortAscending}
      title="Cancelado"
      count="-"
    />
      <InfoCard
      backgroundColor="warning.light"
      iconColor="warning.main"
      IconComponent={IconSortAscending}
      title="Distrato"
      count="-"
    />
  </Grid>
);

export default SaleCards;
