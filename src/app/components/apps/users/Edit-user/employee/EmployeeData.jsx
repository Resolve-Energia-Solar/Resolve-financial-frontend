'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Grid,
  Button,
  Stack,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import AutoCompleteDepartament from '../../../comercial/sale/components/auto-complete/Auto-Input-Departament';
import AutoCompleteBranch from '../../../comercial/sale/components/auto-complete/Auto-Input-Branch';
import AutoCompleteRole from '../../../comercial/sale/components/auto-complete/Auto-Input-Role';
import RelatedBranchesSelect from '@/app/components/forms/RelatedBranches';
import AutoCompleteUser from '../../../comercial/sale/components/auto-complete/Auto-Input-User';
import employeeService from '@/services/employeeService';
import userService from '@/services/userService';

function EmployeeForm({ employee, onChange }) {
  const [formData, setFormData] = useState({
    contract_type: employee?.contract_type || '',
    hire_date: employee?.hire_date || '',
    resignation_date: employee?.resignation_date || '',
    user_manager: employee?.user_manager || '',
    department_id: employee?.department_id || '',
    branch_id: employee?.branch_id || '',
    role_id: employee?.role_id || '',
    related_branches: employee?.related_branches || [],
  });

  useEffect(() => {
    setFormData({
      contract_type: employee?.contract_type || '',
      hire_date: employee?.hire_date || '',
      resignation_date: employee?.resignation_date || '',
      user_manager: employee?.user_manager || '',
      department_id: employee?.department_id || '',
      branch_id: employee?.branch_id || '',
      role_id: employee?.role_id || '',
      related_branches: employee?.related_branches || [],
    });
  }, [employee]);

  const handleChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      onChange(newData);
      return newData;
    });
  };

  return (
    <Grid container spacing={3}>
      {/* Linha 1 */}
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel>Tipo de Contrato</CustomFormLabel>
        <RadioGroup
          row
          value={formData.contract_type}
          onChange={e => handleChange('contract_type', e.target.value)}
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
          onChange={newValue => handleChange('hire_date', newValue)}
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={4}>
        <FormDate
          label="Data de Demissão"
          name="resignation_date"
          value={formData.resignation_date}
          onChange={newValue => handleChange('resignation_date', newValue)}
        />
      </Grid>

      {/* Linha 2 */}
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel>Gestor</CustomFormLabel>
        <AutoCompleteUser
          value={formData.user_manager}
          onChange={newValue => handleChange('user_manager', newValue)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel>Setor</CustomFormLabel>
        <AutoCompleteDepartament
          label="Departamento"
          value={formData.department_id}
          onChange={newValue => handleChange('department_id', newValue)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel>Unidade</CustomFormLabel>
        <AutoCompleteBranch
          label="Unidade"
          value={formData.branch_id}
          onChange={newValue => handleChange('branch_id', newValue)}
          fullWidth
        />
      </Grid>

      {/* Linha 3 */}
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel>Cargo</CustomFormLabel>
        <AutoCompleteRole
          label="Função"
          value={formData.role_id}
          onChange={newValue => handleChange('role_id', newValue)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={8} margin={0}>
        <CustomFormLabel>Unidades Relacionadas</CustomFormLabel>
        <RelatedBranchesSelect
          value={formData.related_branches}
          onChange={newValue => handleChange('related_branches', newValue)}
        />
      </Grid>
    </Grid>
  );
}

export default function EmployeeData() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [employeeData, setEmployeeData] = useState({
    contract_type: '',
    hire_date: '',
    resignation_date: '',
    user_manager: '',
    department_id: '',
    branch_id: '',
    role_id: '',
    related_branches: [],
  });
  const [loadingSave, setLoadingSave] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      userService.getUserById(id)
        .then(data => {
          setUserData(data);
          let dataEmployee = {};
          if (data.employee) {
            dataEmployee = data.employee;
          }
          if (Object.keys(dataEmployee).length) {
            setEmployeeData({
              contract_type: dataEmployee.contract_type || '',
              hire_date: dataEmployee.hire_date || '',
              resignation_date: dataEmployee.resignation_date || '',
              user_manager: dataEmployee.user_manager || '',
              department_id: dataEmployee.department?.id || dataEmployee.department || '',
              branch_id: dataEmployee.branch?.id || dataEmployee.branch || '',
              role_id: dataEmployee.role?.id || dataEmployee.role || '',
              related_branches: dataEmployee.related_branches || [],
            });
          }
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleEmployeeChange = data => {
    setEmployeeData(data);
  };

  const handleSave = async () => {
    setLoadingSave(true);
    try {
      if (userData && userData.employee) {
        await employeeService.putEmployee(userData.employee.id, employeeData);
      } else {
        await employeeService.createEmployee(employeeData);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSave(false);
    }
  };

  if (!userData) return <div>Carregando...</div>;

  return (
    <>
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Funcionário salvo com sucesso!
        </Alert>
      )}
      <EmployeeForm employee={employeeData} onChange={handleEmployeeChange} />
      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={loadingSave}>
          {loadingSave ? 'Salvando...' : 'Salvar Funcionário'}
        </Button>
      </Stack>
    </>
  );
}
