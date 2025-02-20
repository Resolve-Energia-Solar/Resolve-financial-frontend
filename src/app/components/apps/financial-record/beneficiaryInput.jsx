import React, { Fragment } from 'react';
import { IconButton, CircularProgress } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import AddIcon from '@mui/icons-material/Add';
import { debounce } from 'lodash';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import omieService from '@/services/omieService';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import InputCpfCnpj from '@/app/components/shared/InputCpfCnpj';

const normalizeCnpjCpf = (value) => value.replace(/[^\d]/g, '');

export default function AutoCompleteBeneficiary({ onChange, value, error, helperText, disabled, labeltitle }) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = React.useState(null);

  // Estados para o modal de adicionar fornecedor
  const [modalOpen, setModalOpen] = React.useState(false);
  const [supplierCpfCnpj, setSupplierCpfCnpj] = React.useState('');
  const [supplierName, setSupplierName] = React.useState('');
  const [supplierError, setSupplierError] = React.useState(null);

  const handleCpfCnpjChange = (e) => {
    setSupplierCpfCnpj(e.target.value);
  };

  // Função para abrir o modal
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  // Função para fechar o modal e resetar os campos
  const handleCloseModal = () => {
    setModalOpen(false);
    setSupplierCpfCnpj('');
    setSupplierName('');
    setSupplierError(null);
  };

  // Função para salvar os dados do fornecedor via addCustomer
  const handleSaveSupplier = async () => {
    try {
      const customerData = {
        cnpj_cpf: supplierCpfCnpj.replace(/\D/g, ''),
        name: supplierName,
      };

      // Chama a função addCustomer através do objeto omieService
      const newCustomer = await omieService.addCustomer({ call: 'IncluirCliente', customer: customerData });
      console.log('Cliente adicionado:', newCustomer);

      // Atualiza o beneficiário selecionado com o novo cliente
      const codigoCliente = newCustomer.codigo_cliente || newCustomer.id;
      setSelectedBeneficiary({
        codigo_cliente: codigoCliente,
        nome_fantasia: newCustomer.nome_fantasia || supplierName,
        cnpj_cpf: supplierCpfCnpj,
      });
      onChange(codigoCliente);

      // Limpa eventuais mensagens de erro e fecha o modal
      setSupplierError(null);
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao adicionar fornecedor:", error);
      let errorMsg = "Erro ao adicionar fornecedor.";
      if (error.response && error.response.data) {
        const { error: errMsg, details } = error.response.data;
        errorMsg = errMsg || errorMsg;
        if (details && details.faultstring) {
            if (details.faultstring.includes('Cliente já cadastrado')) {
            errorMsg = 'CNPJ/CPF já cadastrado';
          } else if (details.faultstring.includes('O número do documento informado') && details.faultstring.includes('é inválido.')) {
            errorMsg = 'CNPJ/CPF inválido, revise-o e tente novamente.';
          } else {
            errorMsg = 'Erro ao adicionar fornecedor. Tente novamente ou procure o suporte.';
          }
        }
      }
      setSupplierError(errorMsg);
    }
  };

  const fetchDefaultBeneficiary = async (beneficiaryId) => {
    if (beneficiaryId) {
      try {
        const beneficiaries = await omieService.getCustomers();
        const beneficiary = beneficiaries.find((ben) => ben.codigo_cliente === beneficiaryId);
        if (beneficiary) {
          setSelectedBeneficiary({
            codigo_cliente: beneficiary.codigo_cliente,
            nome_fantasia: beneficiary.nome_fantasia,
            cnpj_cpf: normalizeCnpjCpf(beneficiary.cnpj_cpf),
          });
          if (!value) onChange(beneficiary.codigo_cliente);
        }
      } catch (error) {
        console.error('Erro ao buscar beneficiário:', error);
      }
    }
  };

  React.useEffect(() => {
    fetchDefaultBeneficiary(value);
  }, [value]);

  const handleChange = (event, newValue) => {
    setSelectedBeneficiary(newValue);
    if (newValue) {
      onChange(newValue.codigo_cliente);
    } else {
      onChange(null);
    }
  };

  const fetchBeneficiariesByFilter = React.useCallback(
    debounce(async (filter) => {
      if (!filter) return;
      setLoading(true);
      try {
        const beneficiaries = await omieService.getCustomers({ filter });
        const formattedBeneficiaries = beneficiaries.map((ben) => ({
          codigo_cliente: ben.codigo_cliente,
          nome_fantasia: ben.nome_fantasia,
          cnpj_cpf: normalizeCnpjCpf(ben.cnpj_cpf),
        }));
        setOptions(formattedBeneficiaries);
      } catch (error) {
        console.error('Erro ao buscar beneficiários:', error);
      }
      setLoading(false);
    }, 1000),
    []
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  const handleInputChange = (event, newInputValue, reason) => {
    if (reason === 'reset') return;
    if (!newInputValue) {
      setOptions([]);
      return;
    }
    const normalizedInput = newInputValue.replace(/\D/g, '');
    if (/^\d/.test(newInputValue)) {
      if (normalizedInput.length >= 11) {
        fetchBeneficiariesByFilter(normalizedInput);
      }
    } else {
      fetchBeneficiariesByFilter(newInputValue);
    }
  };

  return (
    <div>
      <Autocomplete
        sx={{ width: '100%' }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) => option.codigo_cliente === value.codigo_cliente}
        getOptionLabel={(option) => `${option.nome_fantasia} - ${option.cnpj_cpf}`}
        options={options}
        noOptionsText="Digite algo para buscar..."
        loading={loading}
        disabled={disabled}
        value={selectedBeneficiary}
        onInputChange={handleInputChange}
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
                    aria-label="Adicionar fornecedor"
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

      {/* Modal para cadastro do fornecedor */}
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>Adicionar Fornecedor</DialogTitle>
        <DialogContent>
          {supplierError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {supplierError}
            </Alert>
          )}
          <InputCpfCnpj value={supplierCpfCnpj} onChange={handleCpfCnpjChange} />
          <CustomTextField
            label="Nome do Fornecedor"
            variant="outlined"
            fullWidth
            margin="normal"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleSaveSupplier} color="primary" variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
