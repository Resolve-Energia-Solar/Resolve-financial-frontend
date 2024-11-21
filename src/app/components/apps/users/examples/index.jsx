'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import UserList from '@/app/components/apps/users/examples/UserList';
import { Fade } from '@mui/material';

const UserApp = () => {
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);

  return (
    <>
      <Fade in={true}>
        <Box
          sx={{
            width: { xs: '100%', md: '100%', lg: '100%' },
            flexShrink: 0,
            backgroundColor: '#fafafa',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <UserList showrightSidebar={() => setRightSidebarOpen(true)} />
        </Box>
      </Fade>
    </>
  );
};

export default UserApp;
