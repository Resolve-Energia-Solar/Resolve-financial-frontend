import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  IconButton,
  Drawer,
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import projectService from '@/services/projectService';
import InspectionsTab from './Inspections/InspectionsTab';
import EditSale from '../../../comercial/sale/Edit-sale/tabs/sale';
import PaymentCard from '../../../invoice/components/paymentList/card';
import EditProjectTab from '../../Edit-project/tabs/EditProject';
import UploadDocument from '../../UploadDocument';
import AttachmentTable from '../../../attachment/attachmentTable';
import LogisticsTab from './logistics/LogisticsTab';
import InstallationsTab from './installations/InstallationsTab';
import CommentsTab from './Comments/CommentsTab';
import RequestList from '../../../request/Request-list';
import History from '../../../history';
import CheckListRateio from '../../../checklist/Checklist-list';
import ConstructionsTab from './Construction/ConstructionsTab';
import LossesTab from './Losses/LossesTab';
import { useSelector } from 'react-redux';
import CustomerTab from './Customer/CustomerTab';

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
  const user = useSelector((state) => state.user?.user);
  const userPermissions = user?.user_permissions;
  const canEdit = userPermissions?.includes('resolve_crm.can_manage_journey');

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
          fields:
            'id,project_number,sale,customer.complete_name,field_services.service.name,field_services.final_service_opinion.name',
          expand: 'sale.customer,field_services.service,field_services.final_service_opinion,sale',
        }),
      ]);
      setProject(proj);
      setProcessId(proc);
      const constructionKeywords = ['obra', 'sombreamento'];
      const hasConstruction = proj.field_services?.some((fs) => {
        if (!fs.service?.name?.toLowerCase().includes('vistoria')) return false;

        const opinionName = fs.final_service_opinion?.name?.toLowerCase() || '';
        return constructionKeywords.some((keyword) => opinionName.includes(keyword));
      });
      setHasConstructionTab(hasConstruction);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClose = useCallback(() => onClose(), [onClose]);
  const handleTabChange = (e, newVal) => setTab(newVal);
  const drawerWidth = useMemo(() => (processId ? '100vw' : '65vw'), [processId]);

  const tabsConfig = useMemo(
    () =>
      [
        { label: 'Cliente', content: <CustomerTab projectId={projectId} viewOnly={!canEdit} /> },
        { label: 'Contratos', content: <EditSale saleId={project?.sale?.id} /> },
        {
          label: 'Vistoria',
          content: <InspectionsTab projectId={projectId} viewOnly={!canEdit} />,
        },
        hasConstructionTab && {
          label: 'Obras',
          content: <ConstructionsTab projectId={projectId} viewOnly={!canEdit} />,
        },
        { label: 'Financeiro', content: <PaymentCard sale={project?.sale?.id} /> },
        {
          label: 'Engenharia',
          content: (
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2 }}>
              <EditProjectTab projectId={projectId} detail={!canEdit} />

              <Divider sx={{ my: 2 }} />

              {canEdit && <UploadDocument projectId={projectId} />}

              <Divider sx={{ my: 2 }} />

              <CheckListRateio
                projectId={projectId}
                label="Checklist de Rateio"
                canEdit={!canEdit}
              />
            </Box>
          ),
        },
        {
          label: 'Anexos',
          content: (
            <>
              <Card sx={{ my: 3, boxShadow: 7 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Anexos do Projeto
                  </Typography>
                  <AttachmentTable
                    hideTitle={true}
                    appLabelDocument="engineering"
                    appLabel="resolve_crm"
                    model="project"
                    objectId={projectId}
                    hideStatus={false}
                    viewOnly={!canEdit}
                  />
                </CardContent>
              </Card>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Anexos do Venda
                  </Typography>
                  <AttachmentTable
                    hideTitle={true}
                    appLabelDocument="contracts"
                    appLabel="resolve_crm"
                    model="sale"
                    objectId={project?.sale?.id}
                    hideStatus={false}
                    viewOnly={!canEdit}
                  />
                </CardContent>
              </Card>
            </>
          ),
        },
        { label: 'Logística', content: <LogisticsTab projectId={projectId} viewOnly={!canEdit} /> },
        {
          label: 'Instalação',
          content: <InstallationsTab projectId={projectId} viewOnly={!canEdit} />,
        },
        {
          label: 'Homologação',
          content: (
            <RequestList
              projectId={projectId}
              enableFilters={false}
              enableIndicators={false}
              viewOnly={!canEdit}
            />
          ),
        },
        { label: 'Perdas', content: <LossesTab projectId={projectId} viewOnly={!canEdit} /> },
        {
          label: 'Histórico',
          content: <History objectId={projectId} appLabel="resolve_crm" model="project" />,
        },
        {
          label: 'Comentários',
          content: <CommentsTab projectId={projectId} userPermissions={userPermissions} />,
        },
      ].filter(Boolean),
    [project, projectId, hasConstructionTab],
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
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Tabs value={tab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          {tabsConfig.map((t, i) => (
            <Tab key={i} label={t.label} />
          ))}
        </Tabs>
        {tabsConfig.map((t, i) => (
          <TabPanel key={i} value={tab} index={i}>
            {t.content}
          </TabPanel>
        ))}
      </Box>
    </Drawer>
  );
}

ProjectDetailDrawer.propTypes = {
  projectId: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
