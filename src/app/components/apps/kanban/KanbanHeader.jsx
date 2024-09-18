'use client';
import React, { useState, useContext } from 'react';
import { KanbanDataContext } from '@/app/context/kanbancontext/index';
import { supabase } from '@/utils/supabaseClient';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import CustomFormLabel from '../../forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../forms/theme-elements/CustomTextField';

function KanbanHeader() {
  const { addCategory, addLead, setError } = useContext(KanbanDataContext);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');

  const handleCloseCategoryModal = () => setShowCategoryModal(false);
  const handleCloseLeadModal = () => setShowLeadModal(false);
  
  const handleShowCategoryModal = () => setShowCategoryModal(true);
  const handleShowLeadModal = () => setShowLeadModal(true);

  const handleSaveCategory = async () => {
    try {
      const { data, error } = await supabase.from('kanban_categories').insert([{ name: categoryName }]);
      if (error) throw error;
      addCategory(data[0]);
      setCategoryName('');
      setShowCategoryModal(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSaveLead = async () => {
    try {
      const { data, error } = await supabase.from('leads').insert([
        {
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          kanban_category_id: 1,
        }
      ]);
      if (error) throw error;
      addLead(data[0]);
      setLeadName('');
      setLeadEmail('');
      setLeadPhone('');
      setShowLeadModal(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const isCategoryButtonDisabled = categoryName.trim().length === 0;
  const isLeadButtonDisabled = leadName.trim().length === 0 || leadEmail.trim().length === 0 || leadPhone.trim().length === 0;

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5">Gerenciamento de Leads</Typography>
        <Box>
          <Button variant="contained" onClick={handleShowLeadModal} sx={{ mr: 2 }}>
            Adicionar Lead
          </Button>
          <Button variant="contained" onClick={handleShowCategoryModal}>
            Adicionar Categoria
          </Button>
        </Box>
      </Box>

      <Dialog
        open={showCategoryModal}
        onClose={handleCloseCategoryModal}
        maxWidth="lg"
        sx={{ '.MuiDialog-paper': { width: '600px' } }}
      >
        <DialogTitle>Adicionar Categoria</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <CustomFormLabel htmlFor="category-name">Título da Categoria</CustomFormLabel>
              <CustomTextField
                autoFocus
                id="category-name"
                variant="outlined"
                value={categoryName}
                fullWidth
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseCategoryModal} color="error">
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveCategory}
            color="primary"
            disabled={isCategoryButtonDisabled}
          >
            Adicionar Categoria
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showLeadModal}
        onClose={handleCloseLeadModal}
        maxWidth="lg"
        sx={{ '.MuiDialog-paper': { width: '600px' } }}
      >
        <DialogTitle>Adicionar Lead</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="lead-name">Nome do Lead</CustomFormLabel>
              <CustomTextField
                autoFocus
                id="lead-name"
                variant="outlined"
                value={leadName}
                fullWidth
                onChange={(e) => setLeadName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="lead-email">Email do Lead</CustomFormLabel>
              <CustomTextField
                id="lead-email"
                variant="outlined"
                value={leadEmail}
                fullWidth
                onChange={(e) => setLeadEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomFormLabel htmlFor="lead-phone">Telefone do Lead</CustomFormLabel>
              <CustomTextField
                id="lead-phone"
                variant="outlined"
                value={leadPhone}
                fullWidth
                onChange={(e) => setLeadPhone(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseLeadModal} color="error">
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveLead}
            color="primary"
            disabled={isLeadButtonDisabled}
          >
            Adicionar Lead
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default KanbanHeader;
