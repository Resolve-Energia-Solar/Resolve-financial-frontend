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
import EditLeadTabs from '../Leads/TabsLead';

function EditLeadModal({ showModal, onClose, leadId }) {

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
        <EditLeadTabs
          leadId={leadId}
        />
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleSave} color="primary" disabled={loading}>
          Save
        </Button>
      </DialogActions> */}
    </Dialog>
  );
}

EditLeadModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  leadId: PropTypes.string.isRequired,
};

export default EditLeadModal;
