import React, { useEffect, useState } from 'react';
import { Box, Drawer, IconButton } from '@mui/material';
import { useSnackbar } from 'notistack';
import CloseIcon from '@mui/icons-material/Close';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import SplitPane from 'react-split-pane';

import ParentCard from './ParentCard';
import ProcessMap from './ProcessMap';
import processService from '@/services/processService';

export default function SideDrawer({ title, children, open, onClose, anchor = 'right', projectId }) {
  const [processId, setProcessId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [expandView, setExpand] = useState(false);
  const [sizes, setSizes] = useState([100, '30%', 'auto']);

  useEffect(() => {
    async function fetchProcessData() {
      if (!projectId) return;
      try {
        const processData = await processService.getProcessByObjectId('resolve_crm', 'project', projectId);
        if (processData.id) {
          setProcessId(processData.id);
        } else {
          setProcessId(null);
        }
      } catch (error) {
        if (error.response?.data?.detail === "No Process matches the given query.") {
          enqueueSnackbar('Projeto sem processo definido', { variant: 'warning' });
        } else {
          console.error('Erro ao buscar processId:', error);
          enqueueSnackbar(`Erro ao buscar o identificador do processo: ${error.response?.data?.detail || error}`, { variant: 'error' });
        }
        setProcessId(null);
      }
    }
    fetchProcessData();
  }, [projectId, enqueueSnackbar]);

  return (
    <Drawer anchor={anchor} open={open} onClose={onClose}>
      <Box
        sx={{
          width: processId ? '100vw' : expandView ? '100vw' : '50vw',
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
          {processId ? null : (
            <IconButton onClick={() => setExpand(!expandView)}>
              {expandView ? <ZoomInMapIcon /> : <ZoomOutMapIcon />}
            </IconButton>
          )}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {processId ? (
          <SplitPane
            split="vertical"
            minSize={300}
            maxSize={800}
            defaultSize={400}
            resizerStyle={{
              background: '#ccc',
              opacity: 0.5,
              cursor: 'col-resize',
              width: '5px'
            }}
            onChange={setSizes}
            paneStyle={{ overflowY: 'auto' }}
          >
            <Box sx={{ height: '100vh', overflowY: 'auto', padding: 2 }}>
              <ProcessMap processId={processId} />
            </Box>
            <Box sx={{ height: '100vh', overflowY: 'auto' }}>
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
          </SplitPane>
        ) : (
          <Box
            sx={{
              marginLeft: processId ? '400px' : '0',
              width: processId ? 'calc(100vw - 400px)' : '100vw',
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
        )}
      </Box>
    </Drawer>
  );
}
