'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'next/navigation';

import {
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Stack,
  Button,
} from '@mui/material';

import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import AutoCompleteDepartament from '../../../comercial/sale/components/auto-complete/Auto-Input-Departament';
import AutoCompleteBranch from '../../../comercial/sale/components/auto-complete/Auto-Input-Branch';
import AutoCompleteRole from '../../../comercial/sale/components/auto-complete/Auto-Input-Role';
import RelatedBranchesSelect from '@/app/components/forms/RelatedBranches';
import AutoCompleteUser from '../../../comercial/sale/components/auto-complete/Auto-Input-User';

import userService from '@/services/userService';
import employeeService from '@/services/employeeService';

function EmployeeForm({ employee, onChange, errors }) {
  const loggedUser = useSelector(state => state.user?.user);
  const isSuperUser = loggedUser?.is_superuser;
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
    // Permite alteração somente se for superusuário
    if (!isSuperUser) return;
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
          <FormControlLabel
            disabled={!isSuperUser}
            value="P"
            control={<Radio disabled={!isSuperUser} />}
            label="Pessoa Jurídica"
          />
          <FormControlLabel
            disabled={!isSuperUser}
            value="C"
            control={<Radio disabled={!isSuperUser} />}
            label="Celetista"
          />
        </RadioGroup>
        {errors.contract_type && <Alert severity="error">{errors.contract_type[0]}</Alert>}
      </Grid>
      <Grid item xs={12} sm={12} lg={4}>
        <FormDate
          label="Data de Admissão"
          name="hire_date"
          value={formData.hire_date}
          onChange={newValue => handleChange('hire_date', newValue)}
          error={!!errors.hire_date}
          helperText={errors.hire_date ? errors.hire_date[0] : ''}
          disabled={!isSuperUser}
        />
      </Grid>
      {isSuperUser && (
        <Grid item xs={12} sm={12} lg={4}>
          <FormDate
            label="Data de Demissão"
            name="resignation_date"
            value={formData.resignation_date}
            onChange={newValue => handleChange('resignation_date', newValue)}
            error={!!errors.resignation_date}
            helperText={errors.resignation_date ? errors.resignation_date[0] : ''}
            disabled={!isSuperUser}
          />
        </Grid>
      )}

      {/* Linha 2 */}
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel>Gestor</CustomFormLabel>
        <AutoCompleteUser
          value={formData.user_manager}
          onChange={newValue => handleChange('user_manager', newValue)}
          fullWidth
          error={!!errors.user_manager}
          helperText={errors.user_manager ? errors.user_manager[0] : ''}
          disabled={!isSuperUser}
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel>Setor</CustomFormLabel>
        <AutoCompleteDepartament
          label="Departamento"
          value={formData.department_id}
          onChange={newValue => handleChange('department_id', newValue)}
          fullWidth
          error={!!errors.department_id}
          helperText={errors.department_id ? errors.department_id[0] : ''}
          disabled={!isSuperUser}
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel>Unidade</CustomFormLabel>
        <AutoCompleteBranch
          label="Unidade"
          value={formData.branch_id}
          onChange={newValue => handleChange('branch_id', newValue)}
          fullWidth
          error={!!errors.branch_id}
          helperText={errors.branch_id ? errors.branch_id[0] : ''}
          disabled={!isSuperUser}
        />
      </Grid>

      {/* Linha 3 */}
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel>Cargo</CustomFormLabel>
        <AutoCompleteRole
          label="Cargo"
          value={formData.role_id}
          onChange={newValue => handleChange('role_id', newValue)}
          fullWidth
          error={!!errors.role_id}
          helperText={errors.role_id ? errors.role_id[0] : ''}
          disabled={!isSuperUser}
        />
      </Grid>
      {isSuperUser && (
        <Grid item xs={12} sm={12} lg={8}>
          <CustomFormLabel>Unidades Relacionadas</CustomFormLabel>
          <RelatedBranchesSelect
            value={formData.related_branches}
            onChange={newValue => handleChange('related_branches', newValue)}
            error={!!errors.related_branches}
            helperText={errors.related_branches ? errors.related_branches[0] : ''}
            disabled={!isSuperUser}
          />
        </Grid>
      )}
    </Grid>
  );
}

export { EmployeeForm };


export default function EmployeeData() {
  const { id } = useParams();
  const loggedUser = useSelector(state => state.user?.user);
  const isSuperUser = loggedUser?.is_superuser;
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
  const [errors, setErrors] = useState({});

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
    setErrors({});
    try {
      const payload = {
        ...employeeData,
        user_id: userData.id,
        contract_type:
          employeeData.contract_type === 'PJ'
            ? 'P'
            : employeeData.contract_type === 'CLT'
              ? 'C'
              : employeeData.contract_type,
        hire_date: employeeData.hire_date ? employeeData.hire_date : null,
        resignation_date: employeeData.resignation_date ? employeeData.resignation_date : null,
        user: {},
      };

      if (userData && userData.employee) {
        await employeeService.putEmployee(userData.employee.id, payload);
      } else {
        await employeeService.createEmployee(payload);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        console.error(error);
      }
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
      <EmployeeForm employee={employeeData} onChange={handleEmployeeChange} errors={errors} />
      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
        {isSuperUser && (
          <Button variant="contained" color="primary" onClick={handleSave} disabled={loadingSave}>
            {loadingSave ? 'Salvando...' : 'Salvar Funcionário'}
          </Button>
        )}
      </Stack>
    </>
  );
}