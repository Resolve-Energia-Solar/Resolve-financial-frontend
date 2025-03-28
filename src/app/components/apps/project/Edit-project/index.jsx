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
import useDocumentTypesByFilter from '@/hooks/document-types/useDocumenTypeByFilter';

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

export default function EditProject({ projectData, projectId }) {
  console.log('projectData', projectData);
  const [value, setValue] = useState(0);
  const { documentTypes } = useDocumentTypesByFilter({ app_label__in: 'engineering' });

  const handleChangeTab = useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  return (
    <>
      <Tabs value={value} onChange={handleChangeTab} variant="scrollable" scrollButtons="auto">
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
        <EditProjectTab projectId={projectId} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Box mt={2}>
          <ListInspection
            projectId={projectId}
            product={projectData?.product?.id}
            customerId={projectData?.sale?.customer?.id}
          />
        </Box>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Box mt={2}>
          <CheckListRateio projectId={projectId} />
        </Box>
      </TabPanel>

      <TabPanel value={value} index={3}>
        <>
          <Typography variant="h6" sx={{ mt: 3 }}>
            Anexos do Projeto
          </Typography>
          <Attachments
            contentType={CONTENT_TYPE_PROJECT_ID}
            objectId={projectId}
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
          <RequestList projectId={projectId} enableFilters={false} enableIndicators={false} />
        </Box>
      </TabPanel>

      <TabPanel value={value} index={5}>
        <Box mt={2}>
          <UploadDocument projectId={projectId} project={projectData} />
        </Box>
      </TabPanel>

      <TabPanel value={value} index={6}>
        <Box mt={2}>
          <History contentType={CONTENT_TYPE_PROJECT_ID} objectId={projectId} />
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
            objectId={projectId}
            label="Comentários do Projeto"
          />
        </Box>
      </TabPanel>
    </>
  );
}
