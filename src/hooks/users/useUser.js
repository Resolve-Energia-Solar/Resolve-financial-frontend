import { useState, useEffect } from 'react';
import userService from '@/services/userService';

const useUser = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const data = await userService.getUserById(id);
        setUserData(data);
      } catch (err) {
        setError('Erro ao carregar o usuário');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  return { loading, error, userData };
};

export default useUser;
