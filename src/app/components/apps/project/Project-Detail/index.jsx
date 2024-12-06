'use client';
import { Tabs, Tab, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import EditProjectTab from '@/app/components/apps/project/Edit-project/tabs/EditProject';
import { useParams } from 'next/navigation';
import documentTypeService from '@/services/documentTypeService';
import CheckListRateioDetail from '../../checklist/Checklist-detail/checklistDetail';
import AttachmentDetails from '@/app/components/shared/AttachmentDetails';

const CONTENT_TYPE_PROJECT_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_PROJECT_ID;

export default function DetailProject({ projectId=null }) {
  const params = useParams();
  let id = projectId;
  if (!projectId) id = params.id;

  console.log('DetailProject id: ', id);

  const [value, setValue] = useState(0);
  const [documentTypes, setDocumentTypes] = useState([]);

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
  }, []);

  return (
    <>
      <Tabs value={value} onChange={handleChangeTab}>
        <Tab label="Informações Adicionais" />
        <Tab label="Checklist Rateio" />
        <Tab label="Anexos" />
        <Tab label="Solicitações" />
      </Tabs>

      {value === 0 && <EditProjectTab projectId={id} detail={true} />}

      {value === 1 && (
        <Box mt={2}>
          <CheckListRateioDetail projectId={id} />
        </Box>
      )}

      {value === 2 && (
        <AttachmentDetails
          contentType={CONTENT_TYPE_PROJECT_ID}
          objectId={id}
          documentTypes={documentTypes}
        />
      )}
      {value === 3 && <div>Solicitações</div>}
    </>
  );
}
