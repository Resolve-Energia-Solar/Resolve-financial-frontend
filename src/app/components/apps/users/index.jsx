'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import UserDetails from '@/app/components/apps/users/UserDetails';
import UserList from '@/app/components/apps/users/UserList';
import { Slide, Fade } from '@mui/material';

const drawerWidth = 240;
const secdrawerWidth = 320;

const UserApp = () => {
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  return (
    <>
      <Fade in={true}>
        <Box
          sx={{
            minWidth: secdrawerWidth,
            width: { xs: '100%', md: secdrawerWidth, lg: secdrawerWidth },
            flexShrink: 0,
            backgroundColor: '#fafafa',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <UserList showrightSidebar={() => setRightSidebarOpen(true)} />
        </Box>
      </Fade>

      <Drawer
        anchor="right"
        open={isRightSidebarOpen}
        onClose={() => setRightSidebarOpen(false)}
        variant={mdUp ? 'permanent' : 'temporary'}
        sx={{
          width: mdUp ? secdrawerWidth : '100%',
          zIndex: lgUp ? 0 : 1,
          flex: mdUp ? 'auto' : '',
          [`& .MuiDrawer-paper`]: { width: '100%', position: 'relative' },
        }}
      >
        <UserDetails />
      </Drawer>
    </>
  );
};

export default UserApp;
