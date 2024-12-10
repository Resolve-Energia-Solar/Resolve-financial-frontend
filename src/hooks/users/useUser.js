import { useState, useEffect, useCallback } from 'react';
import userService from '@/services/userService';

const useUser = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  const fetchUser = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUserById(id);
      setUserData(data);
    } catch (err) {
      setError('Erro ao carregar o usuário');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { loading, error, userData, reload: fetchUser };
};

export default useUser;
