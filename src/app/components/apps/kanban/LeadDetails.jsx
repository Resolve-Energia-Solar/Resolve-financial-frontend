import { Grid, Box, Typography } from '@mui/material';
import { Email, Phone, CalendarToday, AccountBox, Business, Tag, Description, Badge, Wc, Place, HomeWork, Person } from '@mui/icons-material';

const LeadDetails = ({ selectedLead }) => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <Box display="flex" alignItems="center">
        <AccountBox fontSize="small" style={{ marginRight: 8 }} />
        <Typography variant="h6">{selectedLead.name || 'N/A'}</Typography>
      </Box>
    </Grid>

    <Grid item xs={6}>
      <Box display="flex" alignItems="center">
        <Business fontSize="small" style={{ marginRight: 8 }} />
        <Typography variant="body1">Tipo: {selectedLead.type === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}</Typography>
      </Box>
    </Grid>

    <Grid item xs={6}>
      <Box display="flex" alignItems="center">
        <Tag fontSize="small" style={{ marginRight: 8 }} />
        <Typography variant="body1">Apelido: {selectedLead.byname || 'N/A'}</Typography>
      </Box>
    </Grid>

    <Grid item xs={6}>
      <Box display="flex" alignItems="center">
        <Description fontSize="small" style={{ marginRight: 8 }} />
        <Typography variant="body1">Documento Principal: {selectedLead.first_document || 'N/A'}</Typography>
      </Box>
    </Grid>

    <Grid item xs={6}>
      <Box display="flex" alignItems="center">
        <Badge fontSize="small" style={{ marginRight: 8 }} />
        <Typography variant="body1">Documento Secundário: {selectedLead.second_document || 'N/A'}</Typography>
      </Box>
    </Grid>

    <Grid item xs={6}>
      <Box display="flex" alignItems="center">
        <CalendarToday fontSize="small" style={{ marginRight: 8 }} />
        <Typography variant="body1">Data de Nascimento: {selectedLead.birth_date ? new Date(selectedLead.birth_date).toLocaleDateString('pt-BR') : 'N/A'}</Typography>
      </Box>
    </Grid>

    <Grid item xs={6}>
      <Box display="flex" alignItems="center">
        <Wc fontSize="small" style={{ marginRight: 8 }} />
        <Typography variant="body1">Gênero: {selectedLead.gender === 'M' ? 'Masculino' : 'Feminino'}</Typography>
      </Box>
    </Grid>

    <Grid item xs={12}>
      <Box display="flex" alignItems="center">
        <Email fontSize="small" style={{ marginRight: 8 }} />
        <Typography variant="body1">E-mail: {selectedLead.contact_email || 'N/A'}</Typography>
      </Box>
    </Grid>

    <Grid item xs={12}>
      <Box display="flex" alignItems="center">
        <Phone fontSize="small" style={{ marginRight: 8 }} />
        <Typography variant="body1">Telefone: {selectedLead.phone || 'N/A'}</Typography>
      </Box>
    </Grid>

    <Grid item xs={12}>
      <Box display="flex" alignItems="center">
        <Place fontSize="small" style={{ marginRight: 8 }} />
        <Typography variant="body1">Origem: {selectedLead.origin || 'N/A'}</Typography>
      </Box>
    </Grid>

    <Grid item xs={12}>
      <Box display="flex" alignItems="center">
        <CalendarToday fontSize="small" style={{ marginRight: 8 }} />
        <Typography variant="body1">Criado em: {new Date(selectedLead.created_at).toLocaleDateString('pt-BR')}</Typography>
      </Box>
    </Grid>

    <Grid item xs={12}>
      <Box display="flex" alignItems="center">
        <Badge fontSize="small" style={{ marginRight: 8 }} />
        <Typography variant="body1">Status: {selectedLead.column.name}</Typography>
      </Box>
    </Grid>

    <Grid item xs={12}>
      <Box display="flex" alignItems="center">
        <Person fontSize="small" style={{ marginRight: 8 }} />
        <Typography variant="body1">
          Vendedor: {selectedLead.seller ? `${selectedLead.seller.complete_name} - ${selectedLead.seller.email}` : 'N/A'}
        </Typography>
      </Box>
    </Grid>

    <Grid item xs={12}>
      <Box display="flex" alignItems="center">
        <Person fontSize="small" style={{ marginRight: 8 }} />
        <Typography variant="body1">
          SDR: {selectedLead.sdr ? `${selectedLead.sdr.complete_name} - ${selectedLead.sdr.email}` : 'N/A'}
        </Typography>
      </Box>
    </Grid>

    <Grid item xs={12}>
      <Box display="flex" alignItems="center">
        <HomeWork fontSize="small" style={{ marginRight: 8 }} />
        <Typography variant="body1">
          Endereço:{' '}
          {selectedLead.addresses && selectedLead.addresses.length > 0
            ? `${selectedLead.addresses[0].street}, ${selectedLead.addresses[0].number} - ${selectedLead.addresses[0].city}, ${selectedLead.addresses[0].state}`
            : 'N/A'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

export default LeadDetails;
