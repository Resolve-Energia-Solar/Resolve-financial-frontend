'use client';
import React from 'react';
import { Box, CardContent, CircularProgress, Typography, Snackbar, Alert } from '@mui/material';
import BlankCard from '@/app/components/shared/BlankCard';
import KanbanHeader from '@/app/components/apps/kanban/crm/KanbanHeader';
import useKanban from '@/hooks/boards/useKanban';
import { KanbanDataContextProvider } from '@/app/context/kanbancontext';
import KanbanManager from '@/app/components/apps/kanban/crm/KanbanManager';

function KanbanPage() {
  const {
    addLead,
    boards,
    selectedBoard,
    setSelectedBoard,
    loading,
    error,
    leads,
    statuses,
    snackbarMessage,
    snackbarOpen,
    handleSnackbarClose,
    handleDeleteLead,
    handleUpdateLead,
    updateColumnName,
    searchTerm,
    setSearchTerm,
  } = useKanban();

  return (
    <KanbanDataContextProvider>
      <BlankCard>
        <CardContent>
          <KanbanHeader
            boards={boards}
            selectedBoard={selectedBoard}
            onBoardChange={(e) => setSelectedBoard(e.target.value)}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
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
                <KanbanManager
                  leads={leads}
                  statuses={statuses}
                  board={selectedBoard}
                  addLead={addLead}
                  onUpdateLeadColumn={updateColumnName}
                  onUpdateLead={handleUpdateLead}
                  onDeleteLead={handleDeleteLead}
                  searchTerm={searchTerm}
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
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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
    </KanbanDataContextProvider>
  );
}

export default KanbanPage;
