import { Grid, TextField, MenuItem, Typography } from '@mui/material';

export const ProjectForm = ({
  projectData,
  setProjectData,
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
          {designers.map((designer) => (
            <MenuItem key={designer.id} value={designer.id}>
              {designer.complete_name} - {designer.email}
            </MenuItem>
          ))}
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
          {homologators.map((homologator) => (
            <MenuItem key={homologator.id} value={homologator.id}>
              {homologator.complete_name} - {homologator.email}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Filial"
          select
          value={projectData.branch_id || ''}
          onChange={(e) => setProjectData({ ...projectData, branch_id: e.target.value })}
        >
          {branches.map((branch) => (
            <MenuItem key={branch.id} value={branch.id}>
              {branch.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Endereço"
          select
          value={projectData.address_id || ''}
          onChange={(e) => setProjectData({ ...projectData, address_id: e.target.value })}
        >
          {addresses.map((address) => (
            <MenuItem key={address.id} value={address.id}>
              {address.street}, {address.city}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Campanha de Marketing"
          select
          value={projectData.marketing_campaign_id || ''}
          onChange={(e) => setProjectData({ ...projectData, marketing_campaign_id: e.target.value })}
        >
          {marketingCampaigns.map((campaign) => (
            <MenuItem key={campaign.id} value={campaign.id}>
              {campaign.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Lead"
          select
          value={projectData.lead_id || ''}
          onChange={(e) => setProjectData({ ...projectData, lead_id: e.target.value })}
        >
          {leads.map((lead) => (
            <MenuItem key={lead.id} value={lead.id}>
              {lead.name} - {lead.contact_email}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Supervisor de Vendas"
          select
          value={projectData.sales_supervisor_id || ''}
          onChange={(e) => setProjectData({ ...projectData, sales_supervisor_id: e.target.value })}
        >
          {supervisors.map((supervisor) => (
            <MenuItem key={supervisor.id} value={supervisor.id}>
              {supervisor.complete_name} - {supervisor.email}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Gerente de Vendas"
          select
          value={projectData.sales_manager_id || ''}
          onChange={(e) => setProjectData({ ...projectData, sales_manager_id: e.target.value })}
        >
          {managers.map((manager) => (
            <MenuItem key={manager.id} value={manager.id}>
              {manager.complete_name} - {manager.email}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Vendedor"
          select
          value={projectData.seller_id || ''}
          onChange={(e) => setProjectData({ ...projectData, seller_id: e.target.value })}
        >
          {sellers.map((seller) => (
            <MenuItem key={seller.id} value={seller.id}>
              {seller.complete_name} - {seller.email}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Valor Total"
          type="number"
          value={projectData.total_value || ''}
          onChange={(e) => setProjectData({ ...projectData, total_value: e.target.value })}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Pré-venda"
          select
          value={projectData.is_sale || false}
          onChange={(e) => setProjectData({ ...projectData, is_sale: e.target.value === 'true' })}
        >
          <MenuItem value={true}>Sim</MenuItem>
          <MenuItem value={false}>Não</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Documento Completo"
          select
          value={projectData.is_completed_document || false}
          onChange={(e) => setProjectData({ ...projectData, is_completed_document: e.target.value === 'true' })}
        >
          <MenuItem value={true}>Sim</MenuItem>
          <MenuItem value={false}>Não</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Data de Conclusão do Documento"
          type="date"
          value={projectData.document_completion_date || ''}
          onChange={(e) => setProjectData({ ...projectData, document_completion_date: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />
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
