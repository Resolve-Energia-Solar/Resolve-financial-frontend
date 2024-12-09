'use client';
import { Tabs, Tab, Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import EditProjectTab from '@/app/components/apps/project/Edit-project/tabs/EditProject';
import { useParams } from 'next/navigation';
import CheckListRateio from '@/app/components/apps/checklist/Checklist-list';
import Attachments from '@/app/components/shared/Attachments';
import documentTypeService from '@/services/documentTypeService';
import ListRequest from '../../request/ListRequest';

const CONTENT_TYPE_PROJECT_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_PROJECT_ID;

export default function EditProject({ projectId = null }) {
  const params = useParams();
  let id = projectId;
  if (!projectId) id = params.id;

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

      {value === 0 && <EditProjectTab projectId={id} />}

      {value === 1 && (
        <Box mt={2}>
          <CheckListRateio projectId={id} />
        </Box>
      )}

      {value === 2 && (
        <Attachments
          contentType={CONTENT_TYPE_PROJECT_ID}
          objectId={id}
          documentTypes={documentTypes}
        />
      )}
      {value === 3 &&
        <div>
          <ListRequest data={[]} />
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBlock: '12px' }}>
            <Button>Novo</Button>
          </div>
        </div>}
    </>
  );
}
