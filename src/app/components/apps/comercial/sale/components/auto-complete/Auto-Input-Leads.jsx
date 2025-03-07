'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import leadService from '@/services/leadService';
import { debounce } from 'lodash';
import { IconButton, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateLead from '@/app/components/apps/leads/Add-lead';

export default function AutoCompleteLead({ onChange, value, error, helperText, disabled, labeltitle }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchDefaultLead = async (leadId) => {
    if (leadId) {
      try {
        const lead = await leadService.getLeadById(leadId);
        if (lead) {
          setSelectedLead({ id: lead.id, name: lead.name });
        }
      } catch (error) {
        console.error('Erro ao buscar lead:', error);
      }
    }
  };

  useEffect(() => {
    fetchDefaultLead(value);
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedLead(newValue);
    if (newValue) {
      onChange(newValue.id);
    } else {
      onChange(null);
    }
  };

  const fetchLeadsByName = useCallback(
    debounce(async (name) => {
      if (!name) return;
      setLoading(true);
      try {
        const leads = await leadService.getLeadByName(name);
        const formattedLeads = leads.results.map((lead) => ({
          id: lead.id,
          name: lead.name,
        }));
        setOptions(formattedLeads);
      } catch (error) {
        console.error('Erro ao buscar leads:', error);
      }
      setLoading(false);
    }, 300),
    []
  );

  const fetchInitialLeads = useCallback(async () => {
    setLoading(true);
    try {
      const leads = await leadService.getLeads();
      const formattedLeads = leads.results.map((lead) => ({
        id: lead.id,
        name: lead.name,
      }));
      setOptions(formattedLeads);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
    }
  }, []);

  const handleOpen = () => {
    setOpen(true);
    if (options.length === 0) {
      fetchInitialLeads();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div>
      <Autocomplete
        sx={{ width: '100%' }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        disabled={disabled}
        value={selectedLead}
        loadingText="Carregando..."
        noOptionsText="Nenhum resultado encontrado, tente digitar algo ou mudar a pesquisa."  
        onInputChange={(event, newInputValue) => {
          fetchLeadsByName(newInputValue);
        }}
        onChange={handleChange}
        renderInput={(params) => (
          <CustomTextField
            {...params}
            label={labeltitle}
            error={error}
            helperText={helperText}
            size="small"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                  <IconButton
                    onClick={handleOpenModal}
                    aria-label="Adicionar lead"
                    edge="end"
                    size="small"
                    sx={{ padding: '4px' }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Fragment>
              ),
            }}
          />
        )}
      />

      {/* Modal para adicionar lead */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg">
        <DialogTitle>Adicionar Novo Lead</DialogTitle>
        <DialogContent>
          <CreateLead />
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleCloseModal} color="primary">Cancelar</Button>
          <Button onClick={() => {}} color="primary">Salvar</Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}
