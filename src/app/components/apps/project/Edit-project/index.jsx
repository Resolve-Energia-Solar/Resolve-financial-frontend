'use client';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import EditProjectTab from '@/app/components/apps/project/Edit-project/tabs/EditProject';
import { useParams } from 'next/navigation';
import CheckListRateio from '@/app/components/apps/checklist/Checklist-list';
import Attachments from '@/app/components/shared/Attachments';
import documentTypeService from '@/services/documentTypeService';
import projectService from '@/services/projectService';
import History from '@/app/components/apps/history';
import ListInspection from '../components/SchedulesInspections/list-Inspections';
import RequestList from '../../request/Request-list';
import UploadDocument from '../UploadDocument';
import AttachmentDetails from '@/app/components/shared/AttachmentDetails';
import Comment from '../../comment';

const CONTENT_TYPE_PROJECT_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_PROJECT_ID;
const CONTENT_TYPE_SALE_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_SALE_ID;

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      style={{
        display: value === index ? 'block' : 'none',
        flexGrow: 1,
        height: 'calc(100vh - 120px)',
        overflowY: 'auto',
        padding: '16px', 
      }}
      {...other}
    >
      {children}
    </div>
  );
}


export default function EditProject({ projectId = null }) {
  const params = useParams();
  const id = projectId || params.id;

  const [value, setValue] = useState(0);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [projectData, setProjectData] = useState(null);

  const handleChangeTab = useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await documentTypeService.getDocumentTypeFromEngineering();
        setDocumentTypes(response.results);
      } catch (error) {
        console.error('Error fetching document types:', error);
      }
    };
    fetchData();
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await projectService.getProjectById(id);
      setProjectData(response);
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChangeTab}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Informações Adicionais" />
        <Tab label="Vistoria" />
        <Tab label="Checklist Rateio" />
        <Tab label="Anexos" />
        <Tab label="Solicitações" />
        <Tab label="Lista de materiais" />
        <Tab label="Histórico" />
        <Tab label="Comentários da Venda" />
        <Tab label="Comentários do Projeto" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <EditProjectTab projectId={id} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Box mt={2}>
          <ListInspection
            projectId={id}
            product={projectData?.product?.id}
            customerId={projectData?.sale?.customer?.id}
          />
        </Box>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Box mt={2}>
          <CheckListRateio projectId={id} />
        </Box>
      </TabPanel>

      <TabPanel value={value} index={3}>
        <>
          <Typography variant="h6" sx={{ mt: 3 }}>
            Anexos do Projeto
          </Typography>
          <Attachments
            contentType={CONTENT_TYPE_PROJECT_ID}
            objectId={id}
            documentTypes={documentTypes}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Anexos da Venda
          </Typography>
          <AttachmentDetails
            contentType={CONTENT_TYPE_SALE_ID}
            objectId={projectData?.sale?.id}
            documentTypes={documentTypes}
          />
        </>
      </TabPanel>

      <TabPanel value={value} index={4}>
        <Box mt={2}>
          <RequestList projectId={id} enableFilters={false} enableIndicators={false} />
        </Box>
      </TabPanel>

      <TabPanel value={value} index={5}>
        <Box mt={2}>
          <UploadDocument projectId={id} project={projectData} />
        </Box>
      </TabPanel>

      <TabPanel value={value} index={6}>
        <Box mt={2}>
          <History contentType={CONTENT_TYPE_PROJECT_ID} objectId={id} />
        </Box>
      </TabPanel>

      <TabPanel value={value} index={7}>
        <Box mt={2}>
          <Comment
            appLabel="resolve_crm"
            model="sale"
            objectId={projectData?.sale?.id}
            label="Comentários da Venda"
          />
        </Box>
      </TabPanel>

      <TabPanel value={value} index={8}>
        <Box mt={2}>
          <Comment
            appLabel="resolve_crm"
            model="project"
            objectId={id}
            label="Comentários do Projeto"
          />
        </Box>
      </TabPanel>
    </>
  );
}
