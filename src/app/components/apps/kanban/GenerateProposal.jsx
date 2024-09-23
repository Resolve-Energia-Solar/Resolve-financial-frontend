import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';

const GenerateProposalModal = ({ open, onClose, sellers, supervisors, managers, branches, campaigns }) => {
  const [proposalData, setProposalData] = useState({
    seller: '',
    sales_supervisor: '',
    sales_manager: '',
    branch: '',
    marketing_campaign: '',
    total_value: '',
    contract_number: '',
    signature_date: '',
    is_sale: false,
    status: '',
    is_completed_document: false,
    document_completion_date: '',
  });

  const handleInputChange = (field, value) => {
    setProposalData({ ...proposalData, [field]: value });
  };

  const handleSave = () => {
    console.log('Dados da proposta:', proposalData);
    onClose(); 
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Gerar Proposta</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Vendedor"
              select
              value={proposalData.seller}
              onChange={(e) => handleInputChange('seller', e.target.value)}
            >
              {sellers.map((seller) => (
                <MenuItem key={seller.id} value={seller.id}>
                  {seller.complete_name} - {seller.email}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Supervisor de Vendas"
              select
              value={proposalData.sales_supervisor}
              onChange={(e) => handleInputChange('sales_supervisor', e.target.value)}
            >
              {supervisors.map((supervisor) => (
                <MenuItem key={supervisor.id} value={supervisor.id}>
                  {supervisor.complete_name} - {supervisor.email}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Gerente de Vendas"
              select
              value={proposalData.sales_manager}
              onChange={(e) => handleInputChange('sales_manager', e.target.value)}
            >
              {managers.map((manager) => (
                <MenuItem key={manager.id} value={manager.id}>
                  {manager.complete_name} - {manager.email}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Filial"
              select
              value={proposalData.branch}
              onChange={(e) => handleInputChange('branch', e.target.value)}
            >
              {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                  {branch.name} - {branch.address.city}, {branch.address.state}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Campanha de Marketing"
              select
              value={proposalData.marketing_campaign}
              onChange={(e) => handleInputChange('marketing_campaign', e.target.value)}
            >
              {campaigns.map((campaign) => (
                <MenuItem key={campaign.id} value={campaign.id}>
                  {campaign.name} - {new Date(campaign.start_datetime).toLocaleDateString('pt-BR')}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Valor Total"
              value={proposalData.total_value}
              onChange={(e) => handleInputChange('total_value', e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Número do Contrato"
              value={proposalData.contract_number}
              onChange={(e) => handleInputChange('contract_number', e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Data de Assinatura"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={proposalData.signature_date}
              onChange={(e) => handleInputChange('signature_date', e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Status da Venda"
              select
              value={proposalData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <MenuItem value="iniciada">Iniciada</MenuItem>
              <MenuItem value="em_andamento">Em Andamento</MenuItem>
              <MenuItem value="concluida">Concluída</MenuItem>
              <MenuItem value="cancelada">Cancelada</MenuItem>
              <MenuItem value="aguardando">Aguardando</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Documento Completo"
              select
              value={proposalData.is_completed_document}
              onChange={(e) => handleInputChange('is_completed_document', e.target.value)}
            >
              <MenuItem value={true}>Sim</MenuItem>
              <MenuItem value={false}>Não</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Data de Conclusão do Documento"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={proposalData.document_completion_date}
              onChange={(e) => handleInputChange('document_completion_date', e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary">
          Salvar Proposta
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateProposalModal;
