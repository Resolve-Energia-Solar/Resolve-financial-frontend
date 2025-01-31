'use client';
import { Tabs, Tab, Box, Button, Drawer, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
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

const CONTENT_TYPE_PROJECT_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_PROJECT_ID;
const CONTENT_TYPE_SALE_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_SALE_ID;

export default function EditProject({ projectId = null }) {
  const params = useParams();
  let id = projectId;
  if (!projectId) id = params.id;

  const [value, setValue] = useState(0);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [projectData, setProjectData] = useState(null);

  console.log('projectData: ', projectData);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await documentTypeService.getDocumentTypeFromEngineering();
        setDocumentTypes(response.results);
        console.log('Document Types: ', response.results);
      } catch (error) {
        console.log('Error: ', error);
      }
    };
    fetchData();
    fetchProject();
  }, []);

  async function fetchProject() {
    try {
      const response = await projectService.getProjectById(id);
      setProjectData(response);
      console.log('Project: ', response);
    } catch (error) {
      console.log('Error: ', error);
    }
  }

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
      </Tabs>

      {value === 0 && <EditProjectTab projectId={id} />}

      {value === 1 && (
        <Box mt={2}>
          <ListInspection
            projectId={id}
            product={projectData?.product?.id}
            customerId={projectData?.sale?.customer?.id}
          />
        </Box>
      )}

      {value === 2 && (
        <Box mt={2}>
          <CheckListRateio projectId={id} />
        </Box>
      )}

      {value === 3 && (
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
      )}

      {value === 4 && (
        <Box mt={2}>
          <RequestList projectId={id} />
        </Box>
      )}

      {value === 5 && (
        <div>
          <UploadDocument projectId={id} project={projectData} />
        </div>
      )}
      {value === 6 && (
        <div>
          <History contentType={CONTENT_TYPE_PROJECT_ID} objectId={id} />
        </div>
      )}
    </>
  );
}
