import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import omieService from '@/services/omieService';
import { debounce } from 'lodash';

const normalizeCnpjCpf = (value) => value.replace(/[^\d]/g, '');

export default function AutoCompleteBeneficiary({ onChange, value, error, helperText, disabled, labeltitle }) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = React.useState(null);

  const fetchDefaultBeneficiary = async (beneficiaryId) => {
    if (beneficiaryId) {
      try {
        const beneficiaries = await omieService.getCustomers();
        const beneficiary = beneficiaries.find(ben => ben.codigo_cliente === beneficiaryId);
        if (beneficiary) {
          setSelectedBeneficiary({
            codigo_cliente: beneficiary.codigo_cliente,
            nome_fantasia: beneficiary.nome_fantasia,
            cnpj_cpf: normalizeCnpjCpf(beneficiary.cnpj_cpf)
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
        const beneficiaries = await omieService.getCustomers({ filter: filter });
        const formattedBeneficiaries = beneficiaries.map(ben => ({
          codigo_cliente: ben.codigo_cliente,
          nome_fantasia: ben.nome_fantasia,
          cnpj_cpf: normalizeCnpjCpf(ben.cnpj_cpf)
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

    const normalizedInput = normalizeCnpjCpf(newInputValue);
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
          />
        )}
      />
    </div>
  );
}