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
import StatusChip from '../../../proposal/components/ProposalStatusChip';
import projectService from '@/services/projectService';
import { Add, CallToAction, FlashAuto, SolarPower } from '@mui/icons-material';
import SkeletonCard from '../SkeletonCard';
import CustomAccordion from '@/app/components/apps/project/components/CustomAccordion';
import CheckListRateio from '../../../checklist/Checklist-list';
import Attachments from '@/app/components/shared/Attachments';
import documentTypeService from '@/services/documentTypeService';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import InfoIcon from '@mui/icons-material/Info';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';

const CONTEXT_TYPE_PROJECT_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_PROJECT_ID;

const ProjectListCards = ({ saleId = null }) => {
  const theme = useTheme();
  const [projectsList, setProjectsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [responseGenerateError, setResponseGenerateError] = useState(null);
  const [responsePreviewGenerate, setResponsePreviewGenerate] = useState(null);

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
      <Grid item xs={8}>
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
        ) : projectsList.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body2" color={theme.palette.text.secondary}>
              Nenhuma fatura encontrada.
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
                  <CheckListRateio projectId={project.id} />
                </CustomAccordion>

                <CustomAccordion title="Documentos">
                  <Typography>
                    <Attachments
                      contentType={CONTEXT_TYPE_PROJECT_ID}
                      objectId={project.id}
                      documentTypes={documentTypes}
                    />
                  </Typography>
                </CustomAccordion>

                <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                  <Tooltip title="Editar Projeto">
                    <IconButton
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditClick(project.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
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
      <Grid item xs={4}>
        <Box display="flex" justifyContent="flex-end" alignItems="flex-start">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleCreateClick}
            fullWidth
          >
            Gerar Projeto
          </Button>
        </Box>
      </Grid>

      <Dialog open={createModalOpen} onClose={closeGenerateModal} maxWidth="md" fullWidth>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            O projeto será gerado automaticamente com base nos Produtos da Venda.
          </Alert>

          {/* Lista de pendentes para geração */}
          {responsePreviewGenerate?.pending_generation?.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom color="warning.main">
                Pendentes de Geração:
              </Typography>
              {responsePreviewGenerate.pending_generation.map((product) => (
                <Card
                  key={product.product_id}
                  variant="h5"
                  sx={{
                    mb: 2,
                    p: 2,
                    backgroundColor: theme.palette.warning.light,
                    borderLeft: `5px solid ${theme.palette.warning.main}`,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <CategoryIcon color="primary" />
                      {product?.product_name ?? 'Produto não especificado'}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <InfoIcon color="info" />
                      <strong>Quantidade:</strong> {product?.amount ?? 'N/A'}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <AttachMoneyIcon color="success" />
                      <strong>Valor:</strong> R$ {product?.value?.toFixed(2) ?? 'N/A'}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <AttachMoneyIcon color="info" />
                      <strong>Valor de Referência:</strong> R${' '}
                      {product?.reference_value?.toFixed(2) ?? 'N/A'}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <AttachMoneyIcon color="error" />
                      <strong>Custo:</strong> R$ {product?.cost_value?.toFixed(2) ?? 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {/* Lista de já gerados */}
          {responsePreviewGenerate?.already_generated?.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom color="success.main">
                Já Gerados:
              </Typography>
              {responsePreviewGenerate.already_generated.map((product) => (
                <Card
                  key={product.product_id}
                  variant="h5"
                  sx={{
                    mb: 2,
                    p: 2,
                    backgroundColor: theme.palette.success.light,
                    borderLeft: `5px solid ${theme.palette.success.main}`,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <CategoryIcon color="primary" />
                      {product?.product_name ?? 'Produto não especificado'}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <InfoIcon color="info" />
                      <strong>Quantidade:</strong> {product?.amount ?? 'N/A'}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <AttachMoneyIcon color="success" />
                      <strong>Valor:</strong> R$ {product?.value?.toFixed(2) ?? 'N/A'}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <AttachMoneyIcon color="info" />
                      <strong>Valor de Referência:</strong> R${' '}
                      {product?.reference_value?.toFixed(2) ?? 'N/A'}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <AttachMoneyIcon color="error" />
                      <strong>Custo:</strong> R$ {product?.cost_value?.toFixed(2) ?? 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {/* Caso não haja itens para exibir */}
          {responsePreviewGenerate?.pending_generation?.length === 0 &&
            responsePreviewGenerate?.already_generated?.length === 0 && (
              <Typography variant="body2" color="textSecondary">
                Nenhum produto disponível para exibição.
              </Typography>
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeGenerateModal} color="secondary">
            Cancelar
          </Button>
          {responsePreviewGenerate?.pending_generation?.length > 0 && (
            <Button
              onClick={fetchGenerateProject}
              color="primary"
              disabled={loadingGenerate}
              endIcon={loadingGenerate ? <CircularProgress size={20} color="inherit" /> : null}
            >
              Gerar Projetos
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default ProjectListCards;
