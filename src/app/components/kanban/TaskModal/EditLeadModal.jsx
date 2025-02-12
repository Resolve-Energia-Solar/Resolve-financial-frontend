'use client';
import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import PropTypes from 'prop-types';
import TabsComponent from '../Leads/TabsLead';

function EditLeadModal({ showModal, onClose, leadId }) {
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleCloseModal();
    }, 2000);
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Dialog
      open={showModal}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        component: "form",
      }}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>CRM Resolve</DialogTitle>
      <DialogContent sx={{ height: '80vh' }}>
        <TabsComponent
          tabValue={tabValue}
          handleChange={handleChange}
          loading={loading}
          leadId={leadId}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleSave} color="primary" disabled={loading}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EditLeadModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  leadId: PropTypes.string.isRequired,
};

export default EditLeadModal;
