import { useState, useEffect } from 'react';
import departmentService from '@/services/departmentService';

const useDepartment = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departmentData, setDepartmentData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchDepartment = async () => {
      try {
        const data = await departmentService.find(id);
        setDepartmentData(data);
      } catch (err) {
        setError('Erro ao carregar o departamento');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  return { loading, error, departmentData };
};

export default useDepartment;
