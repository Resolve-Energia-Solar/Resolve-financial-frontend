import { Grid, TextField, MenuItem } from '@mui/material';

const LeadForm = ({ leadData, setLeadData, sellers = [], sdrs = [], addresses = [] }) => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Nome"
        value={leadData.name || ''}
        onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
      />
    </Grid>

    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Tipo de Pessoa"
        select
        value={leadData.type || ''}
        onChange={(e) => setLeadData({ ...leadData, type: e.target.value })}
      >
        <MenuItem value="PF">Pessoa Física</MenuItem>
        <MenuItem value="PJ">Pessoa Jurídica</MenuItem>
      </TextField>
    </Grid>

    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Apelido"
        value={leadData.byname || ''}
        onChange={(e) => setLeadData({ ...leadData, byname: e.target.value })}
      />
    </Grid>

    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Documento Principal (CPF/CNPJ)"
        value={leadData.first_document || ''}
        onChange={(e) => setLeadData({ ...leadData, first_document: e.target.value })}
      />
    </Grid>

    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Documento Secundário (RG/IE)"
        value={leadData.second_document || ''}
        onChange={(e) => setLeadData({ ...leadData, second_document: e.target.value })}
      />
    </Grid>

    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Data de Nascimento"
        type="date"
        value={leadData.birth_date || ''}
        onChange={(e) => setLeadData({ ...leadData, birth_date: e.target.value })}
        InputLabelProps={{ shrink: true }}
      />
    </Grid>

    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Gênero"
        select
        value={leadData.gender || ''}
        onChange={(e) => setLeadData({ ...leadData, gender: e.target.value })}
      >
        <MenuItem value="M">Masculino</MenuItem>
        <MenuItem value="F">Feminino</MenuItem>
      </TextField>
    </Grid>

    <Grid item xs={12}>
      <TextField
        fullWidth
        label="E-mail"
        value={leadData.contact_email || ''}
        onChange={(e) => setLeadData({ ...leadData, contact_email: e.target.value })}
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Telefone"
        value={leadData.phone || ''}
        onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Origem"
        value={leadData.origin || ''}
        onChange={(e) => setLeadData({ ...leadData, origin: e.target.value })}
      />
    </Grid>

    <Grid item xs={6}>
      <TextField
        fullWidth
        label="Vendedor"
        select
        value={leadData.seller || ''}
        onChange={(e) => setLeadData({ ...leadData, seller: e.target.value })}
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
        value={leadData.sdr || ''}
        onChange={(e) => setLeadData({ ...leadData, sdr: e.target.value })}
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

    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Endereços"
        select
        multiple
        value={leadData.addresses_ids || []}
        onChange={(e) => setLeadData({ ...leadData, addresses_ids: e.target.value })}
      >
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <MenuItem key={address.id} value={address.id}>
              {address.street}, {address.number} - {address.city}, {address.state}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>Nenhum endereço disponível</MenuItem>
        )}
      </TextField>
    </Grid>
  </Grid>
);

export default LeadForm;
