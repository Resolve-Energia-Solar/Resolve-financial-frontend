'use client';
import { Tabs, Tab, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import EditProjectTab from '@/app/components/apps/project/Edit-project/tabs/EditProject';
import { useParams } from 'next/navigation';
import CheckListRateio from '@/app/components/apps/checklist/Checklist-list';
import Attachments from '@/app/components/shared/Attachments';
import documentTypeService from '@/services/documentTypeService';
import ProductCard from '@/app/components/apps/product/Product-list';

const CONTENT_TYPE_PROJECT_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_PROJECT_ID;

export default function EditProject() {
  const params = useParams();
  const { id } = params;

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
        <Tab label="Produtos" />
        <Tab label="Anexos" />
      </Tabs>

      {value === 0 && <EditProjectTab />}

      {value === 1 && (
        <Box mt={2}>
          <CheckListRateio projectId={id} />
        </Box>
      )}

      {value === 2 && <Box mt={2}> <ProductCard /></Box>}

      {value === 3 && (
        <Attachments
          contentType={CONTENT_TYPE_PROJECT_ID}
          objectId={id}
          documentTypes={documentTypes}
        />
      )}
    </>
  );
}
