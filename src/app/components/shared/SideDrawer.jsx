import { useState } from 'react';
import { Box, Drawer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';

import ParentCard from './ParentCard';

export default function SideDrawer({ title, children, open, onClose, anchor = 'right', projectId }) {
  const [expandView, setExpand] = useState(false);


  return (
    <Drawer anchor={anchor} open={open} onClose={onClose}>
      <Box
        sx={{
          width: expandView ? '100vw' : '50vw',
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
            zIndex: 9999,
          }}
        >
          <IconButton onClick={() => setExpand(!expandView)}>
            {expandView ? <ZoomInMapIcon /> : <ZoomOutMapIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            width: '100%',
            height: '100vh',
            overflowY: 'auto',
            padding: 2,
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