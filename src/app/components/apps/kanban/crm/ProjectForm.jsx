import { Grid, TextField, MenuItem, Typography } from '@mui/material';

export const ProjectForm = ({ projectData, setProjectData, designers = [], homologators = [], branches = [] }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Detalhes do Projeto
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Número do Projeto"
          value={projectData.project_number || ''}
          onChange={(e) => setProjectData({ ...projectData, project_number: e.target.value })}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Data de Início"
          type="date"
          value={projectData.start_date || ''}
          onChange={(e) => setProjectData({ ...projectData, start_date: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Data de Término"
          type="date"
          value={projectData.end_date || ''}
          onChange={(e) => setProjectData({ ...projectData, end_date: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Status do Projeto"
          select
          value={projectData.status || ''}
          onChange={(e) => setProjectData({ ...projectData, status: e.target.value })}
        >
          <MenuItem value="PENDING">Pendente</MenuItem>
          <MenuItem value="IN_PROGRESS">Em andamento</MenuItem>
          <MenuItem value="COMPLETED">Concluído</MenuItem>
          <MenuItem value="CANCELLED">Cancelado</MenuItem>
          <MenuItem value="ON_HOLD">Em espera</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Designer"
          select
          value={projectData.designer_id || ''}
          onChange={(e) => setProjectData({ ...projectData, designer_id: e.target.value })}
        >
          {designers.length > 0 ? (
            designers.map((designer) => (
              <MenuItem key={designer.id} value={designer.id}>
                {designer.complete_name} - {designer.email}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Nenhum designer disponível</MenuItem>
          )}
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Homologador"
          select
          value={projectData.homologator_id || ''}
          onChange={(e) => setProjectData({ ...projectData, homologator_id: e.target.value })}
        >
          {homologators.length > 0 ? (
            homologators.map((homologator) => (
              <MenuItem key={homologator.id} value={homologator.id}>
                {homologator.complete_name} - {homologator.email}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>Nenhum homologador disponível</MenuItem>
          )}
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Tipo de Fornecimento"
          select
          value={projectData.supply_type || ''}
          onChange={(e) => setProjectData({ ...projectData, supply_type: e.target.value })}
        >
          <MenuItem value="ENERGY">Energia</MenuItem>
          <MenuItem value="EQUIPMENT">Equipamento</MenuItem>
          <MenuItem value="SERVICE">Serviço</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="KWp"
          value={projectData.kwp || ''}
          onChange={(e) => setProjectData({ ...projectData, kwp: e.target.value })}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Disjuntor Cadastrado"
          type="number"
          value={projectData.registered_circuit_breaker || ''}
          onChange={(e) => setProjectData({ ...projectData, registered_circuit_breaker: e.target.value })}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Disjuntor Instalado"
          type="number"
          value={projectData.instaled_circuit_breaker || ''}
          onChange={(e) => setProjectData({ ...projectData, instaled_circuit_breaker: e.target.value })}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Disjuntor do Projeto"
          type="number"
          value={projectData.project_circuit_breaker || ''}
          onChange={(e) => setProjectData({ ...projectData, project_circuit_breaker: e.target.value })}
        />
      </Grid>
    </Grid>
  );
};