import { Box, Chip, Grid, Dialog, DialogContent, Drawer } from '@mui/material';

import React, { useState, useEffect, useContext } from 'react';
import leadService from '@/services/leadService';
import TableHeader from '@/app/components/kanban/Leads/components/TableHeader';
import TableComponent from '@/app/components/kanban/Leads/components/TableComponent';
import ProposalService from '@/services/proposalService';
// import LeadProposalPage from './Edit-Proposal';
import LeadsViewProposal from './View-Proposal';
import AddProposalPage from './Add-Proposal';
import EditProposalPage from './Edit-Proposal';
import { LeadModalTabContext } from '../context/LeadModalTabContext';
import { LeadInfoHeader } from '../components/LeadInfoHeader';
import LeadInfoHeaderSkeleton from '../components/LeadInfoHeaderSkeleton';

const LeadsProposalListPage = ({ leadId = null }) => {
  const [data, setData] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const { lead } = useContext(LeadModalTabContext);

  const proposalStatus = {
    A: { label: 'Aceita', color: '#E9F9E6' },
    R: { label: 'Recusada', color: '#FEEFEE' },
    P: { label: 'Pendente', color: '#FFF7E5' },
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Nome',
      flex: 1,
      render: (row) =>
        row?.products?.length > 0
          ? row.products.map((product) => product.name).join(', ')
          : 'Nenhum produto vinculado',
    },
    {
      field: 'id',
      headerName: 'Proposta',
      flex: 1,
    },
    {
      field: 'value',
      headerName: 'Valor',
      flex: 1,
      render: (row) =>
        new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(row.value),
    },
    {
      field: 'responsible',
      headerName: 'Responsável',
      flex: 1,
      render: (row) => `${row.created_by?.first_name || ''} ${row.created_by?.last_name || ''}`,
    },
    {
      field: 'due_date',
      headerName: 'Validade',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      render: (row) => (
        <Chip
          label={proposalStatus[row.status]?.label || 'Desconhecido'}
          sx={{ backgroundColor: proposalStatus[row.status]?.color }}
        />
      ),
    },
  ];

  const [openAddProposal, setOpenAddProposal] = useState(false);
  const [openEditProposal, setOpenEditProposal] = useState(false);
  const [openDetailProposal, setOpenDetailProposal] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(null);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    const fetchProposals = async () => {
      setLoadingProposals(true);
      try {
        const response = await ProposalService.index({
          expand: 'products,created_by',
          fields: 'id,products,value,status,created_by,due_date',
          lead: lead.id,
          page: page + 1,
          limit: rowsPerPage,
        });
        setData(response.results || []);
        setTotalRows(response.meta?.pagination.total_count || 0);
      } catch (err) {
        console.error('Erro ao buscar contratos');
      } finally {
        setLoadingProposals(false);
      }
    };

    fetchProposals();
  }, [leadId, refresh, page, rowsPerPage]);

  return (
    <>
      <Grid
        container
        spacing={0}
        sx={{
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid',
          borderColor: '#EAEAEA',
          p: 3,
        }}
      >
        <Grid item xs={12} sx={{ overflow: 'scroll' }}>
          <Box sx={{ borderRadius: '20px', display: 'flex', flexDirection: 'column' }}>
            {!leadId ? <LeadInfoHeaderSkeleton /> : 
              <Grid container alignItems="center">
                <LeadInfoHeader.Root>
                  <LeadInfoHeader.Profile leadId={leadId} />
                  <LeadInfoHeader.InterestLevel leadId={leadId} />
                  <LeadInfoHeader.StatusChip leadId={leadId} />
                  <LeadInfoHeader.ProjectDropdown leadId={leadId} />
                </LeadInfoHeader.Root>
              </Grid>
            }
          </Box>

          <Grid container xs={12}>
            <Grid item xs={12}>
              <TableHeader
                title={'Total'}
                totalItems={totalRows}
                objNameNumberReference={'Propostas'}
                buttonLabel="Criar"
                onButtonClick={() => setOpenAddProposal(true)}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sx={{
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid',
                borderColor: '#EAEAEA',
              }}
            >
              <TableComponent
                columns={columns}
                data={data}
                totalRows={totalRows}
                loading={loadingProposals}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(newRows) => {
                  setRowsPerPage(newRows);
                  setPage(0);
                }}
                actions={{
                  edit: (row) => {
                    console.log('row edit', row);
                    setSelectedProposalId(row);
                    setOpenEditProposal(true);
                  },
                  view: (row) => {
                    console.log('row view', row);
                    setSelectedProposalId(row);
                    setOpenDetailProposal(true);
                  },
                }}
              />

              <Drawer
                anchor="right"
                open={openAddProposal}
                onClose={() => setOpenAddProposal(false)}
                // maxWidth="lg"
                sx={{ zIndex: 1300 }}
                PaperProps={{
                  sx: {
                    width: '60vw',
                    p: 4,
                  },
                }}
              >
                <DialogContent>
                  <AddProposalPage
                    leadId={leadId}
                    onClose={() => setOpenAddProposal(false)}
                    onRefresh={handleRefresh}
                  />
                </DialogContent>
              </Drawer>

              <Drawer
                anchor="right"
                open={openEditProposal}
                onClose={() => setOpenEditProposal(false)}
                // maxWidth="lg"
                sx={{ zIndex: 1300 }}
                PaperProps={{
                  sx: {
                    width: '60vw',
                    p: 4,
                  },
                }}
              >
                <DialogContent>
                  <EditProposalPage
                    proposalData={selectedProposalId}
                    leadId={leadId}
                    onClose={() => setOpenEditProposal(false)}
                    onRefresh={handleRefresh}
                  />
                </DialogContent>
              </Drawer>

              <Dialog
                open={openDetailProposal}
                onClose={() => setOpenDetailProposal(false)}
                maxWidth="lg"
                fullWidth
              >
                <DialogContent>
                  <LeadsViewProposal
                    leadId={leadId}
                    proposalData={selectedProposalId}
                    onClose={() => setOpenDetailProposal(false)}
                    onRefresh={handleRefresh}
                  />
                </DialogContent>
              </Dialog>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default LeadsProposalListPage;
