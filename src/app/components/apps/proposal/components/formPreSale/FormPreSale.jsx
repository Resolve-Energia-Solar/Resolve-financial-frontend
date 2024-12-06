import {
  Box,
  Button,
  Card,
  CardContent,
  Tab,
  Tabs,
  Typography,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
} from '@mui/material';
import { CallToAction, FlashAuto, SolarPower } from '@mui/icons-material';
import { useState, useContext } from 'react';
import saleService from '@/services/saleService';
import ProposalService from '@/services/proposalService';
import LeadDetails from '../../../leads/leadDetails/LeadDetails';
import { KanbanDataContext } from '@/app/context/kanbancontext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Box sx={{ display: value === index ? 'block' : 'none' }} {...other}>
      <Typography>{children}</Typography>
    </Box>
  );
}

function FormPreSale({ selectedProposal, onClose }) {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  console.log('selectedProposal:', selectedProposal);

  const { idSaleSuccess, setIdSaleSuccess } = useContext(KanbanDataContext);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const sendData = {
    lead_id: selectedProposal.lead.id,
    kits: selectedProposal.kits?.map((kit) => kit),
  };

  const handleCreatePreSale = async () => {
    setLoading(true);
    try {
      const response = await saleService.createPreSale(sendData);
      setSuccess(true);
      setIdSaleSuccess(response.pre_sale_id);
      ProposalService.updateProposalPartial(selectedProposal.id, { status: 'A' });
      onClose();
    } catch (error) {
      console.log(error);
      const errors = Object.entries(error?.response?.data).map(
        ([key, value]) => `${key}: ${value}`
      );
      setErrorMessages(errors);
      setErrorDialogOpen(true);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  return (
    <Box>
      <Tabs value={value} onChange={handleChangeTab} sx={{ paddingBottom: 2 }}>
        <Tab label="Projetos" />
        <Tab label="Cliente" />
      </Tabs>

      <TabPanel value={value} index={0}>
        {selectedProposal?.kits?.map((kit) => (
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
        <LeadDetails selectedLead={selectedProposal?.lead} />
      </TabPanel>

      <Button
        variant="contained"
        color="primary"
        onClick={handleCreatePreSale}
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? 'Aguarde...' : 'Criar Pré-venda'}
      </Button>

      <Dialog open={errorDialogOpen} onClose={handleCloseErrorDialog}>
        <DialogTitle>Erros na criação da pré-venda</DialogTitle>
        <DialogContent>
          <List>
            {errorMessages.map((message, index) => (
              <ListItem
                key={index}
                sx={{
                  borderBottom: '1px solid',
                  borderColor: theme.palette.divider,
                  py: 1,
                }}
              >
                <Typography color="error">{message}</Typography>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FormPreSale;
