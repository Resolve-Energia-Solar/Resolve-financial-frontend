'use client';
import { Box, Drawer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ParentCard from './ParentCard';
import { useState } from 'react';

export default function SideDrawer({ title, children, open, onClose, anchor = 'right', processMap }) {

  return (
    <Drawer anchor={anchor} open={open} onClose={onClose}>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          position: 'relative',
          display: 'flex',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            width: '400px',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            padding: 2,
            borderRight: '1px solid #ccc',
            overflowY: 'auto',
          }}
        >
          {processMap}
        </Box>

        <Box
          sx={{
            marginLeft: '400px',
            width: 'calc(100vw - 400px)',
            height: '100vh',
            overflowY: 'auto',
          }}
        >
          <ParentCard title={title}>
            <Box
              sx={{
                height: 'calc(100vh - 106.1px)',
                paddingInline: 2,
                overflowY: 'auto',
              }}
            >
              {children}
            </Box>
          </ParentCard>
        </Box>
      </Box>
    </Drawer>
  );
}
