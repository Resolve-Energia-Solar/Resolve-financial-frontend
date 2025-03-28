'use client';
import { Box, Drawer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ParentCard from './ParentCard';
import { useState } from 'react';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';

export default function SideDrawer({ title, children, open, onClose, anchor = 'right' }) {
  const [expandView, setExpand] = useState(false);
  return (
    <Drawer anchor={anchor} open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: '100vw', sm: '100vw' },
          maxWidth: { md: expandView ? '100vw' : '50vw' },
          height: '100vh',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <IconButton onClick={() => setExpand(!expandView)}>
            {expandView ? <ZoomInMapIcon /> : <ZoomOutMapIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <ParentCard title={title}>
          <Box
            sx={{
              height: 'calc(100vh - 106.1px)',
              paddingInline: 2,
              overflowY: 'auto', // Adicionado para habilitar a rolagem vertical
            }}
          >
            {children}
          </Box>
        </ParentCard>
      </Box>
    </Drawer>
  );
}
