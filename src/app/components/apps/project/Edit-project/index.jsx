'use client';
import { Tabs, Tab, Box, Button, Drawer } from '@mui/material';
import { useEffect, useState } from 'react';
import EditProjectTab from '@/app/components/apps/project/Edit-project/tabs/EditProject';
import { useParams } from 'next/navigation';
import CheckListRateio from '@/app/components/apps/checklist/Checklist-list';
import Attachments from '@/app/components/shared/Attachments';
import documentTypeService from '@/services/documentTypeService';
import ListRequest from '../../request/ListRequest';
import projectService from '@/services/projectService';
import RequestEnergyCompany from '@/hooks/requestEnergyCompany/Request';
import LateralForm from '../../request/LateralForm';
import History from '@/app/components/apps/history';
import SchedulesInspections from '../components/SchedulesInspections';
import ListInspection from '../components/SchedulesInspections/list-Inspections';
import RequestList from '../../request/Request-list';

const CONTENT_TYPE_PROJECT_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_PROJECT_ID;

export default function EditProject({ projectId = null }) {
  const params = useParams();
  let id = projectId;
  if (!projectId) id = params.id;

  console.log('ID: ', id);

  const [value, setValue] = useState(0);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [projectData, setProjectData] = useState(null);

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
        <Attachments
          contentType={CONTENT_TYPE_PROJECT_ID}
          objectId={id}
          documentTypes={documentTypes}
        />
      )}
      
      {value === 4 && (
        <Box mt={2}>
          <RequestList projectId={id} />
        </Box>
      )}

      {value === 5 && (
        <div>
          <History contentType={CONTENT_TYPE_PROJECT_ID} objectId={id} />
        </div>
      )}
    </>
  );
}
