import { Grid, TextField, MenuItem } from '@mui/material';

const SaleForm = ({
  saleData,
  setSaleData,
  sellers = [],
  sdrs = [],
  managers = [],
  supervisors = [],
  branches = [],
  campaigns = [],
  allUsers = [],
  leadData = []
}) => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Cliente"
        select
        value={saleData?.customer_id || ''}
        onChange={(e) => setSaleData({ ...saleData, customer_id: e.target.value })}
      >
        {allUsers.length > 0 ? (
          allUsers.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.complete_name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>Nenhum cliente disponível</MenuItem>
        )}
      </TextField>
    </Grid>

    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Lead"
        select
        value={saleData?.lead_id || ''}
        onChange={(e) => setSaleData({ ...saleData, lead_id: e.target.value })}
      >
        {leadData.length > 0 ? (
          leadData.map((lead) => (
            <MenuItem key={lead.id} value={lead.id}>
              {lead.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>Nenhum lead disponível</MenuItem>
        )}
      </TextField>
    </Grid>

    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Vendedor"
        select
        value={saleData?.seller_id || ''}
        onChange={(e) => setSaleData({ ...saleData, seller_id: e.target.value })}
      >
        {sellers.length > 0 ? (
          sellers.map((seller) => (
            <MenuItem key={seller.id} value={seller.id}>
              {seller.complete_name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>Nenhum vendedor disponível</MenuItem>
        )}
      </TextField>
    </Grid>

    <Grid item xs={6}>
      <TextField
        fullWidth
        label="SDR"
        select
        value={saleData?.sdr_id || ''}
        onChange={(e) => setSaleData({ ...saleData, sdr_id: e.target.value })}
      >
        {sdrs.length > 0 ? (
          sdrs.map((sdr) => (
            <MenuItem key={sdr.id} value={sdr.id}>
              {sdr.complete_name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>Nenhum SDR disponível</MenuItem>
        )}
      </TextField>
    </Grid>

    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Supervisor de Vendas"
        select
        value={saleData?.sales_supervisor_id || ''}
        onChange={(e) => setSaleData({ ...saleData, sales_supervisor_id: e.target.value })}
      >
        {supervisors.length > 0 ? (
          supervisors.map((supervisor) => (
            <MenuItem key={supervisor.id} value={supervisor.id}>
              {supervisor.complete_name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>Nenhum supervisor disponível</MenuItem>
        )}
      </TextField>
    </Grid>

    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Gerente de Vendas"
        select
        value={saleData?.sales_manager_id || ''}
        onChange={(e) => setSaleData({ ...saleData, sales_manager_id: e.target.value })}
      >
        {managers.length > 0 ? (
          managers.map((manager) => (
            <MenuItem key={manager.id} value={manager.id}>
              {manager.complete_name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>Nenhum gerente disponível</MenuItem>
        )}
      </TextField>
    </Grid>

    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Campanha de Marketing"
        select
        value={saleData?.marketing_campaign_id || ''}
        onChange={(e) => setSaleData({ ...saleData, marketing_campaign_id: e.target.value })}
      >
        {campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <MenuItem key={campaign.id} value={campaign.id}>
              {campaign.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>Nenhuma campanha disponível</MenuItem>
        )}
      </TextField>
    </Grid>

    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Filial"
        select
        value={saleData?.branch_id || ''}
        onChange={(e) => setSaleData({ ...saleData, branch_id: e.target.value })}
      >
        {branches.length > 0 ? (
          branches.map((branch) => (
            <MenuItem key={branch.id} value={branch.id}>
              {branch.name} - {branch.address.city}, {branch.address.state}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>Nenhuma filial disponível</MenuItem>
        )}
      </TextField>
    </Grid>

    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Valor Total"
        value={saleData?.total_value || ''}
        onChange={(e) => setSaleData({ ...saleData, total_value: e.target.value })}
      />
    </Grid>

    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Pré-Venda"
        select
        value={saleData?.is_sale ? 'true' : 'false'}
        onChange={(e) => setSaleData({ ...saleData, is_sale: e.target.value === 'true' })}
      >
        <MenuItem value="true">Sim</MenuItem>
        <MenuItem value="false">Não</MenuItem>
      </TextField>
    </Grid>
  </Grid>
);

export default SaleForm;
