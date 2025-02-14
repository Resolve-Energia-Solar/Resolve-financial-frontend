'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import NotificationList from '@/app/components/apps/notification/NotificationList';
import NotificationFilter from '@/app/components/apps/notification/NotificationFilter';
import NotificationContent from '@/app/components/apps/notification/NotificationContent';

const drawerWidth = 240;
const secdrawerWidth = 340;

const NotificationApp = () => {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [filters, setFilters] = useState({});

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  // Quando os filtros forem aplicados, atualizamos o estado,
  // fazendo com que NotificationList refaça a requisição
  const handleApplyFilters = (newFilters) => {
    console.log("Filtros recebidos no NotificationApp:", newFilters);
    setFilters(newFilters);
  };

  const handleNotificationSelect = (notification) => {
    setSelectedNotification(notification);
  };

  return (
    <>
      <Box
        sx={{
          minWidth: secdrawerWidth,
          width: { xs: '100%', md: secdrawerWidth, lg: secdrawerWidth },
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 2,
        }}
      >
        {/* Filtro de Notificações */}
        <NotificationFilter onApplyFilters={handleApplyFilters} />

        {/* Lista de Notificações */}
        <NotificationList
          showRightSidebar={() => setRightSidebarOpen(true)}
          onNotificationSelect={handleNotificationSelect}
          filters={filters}
        />
      </Box>

      {/* Right part */}
      {mdUp ? (
        <Drawer
          anchor="right"
          variant="permanent"
          sx={{
            zIndex: 0,
            width: '200px',
            flex: '1 1 auto',
            [`& .MuiDrawer-paper`]: { position: 'relative' },
          }}
        >
          <Box>
            <NotificationContent notification={selectedNotification} />
          </Box>
        </Drawer>
      ) : (
        <Drawer
          anchor="right"
          open={isRightSidebarOpen}
          onClose={() => setRightSidebarOpen(false)}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: '85%' },
          }}
          variant="temporary"
        >
          <Box p={3}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => setRightSidebarOpen(false)}
              sx={{ mb: 3, display: { xs: 'block', md: 'none', lg: 'none' } }}
            >
              Voltar
            </Button>
            <NotificationContent notification={selectedNotification} />
          </Box>
        </Drawer>
      )}
    </>
  );
};

export default NotificationApp;
