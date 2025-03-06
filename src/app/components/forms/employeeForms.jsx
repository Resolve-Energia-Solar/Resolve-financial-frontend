import React, { useState, useEffect } from 'react';
import { Grid, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import AutoCompleteDepartament from '../apps/comercial/sale/components/auto-complete/Auto-Input-Departament';
import AutoCompleteBranch from '../apps/comercial/sale/components/auto-complete/Auto-Input-Branch';
import AutoCompleteRole from '../apps/comercial/sale/components/auto-complete/Auto-Input-Role';
import RelatedBranchesSelect from './RelatedBranches';

export default function EmployeeForm({ employee, onChange }) {
  const [formData, setFormData] = useState({
    contract_type: employee?.contract_type || '',
    hire_date: employee?.hire_date || '',
    resignation_date: employee?.resignation_date || '',
    user_manager: employee?.user_manager || '',
    department_id: employee?.department_id || '',
    branch_id: employee?.branch_id || '',
    role_id: employee?.role_id || '',
    related_branches: employee?.related_branches || '',
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Grid container spacing={3} >

      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel>Tipo de Contrato</CustomFormLabel>
        <RadioGroup
          row
          value={formData.contract_type}
          onChange={(e) => handleChange('contract_type', e.target.value)}
        >
          <FormControlLabel value="PJ" control={<Radio />} label="Pessoa Jurídica" />
          <FormControlLabel value="PF" control={<Radio />} label="Pessoa Física" />
        </RadioGroup>
      </Grid>
      <Grid item xs={12} sm={12} lg={4}>
        <FormDate
          label="Data de Admissão"
          name="hire_date"
          value={formData.hire_date}
          onChange={(newValue) => handleChange('hire_date', newValue)}
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={4}>
        <FormDate
          label="Data de Demissão"
          name="resignation_date"
          value={formData.resignation_date}
          onChange={(newValue) => handleChange('resignation_date', newValue)}
        />
      </Grid>

      {/* Linha 2 */}
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel>Gestor</CustomFormLabel>
        <CustomTextField
          label="Gestor"
          fullWidth
          value={formData.user_manager}
          onChange={(e) => handleChange('user_manager', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel>Setor</CustomFormLabel>
        <AutoCompleteDepartament
          label="Departamento"
          value={formData.department_id}
          onChange={(newValue) => handleChange('department_id', newValue)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel>Unidade</CustomFormLabel>
        <AutoCompleteBranch
          label="Unidade"
          value={formData.branch_id}
          onChange={(newValue) => handleChange('branch_id', newValue)}
          fullWidth
        />
      </Grid>

      {/* Linha 3 */}
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel>Cargo</CustomFormLabel>
        <AutoCompleteRole
          label="Função"
          value={formData.role_id}
          onChange={(newValue) => handleChange('role_id', newValue)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={8} margin={0}>
        <CustomFormLabel>Unidades Relacionadas</CustomFormLabel>
        <RelatedBranchesSelect
          value={formData.related_branches}
          onChange={(newValue) => handleChange('related_branches', newValue)}
        />
      </Grid>
    </Grid>
  );
}
