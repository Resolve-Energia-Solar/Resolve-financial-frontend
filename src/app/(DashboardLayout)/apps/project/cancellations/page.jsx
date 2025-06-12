'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Box, CardContent, Typography, useTheme } from '@mui/material';
import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from '@/app/components/container/PageContainer';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import ProjectList from '@/app/components/apps/project/Project-list';
import EditProject from '@/app/components/apps/project/Edit-project';
import SideDrawer from '@/app/components/shared/SideDrawer';
import useProject from '@/hooks/projects/useProject';
import ProjectDetailDrawer from '@/app/components/apps/project/Costumer-journey/Project-Detail/ProjectDrawer';
import { CheckCircle, HourglassEmpty, RemoveCircleOutline } from '@mui/icons-material';
import { KPICard } from '@/app/components/charts/KPICard';
import { useSnackbar } from 'notistack';
import projectService from '@/services/projectService';

const ProjectListing = () => {
  const { openDrawer, toggleDrawerClosed, handleRowClick, rowSelected } = useProject();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const projectId = rowSelected?.id || null;
  const saleId = rowSelected?.sale?.id || null;

  const [indicators, setIndicators] = useState({});
  const [loadingIndicators, setLoadingIndicators] = useState(true);

  const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Projetos em distratos' }];

  const onRowClick = useCallback((row) => handleRowClick(row), [handleRowClick]);

  const stats = [
    {
      key: 'total_finished',
      label: 'Vistorias Finalizadas',
      value: indicators.total_finished,
      icon: <CheckCircle />,
      color: '#d4edda',
      filter: { inspection_is_finished: true },
    },
    {
      key: 'total_pending',
      label: 'Vistorias Pendentes',
      value: indicators.total_pending,
      icon: <HourglassEmpty />,
      color: '#fff3cd',
      filter: { inspection_is_pending: true },
    },
    {
      key: 'total_not_scheduled',
      label: 'Sem Vistoria Vinculada',
      value: indicators.total_not_scheduled,
      icon: <RemoveCircleOutline />,
      color: '#f8d7da',
      filter: { inspection_isnull: true },
    },
  ];

  const fetchIndicators = useCallback(async () => {
    setLoadingIndicators(true);
    try {
      const { indicators } = await projectService.inspectionsIndicators({
        remove_termination_cancelled_and_pre_sale: true,
      });
      setIndicators(indicators);
    } catch {
      enqueueSnackbar('Erro ao carregar indicadores', { variant: 'error' });
    } finally {
      setLoadingIndicators(false);
    }
  }, []);

  useEffect(() => {
    fetchIndicators();
  }, []);

  return (
    <PageContainer title="Projetos" description="Lista de Projetos em distratos">
      <Breadcrumb items={BCrumb} />
      <BlankCard>
        <CardContent>
          <Box sx={{ width: '100%', mb: 2 }}>
            <Typography variant="h6">Indicadores da Vistorias</Typography>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-evenly',
                gap: 2,
                flexWrap: 'wrap',
                mt: 1,
                mb: 4,
                background: theme.palette.mode === 'dark' ? '#424242' : '#f5f5f5',
                p: 2,
              }}
            >
              {stats.map(({ key, label, value, icon, color, filter, format }) => {
                return (
                  <KPICard
                    key={key}
                    label={label}
                    value={value}
                    icon={icon}
                    color={color}
                    format={format}
                    onClick={() => handleKPIClick(key)}
                    loading={loadingIndicators}
                  />
                );
              })}
            </Box>
          </Box>
          <ProjectList onClick={onRowClick} defaultfilters={{ sale_status: 'D' }} />
          <ProjectDetailDrawer
            projectId={projectId}
            saleId={saleId}
            open={openDrawer}
            onClose={toggleDrawerClosed}
          />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
};

export default ProjectListing;
