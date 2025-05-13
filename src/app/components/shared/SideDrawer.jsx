import React, { useEffect, useState } from 'react';
import { Box, Drawer, IconButton } from '@mui/material';
import { useSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';

import ParentCard from './ParentCard';
import processService from '@/services/processService';

export default function SideDrawer({ title, children, open, onClose, anchor = 'right', projectId }) {
  const { enqueueSnackbar } = useSnackbar();
  const [expandView, setExpand] = useState(false);

  useEffect(() => {
    async function fetchProcessData() {
      // Mantém lógica de fetch caso necessário
      try {
        await processService.getProcessByObjectId('resolve_crm', 'project', projectId);
      } catch (error) {
        if (error.response?.data?.detail === "No Process matches the given query.") {
          enqueueSnackbar('Projeto sem processo definido', { variant: 'warning' });
        } else {
          console.error('Erro ao buscar processo:', error);
          enqueueSnackbar(`Erro ao buscar o processo: ${error.response?.data?.detail || error}`, { variant: 'error' });
        }
      }
    }
    if (projectId) fetchProcessData();
  }, [projectId, enqueueSnackbar]);

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