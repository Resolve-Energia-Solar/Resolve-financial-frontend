'use client';
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';

import DashboardWidgetCard from '../../shared/DashboardWidgetCard';
import SkeletonEmployeeSalaryCard from "../skeleton/EmployeeSalaryCard";
import { Box } from "@mui/material";


const EmployeeSalary = ({ isLoading }) => {
  // cor do gráfico
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.grey[100];

  // gráfico
  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 280,
    },
    colors: [primarylight, primarylight, primary, primarylight, primarylight, primarylight],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '45%',
        distributed: true,
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: [['Abr'], ['Mai'], ['Jun'], ['Jul'], ['Ago'], ['Set']], // Meses traduzidos
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };
  const seriescolumnchart = [
    {
      name: '',
      data: [20, 15, 30, 25, 10, 15], // Esses valores podem representar as comissões
    },
  ];

  return (
    <>
      {
        isLoading ? (
          <SkeletonEmployeeSalaryCard />
        ) : (
          <DashboardWidgetCard
            title="Salário do Funcionário"
            subtitle="Comissões mensais"  
            dataLabel1="Comissão"
            dataItem1="R$36.358"  
            dataLabel2="Lucro"
            dataItem2="R$5.296"
          >
            <>
              <Box height="295px">
                <Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height={280} width={"100%"} />
              </Box>
            </>
          </DashboardWidgetCard>
        )}
    </>

  );
};

export default EmployeeSalary;
