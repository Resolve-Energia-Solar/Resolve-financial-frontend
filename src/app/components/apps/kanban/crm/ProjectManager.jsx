import { Grid, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { ProjectForm } from './ProjectForm';

const ProjectManager = ({ projects = [], designers = [], homologators = [], branches = [] }) => {
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => console.log('Salvar projeto')}
                >
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
