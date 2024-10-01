import { Grid, Box, Typography, useTheme } from '@mui/material';
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
} from '@mui/icons-material';

const LeadDetails = ({ selectedLead }) => {
  const theme = useTheme();

  const details = [
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
      icon: <Description fontSize="small" />,
      label: 'Documento Principal',
      value: selectedLead.first_document || 'N/A',
    },
    {
      icon: <Badge fontSize="small" />,
      label: 'Documento Secundário',
      value: selectedLead.second_document || 'N/A',
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
      label: 'Origem',
      value: selectedLead.origin || 'N/A',
    },
    {
      icon: <CalendarToday fontSize="small" />,
      label: 'Criado em',
      value: new Date(selectedLead.created_at).toLocaleDateString('pt-BR'),
    },
    {
      icon: <Badge fontSize="small" />,
      label: 'Status',
      value: selectedLead.column ? selectedLead.column.name : 'N/A', // Verificação adicionada
    },
  ];

  return (
    <Grid container spacing={3}>
      {details.map((detail, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
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
  );
};

export default LeadDetails;
