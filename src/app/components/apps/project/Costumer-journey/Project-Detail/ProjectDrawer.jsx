import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Drawer, Skeleton, Tabs, Tab, Typography } from '@mui/material';
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

function TabPanel({ children, value, index }) {
    return (
        <div role="tabpanel" hidden={value !== index} style={{ flex: 1, overflowY: 'auto' }}>
            {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
        </div>
    );
}

export default function ProjectDetailDrawer({ projectId, open, onClose }) {
    const { enqueueSnackbar } = useSnackbar();
    const [project, setProject] = useState(null);
    const [processId, setProcessId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);
    const [paneLimits, setPaneLimits] = useState({ min: 0, max: 0, default: 0 });

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
                    fields: 'id,sale,project_number,customer.complete_name',
                    expand: 'sale.customer',
                }),
                processService.getProcessByObjectId('resolve_crm', 'project', projectId)
                    .then(({ id }) => id)
                    .catch(err => {
                        if (err.response?.data?.detail === 'No Process matches the given query.') {
                            enqueueSnackbar('Projeto sem processo definido', { variant: 'warning' });
                        } else {
                            enqueueSnackbar(`Erro no processo: ${err.response?.data?.detail || err}`, { variant: 'error' });
                            console.error(err);
                        }
                        return null;
                    }),
            ]);
            setProject(proj);
            setProcessId(proc);
        } catch (error) {
            enqueueSnackbar(`Erro ao buscar dados: ${error.message}`, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }, [projectId, enqueueSnackbar]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleClose = useCallback(() => onClose(), [onClose]);
    const handleTabChange = (e, newVal) => setTab(newVal);
    const drawerWidth = useMemo(() => (processId ? '100vw' : '65vw'), [processId]);

    const tabs = [
        'Vistoria', 'Contratos', 'Financeiro', 'Engenharia', 'Anexos',
        'Logística', 'Instalação', 'Homologação', 'Histórico'
    ];

    const projectInfoTabs = (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Tabs
                value={tab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
            >
                {tabs.map(label => <Tab key={label} label={label} />)}
            </Tabs>
            <TabPanel value={tab} index={0}>
                <InspectionsTab projectId={projectId} />
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <EditSale sx={{ padding: 4 }} saleId={project?.sale} />
            </TabPanel>
            <TabPanel value={tab} index={2}>
                <PaymentCard sale={project?.sale} />
            </TabPanel>
            <TabPanel value={tab} index={3}>
                <EditProjectTab projectId={projectId} />
                <UploadDocument projectId={projectId} />
            </TabPanel>
            <TabPanel value={tab} index={4}>
                <Typography variant="h6" sx={{ mb: 3 }}>Anexos do Projeto</Typography>
                <AttachmentTable appLabel="resolve_crm" model="project" objectId={projectId} />
                <Typography variant="h6" sx={{ my: 3 }}>Anexos da Venda</Typography>
                <AttachmentTable appLabel="resolve_crm" model="sale" objectId={project?.sale} />
            </TabPanel>
            <TabPanel value={tab} index={5}>
                <LogisticsTab projectId={projectId} />
            </TabPanel>
            <TabPanel value={tab} index={6}>
                <InstallationsTab projectId={projectId} />
            </TabPanel>
            <TabPanel value={tab} index={7}><Typography>Conteúdo Homologação</Typography></TabPanel>
            <TabPanel value={tab} index={8}>
                <Typography variant="h6" sx={{ mb: 3 }}>Comentários do Projeto</Typography>
                <Comment appLabel="resolve_crm" model="project" objectId={projectId} />
                <Typography variant="h6" sx={{ my: 3 }}>Comentários da Venda</Typography>
                <Comment appLabel="resolve_crm" model="sale" objectId={project?.sale} />
            </TabPanel>
        </Box>
    );

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={handleClose}
            PaperProps={{ sx: { width: drawerWidth, zIndex: 1300, display: 'flex', flexDirection: 'column' } }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'grey.100' }}>
                <Typography variant="h5">Detalhes do Projeto nº {project?.project_number} - {project?.sale?.customer?.complete_name}</Typography>
                <IconButton onClick={handleClose}><CloseIcon /></IconButton>
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
                        {loading
                            ? <Skeleton variant="rectangular" width={100} height="100%" />
                            : <ProcessMap processId={processId} />
                        }
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
