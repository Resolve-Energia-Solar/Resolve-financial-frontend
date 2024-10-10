'use client';
import React from 'react';
import { Box, CardContent, CircularProgress, Typography, Snackbar, Alert } from '@mui/material';
import BlankCard from '@/app/components/shared/BlankCard';
import KanbanHeader from '@/app/components/apps/kanban/crm/KanbanHeader';
import useKanban from '@/hooks/boards/useKanban';
import LeadManager from '@/app/components/apps/kanban/crm/LeadManager';

function KanbanPage() {
  const {
    boards,
    selectedBoard,
    setSelectedBoard,
    loading,
    error,
    leads,
    statuses,
    columns,
    setColumns,
    setLeads,
    snackbarMessage,
    snackbarOpen,
    handleSnackbarClose,
    updateLeadColumn,
    handleDeleteLead,
    handleUpdateLead,
  } = useKanban();

  return (
    <BlankCard>
      <CardContent>
        <KanbanHeader
          boards={boards}
          selectedBoard={selectedBoard}
          onBoardChange={(e) => setSelectedBoard(e.target.value)}
          leads={leads}
          columns={columns}
          setColumns={setColumns}
          setLeads={setLeads}
        />

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">Erro: {error}</Typography>
        ) : (
          <>
            {selectedBoard && leads.length > 0 && statuses.length > 0 ? (
              <LeadManager
                leads={leads}
                statuses={statuses}
                board={selectedBoard}
                onUpdateLeadColumn={updateLeadColumn}
                onUpdateLead={handleUpdateLead}
                onDeleteLead={handleDeleteLead}
              />
            ) : (
              <Typography variant="body1" mt={4}>
                Nenhum lead disponível para este quadro.
              </Typography>
            )}
          </>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarMessage.includes('Erro') ? 'error' : 'success'}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </CardContent>
    </BlankCard>
  );
}

export default KanbanPage;
