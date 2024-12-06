import { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  useTheme,
  Dialog,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import StatusIcon from '@mui/icons-material/AssignmentTurnedIn';
import DescriptionIcon from '@mui/icons-material/Description';
import projectService from '@/services/projectService';
import { Add, CallToAction, FlashAuto, SolarPower } from '@mui/icons-material';
import CustomAccordion from '@/app/components/apps/project/components/CustomAccordion';
import Attachments from '@/app/components/shared/Attachments';
import documentTypeService from '@/services/documentTypeService';

import InfoIcon from '@mui/icons-material/Info';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import CheckListRateio from '../../checklist/Checklist-list';
import StatusChip from '../../comercial/sale/components/DocumentStatusIcon';
import SkeletonCard from '../components/SkeletonCard';
import CheckListRateioDetail from '../../checklist/Checklist-detail/checklistDetail';
import AttachmentDetails from '@/app/components/shared/AttachmentDetails';
import DetailProject from '.';

const CONTEXT_TYPE_PROJECT_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_PROJECT_ID;

const ProjectListDetail = ({ saleId = null }) => {
  const theme = useTheme();
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [responseGenerateError, setResponseGenerateError] = useState(null);
  const [responsePreviewGenerate, setResponsePreviewGenerate] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [documentTypes, setDocumentTypes] = useState([]);

  const [refresh, setRefresh] = useState(false);

  const refreshList = () => {
    setRefresh(!refresh);
  };

  const handleEditClick = (id) => {
    setSelectedProjectId(id);
    setEditModalOpen(true);
  };

  const handleDetailClick = (id) => {
    setSelectedProjectId(id);
    setDetailModalOpen(true);
  };

  const handleCreateClick = () => {
    setCreateModalOpen(true);
  };

  const closeGenerateModal = () => {
    setCreateModalOpen(false);
    setResponseGenerateError(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await projectService.getProjectBySale(saleId);
        console.log('Projects: ', response.results);
        setProjectsList(response.results);
      } catch (error) {
        console.log('Error: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const fetchPreviewGenerateProject = async () => {
      try {
        const response = await projectService.getPreviewGenerateProject(saleId);
        setResponsePreviewGenerate(response);
      } catch (error) {
        console.log('Error: ', error);
      }
    };
    fetchPreviewGenerateProject();
  }, [refresh]);

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

  const fetchGenerateProject = async () => {
    setLoadingGenerate(true);
    try {
      const response = await projectService.generateProjectBySale(saleId);
      refreshList();
      setCreateModalOpen(false);
    } catch (error) {
      setResponseGenerateError(error?.response?.data?.message);
    } finally {
      setLoadingGenerate(false);
    }
  };

  return (
    <Grid container spacing={2} mt={2}>
      <Grid item xs={12}>
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
        ) : projectsList.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body2" color={theme.palette.text.secondary}>
              Nenhum projeto encontrado.
            </Typography>
          </Grid>
        ) : (
          projectsList.map((project) => (
            <Card
              key={project.id}
              variant="outlined"
              sx={{
                p: 3,
                mb: 3,
                backgroundColor: theme.palette.background.paper,
                borderLeft: `5px solid ${
                  project.status === 'F' ? theme.palette.success.main : theme.palette.warning.main
                }`,
              }}
            >
              <CardContent>
                <CustomAccordion title="Informações Adicionais" defaultExpanded>
                  <Box display="flex" alignItems="center" mb={1}>
                    <PersonIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Projetista: {project?.designer?.complete_name || 'N/A'}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <SolarPower sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Quantidade Modulos: {project?.solar_energy_kit?.modules_amount || 'N/A'}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CallToAction sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Quantidade Inversores: {project?.solar_energy_kit?.inversor_amount || 'N/A'}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <FlashAuto sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      KWP: {project?.solar_energy_kit?.kwp || 'N/A'}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <StatusIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
                    <Typography variant="body1">
                      Status: <StatusChip status={project.status} />
                    </Typography>
                  </Box>
                </CustomAccordion>

                <CustomAccordion title="Checklist Rateio">
                  <CheckListRateioDetail projectId={project.id} />
                </CustomAccordion>

                <CustomAccordion title="Documentos">
                  <Typography>
                    <AttachmentDetails
                      contentType={CONTEXT_TYPE_PROJECT_ID}
                      objectId={project.id}
                      documentTypes={documentTypes}
                    />
                  </Typography>
                </CustomAccordion>

                <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                  <Tooltip title="Detalhes do Projeto">
                    <IconButton
                      variant="outlined"
                      color="primary"
                      onClick={() => handleDetailClick(project.id)}
                    >
                      <DescriptionIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Grid>

      {/* Modal de Detalhes */}
      <Dialog
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <DetailProject projectId={selectedProjectId} />
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default ProjectListDetail;
