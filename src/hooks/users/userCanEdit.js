import { useState, useEffect, useCallback } from 'react';
import saleService from '@/services/saleService';

const useCanEditUser = (id) => {
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPermission = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const data = await saleService.find(id, {
        fields: 'can_edit',
      });
      setCanEdit(!!data?.can_edit);
    } catch (err) {
      setCanEdit(false);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPermission();
  }, [fetchPermission]);

  return { canEdit, loading, reload: fetchPermission };
};

export default useCanEditUser;
