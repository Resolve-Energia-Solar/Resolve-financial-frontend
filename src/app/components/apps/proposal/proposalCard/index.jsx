import React from 'react';

export default function ProposalCard({ proposal }) {
  return (
    <Grid item xs={12} key={proposal.id}>
      <Card
        variant="outlined"
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: theme.palette.background.paper,
          borderLeft: `5px solid ${
            proposal.status === 'F' ? theme.palette.success.main : theme.palette.warning.main
          }`,
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <PersonIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
            <Typography variant="h6" gutterBottom>
              Cliente: {proposal.lead?.name || 'N/A'}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <AttachMoneyIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
            <Typography variant="body1">
              Valor Total:{' '}
              {proposal.value
                ? new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(proposal.value)
                : 'N/A'}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <StatusIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
            <Typography variant="body1">
              Status: <StatusChip status={proposal.status} />
            </Typography>
          </Box>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Tooltip title="Editar Proposta">
              <IconButton
                variant="outlined"
                color="primary"
                onClick={() => handleEditProposal(proposal)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Criar Venda">
              <IconButton
                variant="outlined"
                color="primary"
                onClick={() => handleEditProposal(proposal)}
              >
                <AddShoppingCartIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Gerar Proposta">
              <IconButton
                color="primary"
                onClick={() => console.log('Gerar proposta')}
                sx={{
                  borderRadius: '8px',
                  padding: '8px',
                }}
              >
                <DescriptionIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}
