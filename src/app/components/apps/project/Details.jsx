'use client';
import { Tabs, Tab, Box, Button, Drawer } from '@mui/material';
import { useEffect, useState } from 'react';
import Attachments from '@/app/components/shared/Attachments';
import documentTypeService from '@/services/documentTypeService';
import ListRequest from '../request/ListRequest';
import projectService from '@/services/projectService';
import RequestEnergyCompany from '@/hooks/requestEnergyCompany/Request';
import LateralForm from '../request/LateralForm';
import History from '@/app/components/apps/history';
import { TabPanel } from '../../shared/TabPanel';
import Infor from './Infor';
import CheckList from './CheckList';
import Loading from '@/app/loading';
import SideDrawer from '../../shared/SideDrawer';
import SendingForm from '../request/SendingForm';

const CONTENT_TYPE_PROJECT_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_PROJECT_ID;

export default function Details({ id = null, data }) {
  const {
    selectedItem,
    openDrawer,
    openDrawerCreate,
    setOpenDrawerCreate,
    isEditing,
    formData,
    selectedValues,
    situationOptions,
    handleChangeSituation,
    requestData,
    load,
    due_date,
    handleSave,
    handleRowClick,
    toggleDrawerClosed,
    handleInputChange,
    handleCreate,
    handleEditToggle,
    formDataCreate,
    handleCreateRequest,
  } = RequestEnergyCompany();

  console.log('sending3', data);

  const [value, setValue] = useState(0);
  const [documentTypes, setDocumentTypes] = useState([]);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await documentTypeService.index({
          app_label__in: 'contracts',
          limit: 30,
        });
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
      <Tabs value={value} onChange={handleChangeTab}>
        <Tab label="Informações Adicionais" />
        <Tab label="Checklist Rateio" />
        <Tab label="Anexos" />
        <Tab label="Solicitações" />
        <Tab label="Histórico" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Infor id={id} data={data} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Box mt={2}>
          <CheckList id={id} data={data} />
        </Box>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Attachments
          contentType={CONTENT_TYPE_PROJECT_ID}
          objectId={id}
          documentTypes={documentTypes}
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <div>
          {load ? (
            <ListRequest data={data?.requests_energy_company} onClick={handleRowClick} />
          ) : (
            <Loading />
          )}
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginBlock: '12px',
            }}
          >
            <Button onClick={() => handleCreateRequest(data)}>Novo</Button>
          </div>
          <SideDrawer title={'Detalhamento'} open={openDrawer} onClose={toggleDrawerClosed}>
            {selectedItem && situationOptions.length > 0 && (
              <LateralForm
                handleChangeSituation={handleChangeSituation}
                isEditing={isEditing}
                formData={formData}
                due_date={due_date}
                handleInputChange={handleInputChange}
                options={situationOptions}
                multiSelectValues={selectedValues}
                handleEditToggle={handleEditToggle}
                handleSave={handleSave}
              />
            )}
          </SideDrawer>
          <SideDrawer
            title={'Nova Solicitação'}
            open={openDrawerCreate}
            onClose={() => setOpenDrawerCreate(false)}
          >
            <SendingForm
              handleChangeSituation={handleChangeSituation}
              formData={data}
              due_date={due_date}
              handleInputChange={handleInputChange}
              options={situationOptions}
              multiSelectValues={selectedValues}
              handleSave={handleCreate}
            />
          </SideDrawer>
        </div>
      </TabPanel>

      <TabPanel value={value} index={4}>
        <History contentType={CONTENT_TYPE_PROJECT_ID} objectId={id} />
      </TabPanel>
    </>
  );
}
