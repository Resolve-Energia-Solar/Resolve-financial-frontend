'use client';
import React, { useState, useEffect } from 'react';
import { Grid, Button, Stack, Alert } from '@mui/material';
import EmployeeForm from '@/app/components/forms/employeeForms';
import employeeService from '@/services/employeeService';
import useUser from '@/hooks/users/useUser';

export default function EmployeeData({ userId }) {
  const { loading, error, userData } = useUser(userId);
  const [employeeData, setEmployeeData] = useState(userData?.employee_data || {});
  const [loadingSave, setLoadingSave] = useState(false);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    if (userData && userData.employee_data) {
      setEmployeeData(userData.employee_data);
    }
  }, [userData]);

  const handleEmployeeChange = (data) => {
    setEmployeeData(data);
  };

  const handleSave = async () => {
    setLoadingSave(true);
    try {
      if (userData && userData.employee) {
        await employeeService.putEmployee(userData.employee, employeeData);
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

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

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
