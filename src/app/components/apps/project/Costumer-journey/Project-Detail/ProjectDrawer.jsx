import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Drawer, Skeleton, Tabs, Tab, Typography, Card, CardContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import SplitPane from 'react-split-pane';
import projectService from '@/services/projectService';
import processService from '@/services/processService';
import ProcessMap from '@/app/components/shared/ProcessMap';
import InspectionsTab from './Inspections/InspectionsTab';
import EditSale from '../../../comercial/sale/Edit-sale/tabs/sale';
import PaymentCard from '../../../invoice/components/paymentList/card';
import EditProjectTab from '../../Edit-project/tabs/EditProject';
import UploadDocument from '../../UploadDocument';
import AttachmentTable from '../../../attachment/attachmentTable';
import Comment from '@/app/components/apps/comment';
import LogisticsTab from './logistics/LogisticsTab';
import InstallationsTab from './installations/InstallationsTab';
import CommentsTab from './Comments/CommentsTab';
import RequestList from '../../../request/Request-list';
import History from '../../../history';
import CheckListRateio from '../../../checklist/Checklist-list';
import ConstructionsTab from './Construction/ConstructionsTab';
import LossesTab from './Losses/LossesTab';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ flex: 1, overflowY: 'auto' }}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function ProjectDetailDrawer({ projectId, open, onClose, refresh }) {
  const { enqueueSnackbar } = useSnackbar();
  const [project, setProject] = useState(null);
  const [processId, setProcessId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [paneLimits, setPaneLimits] = useState({ min: 0, max: 0, default: 0 });
  const [hasConstructionTab, setHasConstructionTab] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const w = window.innerWidth;
      const defaultSizePx = Math.round(w * 0.2);
      setPaneLimits({
        min: Math.round(w * 0.2),
        max: Math.round(w * 0.4),
        default: defaultSizePx,
      });
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const [proj, proc] = await Promise.all([
        projectService.find(projectId, {
          fields: 'id,project_number,sale,customer.complete_name,field_services.service.name,field_services.final_service_opinion.name',
          expand: 'sale.customer,field_services.service,field_services.final_service_opinion,sale',
        }),
        processService.getProcessByObjectId('resolve_crm', 'project', projectId)
          .then(({ id }) => id)
          .catch(() => null),
      ]);
      setProject(proj);
      setProcessId(proc);
      const hasObra = proj.field_services?.some(fs =>
        fs.service?.name?.includes('Vistoria') &&
        (fs.final_service_opinion?.name?.includes('Obra') || fs.final_service_opinion?.name?.includes('Sombreamento'))
      );
      setHasConstructionTab(hasObra);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  console.log('Project:', project);

  const handleClose = useCallback(() => onClose(), [onClose]);
  const handleTabChange = (e, newVal) => setTab(newVal);
  const drawerWidth = useMemo(() => (processId ? '100vw' : '65vw'), [processId]);

  const tabsConfig = useMemo(() => [
    { label: 'Vistoria', content: <InspectionsTab projectId={projectId} /> },
    hasConstructionTab && { label: 'Obras', content: <ConstructionsTab projectId={projectId} /> },
    { label: 'Contratos', content: <EditSale saleId={project?.sale?.id} /> },
    { label: 'Financeiro', content: <PaymentCard sale={project?.sale?.id} /> },
    {
      label: 'Engenharia', content:
        <>
          <EditProjectTab projectId={projectId} />

          <Box my={3} borderTop="1px solid #ccc" />

          <UploadDocument projectId={projectId} />

          <Box my={3} borderTop="1px solid #ccc" />

          <CheckListRateio projectId={projectId} label="Checklist" />
        </>
    },
    {
      label: 'Anexos',
      content: (
        <>
          <Card sx={{ my: 3, boxShadow: 7 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Anexos do Projeto</Typography>
              <AttachmentTable hideTitle={true} appLabel="resolve_crm" model="project" objectId={projectId} />
            </CardContent>
          </Card>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Anexos do Venda</Typography>
              <AttachmentTable hideTitle={true} appLabel="resolve_crm" model="sale" objectId={project?.sale?.id} />
            </CardContent>
          </Card>
        </>
      ),
    },
    { label: 'Logística', content: <LogisticsTab projectId={projectId} /> },
    { label: 'Instalação', content: <InstallationsTab projectId={projectId} /> },
    { label: 'Homologação', content: <RequestList projectId={projectId} enableFilters={false} enableIndicators={false} /> },
    { label: 'Perdas', content: <LossesTab projectId={projectId} /> },
    { label: 'Histórico', content: <History objectId={projectId} appLabel="resolve_crm" model="project" /> },
    { label: 'Comentários', content: <CommentsTab projectId={projectId} /> },
  ].filter(Boolean), [project, projectId, hasConstructionTab]);

  const projectInfoTabs = (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Tabs value={tab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
        {tabsConfig.map((t, i) => <Tab key={i} label={t.label} />)}
      </Tabs>
      {tabsConfig.map((t, i) => <TabPanel key={i} value={tab} index={i}>{t.content}</TabPanel>)}
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { width: drawerWidth, zIndex: 1300, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          bgcolor: 'grey.100',
        }}
      >
        <Typography variant="h5">
          Detalhes do Projeto nº {project?.project_number} -{' '}
          {project?.sale?.customer?.complete_name}
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {processId ? (
        <SplitPane
          split="vertical"
          minSize={paneLimits.min}
          maxSize={paneLimits.max}
          defaultSize={paneLimits.default}
          style={{ position: 'relative', height: '100vh' }}
          resizerStyle={{ background: '#ccc', width: 5, cursor: 'col-resize' }}
          paneStyle={{ overflowY: 'auto' }}
        >
          <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
            {loading ? (
              <Skeleton variant="rectangular" width={100} height="100%" />
            ) : (
              <ProcessMap processId={processId} />
            )}
          </Box>
          {projectInfoTabs}
        </SplitPane>
      ) : (
        projectInfoTabs
      )}
    </Drawer>
  );
}

ProjectDetailDrawer.propTypes = {
  projectId: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
