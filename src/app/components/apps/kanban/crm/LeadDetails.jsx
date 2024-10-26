import { Grid, Box, Typography, useTheme, Card, CardContent } from '@mui/material';
import {
  Email,
  Phone,
  CalendarToday,
  AccountBox,
  Business,
  Tag,
  Description,
  Badge,
  Wc,
  Place,
  AssignmentInd,
} from '@mui/icons-material';

const LeadDetails = ({ selectedLead }) => {
  const theme = useTheme();

  const personalDetails = [
    {
      icon: <AccountBox fontSize="small" />,
      label: 'Nome',
      value: selectedLead.name || 'N/A',
    },
    {
      icon: <Business fontSize="small" />,
      label: 'Tipo',
      value: selectedLead.type === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica',
    },
    {
      icon: <Tag fontSize="small" />,
      label: 'Apelido',
      value: selectedLead.byname || 'N/A',
    },
    {
      icon: <CalendarToday fontSize="small" />,
      label: 'Data de Nascimento',
      value: selectedLead.birth_date
        ? new Date(selectedLead.birth_date).toLocaleDateString('pt-BR')
        : 'N/A',
    },
    {
      icon: <Wc fontSize="small" />,
      label: 'Gênero',
      value: selectedLead.gender === 'M' ? 'Masculino' : 'Feminino',
    },
  ];

  const documentDetails = [
    {
      icon: <Description fontSize="small" />,
      label: 'CFP/CNPJ',
      value: selectedLead.first_document || 'N/A',
    },
    {
      icon: <Badge fontSize="small" />,
      label: 'RG',
      value: selectedLead.second_document || 'N/A',
    },
  ];

  const contactDetails = [
    {
      icon: <Email fontSize="small" />,
      label: 'E-mail',
      value: selectedLead.contact_email || 'N/A',
    },
    {
      icon: <Phone fontSize="small" />,
      label: 'Telefone',
      value: selectedLead.phone || 'N/A',
    },
    {
      icon: <Place fontSize="small" />,
      label: 'Endereço',
      value:
        selectedLead.addresses && selectedLead.addresses.length > 0
          ? selectedLead.addresses
              .map(
                (address) =>
                  `${address.street}, ${address.number} - ${address.city}, ${address.state}`,
              )
              .join('; ')
          : 'N/A',
    },
  ];

  const otherDetails = [
    {
      icon: <Place fontSize="small" />,
      label: 'Origem',
      value: selectedLead.origin || 'N/A',
    },
    {
      icon: <CalendarToday fontSize="small" />,
      label: 'Criado em',
      value: selectedLead.created_at
        ? new Date(selectedLead.created_at).toLocaleDateString('pt-BR')
        : 'N/A',
    },
    {
      icon: <Badge fontSize="small" />,
      label: 'Status',
      value: selectedLead.column ? selectedLead.column.name : 'N/A',
    },
    {
      icon: <AssignmentInd fontSize="small" />,
      label: 'Vendedor',
      value: selectedLead.seller ? selectedLead.seller.complete_name : 'N/A',
    },
    {
      icon: <AssignmentInd fontSize="small" />,
      label: 'SDR',
      value: selectedLead.sdr ? selectedLead.sdr.complete_name : 'N/A',
    },
  ];

  const renderSection = (title, details) => (
    <Card
      variant="outlined"
      sx={{
        mb: 3,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 3,
        },
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.primary.secondary,
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          {title}
        </Typography>
        <Grid container spacing={3}>
          {details.map((detail, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Box display="flex" alignItems="center">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    width: 24,
                    height: 24,
                    marginRight: 1,
                    color: theme.palette.text.secondary,
                  }}
                >
                  {detail.icon}
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    {detail.label}
                  </Typography>
                  <Typography variant="body1">{detail.value}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <>
      {renderSection('Informações Pessoais', personalDetails)}
      {renderSection('Documentos', documentDetails)}
      {renderSection('Contato', contactDetails)}
      {renderSection('Outros Detalhes', otherDetails)}
    </>
  );
};

export default LeadDetails;
