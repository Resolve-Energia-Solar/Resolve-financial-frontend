'use client';
import React from 'react';
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { MenuItem, Grid, Stack, Typography, Button, Avatar, Box } from '@mui/material';
import { IconGridDots } from '@tabler/icons-react';
import DashboardCard from '../../shared/DashboardCard';
import CustomSelect from '../../forms/theme-elements/CustomSelect';
import SkeletonRevenueUpdatesTwoCard from '../skeleton/RevenueUpdatesTwoCard';

const RevenueUpdates = ({ isLoading }) => {
  const [month, setMonth] = React.useState('1');

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: true,
      },
      height: 360,
      stacked: true,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: '60%',
        columnWidth: '20%',
        borderRadius: [6],
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
    },

    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      min: -5,
      max: 5,
      tickAmount: 4,
    },
    xaxis: {
      categories: ['16/08', '17/08', '18/08', '19/08', '20/08', '21/08', '22/08'],
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
  };

  const seriescolumnchart = [
    {
      name: 'Ganhos neste mês',
      data: [1.5, 2.7, 2.2, 3.6, 1.5, 1.0],
    },
    {
      name: 'Despesas neste mês',
      data: [-1.8, -1.1, -2.5, -1.5, -0.6, -1.8],
    },
  ];

  return (
    <>
      {
        isLoading ? (
          <SkeletonRevenueUpdatesTwoCard />
        ) : (
          <DashboardCard
            title="Atualizações de Receita"
            subtitle="Visão Geral do Lucro"
            action={
              <CustomSelect
                labelId="mes-dd"
                id="mes-dd"
                size="small"
                value={month}
                onChange={handleChange}
              >
                <MenuItem value={1}>Março 2023</MenuItem>
                <MenuItem value={2}>Abril 2023</MenuItem>
                <MenuItem value={3}>Maio 2023</MenuItem>
              </CustomSelect>
            }
          >
            <Grid container spacing={3}>
              {/* coluna */}
              <Grid item xs={12} sm={8}>
                <Box className="rounded-bars">
                  <Chart
                    options={optionscolumnchart}
                    series={seriescolumnchart}
                    type="bar"
                    height={360}
                    width={"100%"}
                  />
                </Box>
              </Grid>
              {/* coluna */}
              <Grid item xs={12} sm={4}>
                <Stack spacing={3} mt={3}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      width={40}
                      height={40}
                      bgcolor="primary.light"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Typography color="primary" variant="h6" display="flex">
                        <IconGridDots size={24} />
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h3" fontWeight="700">
                        R$ 63.489,50
                      </Typography>
                      <Typography variant="subtitle2" color="textSecondary">
                        Ganhos Totais
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
                <Stack spacing={3} my={5}>
                  <Stack direction="row" spacing={2}>
                    <Avatar
                      sx={{ width: 9, mt: 1, height: 9, bgcolor: primary, svg: { display: 'none' } }}
                    ></Avatar>
                    <Box>
                      <Typography variant="subtitle1" color="textSecondary">
                        Ganhos neste mês
                      </Typography>
                      <Typography variant="h5">R$ 48.820</Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Avatar
                      sx={{ width: 9, mt: 1, height: 9, bgcolor: secondary, svg: { display: 'none' } }}
                    ></Avatar>
                    <Box>
                      <Typography variant="subtitle1" color="textSecondary">
                        Despesas neste mês
                      </Typography>
                      <Typography variant="h5">R$ 26.498</Typography>
                    </Box>
                  </Stack>
                </Stack>
                <Button color="primary" variant="contained" fullWidth>
                  Ver Relatório Completo
                </Button>
              </Grid>
            </Grid>
          </DashboardCard>
        )}


    </>
  );
};

export default RevenueUpdates;
