import { Grid, TextField, MenuItem } from '@mui/material';

const SaleForm = ({
  saleData,
  setSaleData,
  sellers = [],
  sdrs = [],
  branches = [],
  campaigns = [],
}) => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Cliente"
        value={saleData?.customer?.complete_name || ''}
        disabled
      />
    </Grid>

    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Vendedor"
        select
        value={saleData?.seller || ''}
        onChange={(e) => setSaleData({ ...saleData, seller: e.target.value })}
      >
        {sellers.length > 0 ? (
          sellers.map((seller) => (
            <MenuItem key={seller.id} value={seller.id}>
              {seller.complete_name} - {seller.email}
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
        value={saleData?.sdr || ''}
        onChange={(e) => setSaleData({ ...saleData, sdr: e.target.value })}
      >
        {sdrs.length > 0 ? (
          sdrs.map((sdr) => (
            <MenuItem key={sdr.id} value={sdr.id}>
              {sdr.complete_name} - {sdr.email}
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
        value={saleData?.sales_supervisor?.complete_name || 'N/A'}
        disabled
      />
    </Grid>

    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Gerente de Vendas"
        value={saleData?.sales_manager?.complete_name || 'N/A'}
        disabled
      />
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
              {campaign.name} - {campaign.description}
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
        label="Status da Venda"
        select
        value={saleData?.status || ''}
        onChange={(e) => setSaleData({ ...saleData, status: e.target.value })}
      >
        <MenuItem value="PENDING">Pendente</MenuItem>
        <MenuItem value="IN_PROGRESS">Em andamento</MenuItem>
        <MenuItem value="COMPLETED">Concluída</MenuItem>
        <MenuItem value="CANCELLED">Cancelada</MenuItem>
        <MenuItem value="ON_HOLD">Em espera</MenuItem>
      </TextField>
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

    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Documento Completo"
        select
        value={saleData?.is_completed_document ? 'true' : 'false'}
        onChange={(e) =>
          setSaleData({ ...saleData, is_completed_document: e.target.value === 'true' })
        }
      >
        <MenuItem value="true">Sim</MenuItem>
        <MenuItem value="false">Não</MenuItem>
      </TextField>
    </Grid>

    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Data de Conclusão do Documento"
        type="date"
        value={saleData?.document_completion_date || ''}
        onChange={(e) => setSaleData({ ...saleData, document_completion_date: e.target.value })}
        InputLabelProps={{ shrink: true }}
      />
    </Grid>
  </Grid>
);

export default SaleForm;
