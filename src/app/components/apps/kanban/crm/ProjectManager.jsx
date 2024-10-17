import { Grid, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { ProjectForm } from './ProjectForm';
import projectService from '@/services/projectService';

const ProjectManager = ({
  projects = [],
  designers = [],
  homologators = [],
  branches = [],
  managers = [],
  sellers = [],
  supervisors = [],
  addresses = [],
  marketingCampaigns = [],
  leads = [],
}) => {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectData, setProjectData] = useState(null);

  const handleAddProject = () => {
    setProjectData({
      project_number: '',
      start_date: '',
      end_date: '',
      status: '',
      designer_id: '',
      homologator_id: '',
      supply_type: '',
      kwp: '',
      registered_circuit_breaker: '',
      instaled_circuit_breaker: '',
      project_circuit_breaker: '',
      customer_id: '',
      seller_id: '',
      sales_supervisor_id: '',
      sales_manager_id: '',
      branch_id: '',
      marketing_campaign_id: '',
      lead_id: '',
      total_value: '',
      is_sale: false,
      is_completed_document: false,
      document_completion_date: '',
    });
    setShowProjectForm(true);
  };

  const handleEditProject = (project) => {
    setProjectData(project);
    setShowProjectForm(true);
  };

  const handleCloseProjectForm = () => {
    setShowProjectForm(false);
    setProjectData(null);
  };

  const handleSaveProject = async () => {
    try {
      if (projectData) {
        const response = await projectService.createProject(projectData);
        console.log('Projeto criado com sucesso:', response);
        handleCloseProjectForm();
      }
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
    }
  };

  return (
    <Grid container spacing={4}>
      {projects.length === 0 && !showProjectForm && (
        <Grid item xs={12}>
          <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            <Typography variant="h6" gutterBottom>
              Nenhum projeto encontrado
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              startIcon={<AddIcon />}
              onClick={handleAddProject}
            >
              Adicionar Projeto
            </Button>
          </Box>
        </Grid>
      )}

      {projects.length > 0 &&
        !showProjectForm &&
        projects.map((project) => (
          <Grid item xs={12} key={project.id}>
            <Card variant="outlined" sx={{ p: 3, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Projeto Número: {project.project_number || 'N/A'}
                </Typography>
                <Typography>Status: {project.status || 'N/A'}</Typography>
                <Typography>Data de Início: {project.start_date || 'N/A'}</Typography>
                <Typography>Data de Término: {project.end_date || 'N/A'}</Typography>

                <Box display="flex" justifyContent="flex-end" mt={3}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEditProject(project)}
                  >
                    Editar Projeto
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

      {showProjectForm && (
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ p: 3 }}>
            <CardContent>
              <ProjectForm
                projectData={projectData}
                setProjectData={setProjectData}
                designers={designers}
                homologators={homologators}
                branches={branches}
                managers={managers}
                sellers={sellers}
                supervisors={supervisors}
                addresses={addresses}
                marketingCampaigns={marketingCampaigns}
                leads={leads}
              />
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCloseProjectForm}
                  sx={{ mr: 2 }}
                >
                  Cancelar
                </Button>
                <Button variant="contained" color="primary" onClick={handleSaveProject}>
                  Salvar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default ProjectManager;
