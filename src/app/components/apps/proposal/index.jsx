import {
  Grid,
  Button,
  Box,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
} from '@mui/material';
import { Add as AddIcon, CallToAction, FlashAuto, SolarPower } from '@mui/icons-material';
import ProposalForm from './Add-proposal';
import ProposalEditForm from './Edit-proposal/index';
import ProposalCard from './proposalCard/index';
import { useState, useEffect } from 'react';
import useKitSolar from '@/hooks/kits/useKitSolar';
import ProposalService from '@/services/proposalService';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import FormPreSale from './components/formPreSale/FormPreSale';

const ProposalManager = ({ selectedLead }) => {
  const theme = useTheme();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [proposals, setProposals] = useState([]);
  const [isSaleModalOpen, setSaleModalOpen] = useState(false);

  console.log('selectedProposal', selectedProposal);

  const { kits, loading, error } = useKitSolar();

  useEffect(() => {
    const fetchProposals = async () => {
      const fetchedProposals = await ProposalService.getProposalByLead(selectedLead.id);
      setProposals(fetchedProposals.results);
    };

    if (selectedLead) fetchProposals();
  }, [selectedLead]);

  const handleAddProposal = () => {
    setIsFormVisible(true);
    setIsEditMode(false);
    setSelectedProposal(null);
  };

  const handleEditProposal = (proposal) => {
    setIsFormVisible(true);
    setIsEditMode(true);
    setSelectedProposal(proposal);
  };

  const handleAddSale = (proposal) => {
    setSaleModalOpen(true);
    setSelectedProposal(proposal);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setSelectedProposal(null);
  };

  const closeSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={8}>
        <Box display="flex" flexDirection="column" gap={2}>
          {proposals.length > 0 ? (
            proposals.map((proposal) => (
              <ProposalCard
                handleEditProposal={handleEditProposal}
                key={proposal.id}
                proposal={proposal}
                onAddSale={handleAddSale}
              />
            ))
          ) : (
            <Box display="flex" justifyContent="center" mt={4}>
              <Alert severity="info">Nenhuma proposta encontrada.</Alert>
            </Box>
          )}
        </Box>
      </Grid>

      <Grid item xs={4}>
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddProposal}
            startIcon={<AddIcon />}
            fullWidth
          >
            Adicionar Proposta
          </Button>
        </Box>
      </Grid>

      <Dialog open={isFormVisible} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>{isEditMode ? 'Editar Proposta' : 'Adicionar Proposta'}</DialogTitle>
        <DialogContent dividers>
          {isEditMode ? (
            <ProposalEditForm
              kits={kits}
              selectedLead={selectedLead}
              handleCloseForm={handleCloseForm}
              proposal={selectedProposal}
            />
          ) : (
            <ProposalForm
              kits={kits}
              selectedLead={selectedLead}
              handleCloseForm={handleCloseForm}
              loading={loading}
              error={error}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isSaleModalOpen}
        onClose={() => setSaleModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Gerar Pré-Venda</DialogTitle>

        <DialogContent dividers>
          <FormPreSale selectedProposal={selectedProposal} />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ProposalManager;
