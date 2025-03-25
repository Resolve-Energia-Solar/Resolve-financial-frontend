'use client';
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import CreateSchedule from './CreateSchedule';

const CreateScheduleModal = ({ open, onClose, onRefresh }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Adicionar Vistoria</DialogTitle>
      <DialogContent>
        <CreateSchedule onClosedModal={handleClose} onRefresh={onRefresh} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateScheduleModal;
