import { useState, useEffect } from 'react';
import unitService from '@/services/unitService';

const useUnit = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unitData, setUnitData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchUnit = async () => {
      try {
        const data = await unitService.find(id, {
          fields: 'id,name,type,main_unit,supply_adquance.name,supply_adquance.id,unit_percentage,address,type,unit_number,new_contract_number,account_number,bill_file,project',
          expand: 'supply_adquance,address',
        });
        console.log('data', data);
        setUnitData(data);
      } catch (err) {
        setError('Erro ao carregar a unidade');
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [id]);

  return { loading, error, unitData };
};

export default useUnit;

