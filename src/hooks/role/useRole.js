import { useState, useEffect } from 'react';
import roleService from '@/services/roleService';

const useRole = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleData, setRoleData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchRole = async () => {
      try {
        const data = await roleService.find(id);
        setRoleData(data);
      } catch (err) {
        setError('Erro ao carregar a função');
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [id]);

  return { loading, error, roleData };
};

export default useRole;
