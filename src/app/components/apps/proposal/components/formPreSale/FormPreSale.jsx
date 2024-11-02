import { Box, Card, CardContent, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { CallToAction, FlashAuto, SolarPower } from '@mui/icons-material';
import { useState } from 'react';
import FormCustomer from './FormCustomer';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Box sx={{ display: value === index ? 'block' : 'none' }} {...other}>
      <Typography>{children}</Typography>
    </Box>
  );
}

function FormPreSale({ selectedProposal }) {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Tabs value={value} onChange={handleChangeTab} sx={{ paddingBottom: 2 }}>
        <Tab label="Projetos" />
        <Tab label="Cliente" />
        <Tab label="Pagamentos" />
      </Tabs>

      {/* Renderização condicional com CSS para ocultar abas em vez de desmontá-las */}
      <TabPanel value={value} index={0}>
        {selectedProposal?.kits.map((kit) => (
          <Card
            key={kit.id}
            variant="outlined"
            sx={{
              p: 3,
              mb: 3,
              backgroundColor: theme.palette.background.paper,
              borderLeft: `5px solid ${
                'F' === 'F' ? theme.palette.success.main : theme.palette.warning.main
              }`,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <SolarPower sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Quantidade Modulos: {kit?.modules_amount || 'N/A'}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={1}>
                <CallToAction sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Quantidade Inversores: {kit?.inversor_amount || 'N/A'}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={1}>
                <FlashAuto sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                <Typography variant="h6" gutterBottom>
                  KWP: {kit?.kwp || 'N/A'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </TabPanel>

      <TabPanel value={value} index={1}>
        <FormCustomer />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Typography variant="h6">Seção de Pagamentos em desenvolvimento</Typography>
      </TabPanel>
    </Box>
  );
}

export default FormPreSale;
