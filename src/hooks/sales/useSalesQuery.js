// hooks/sales/useSalesQuery.js

import { useQuery } from '@tanstack/react-query';
import saleService from '@/services/saleService';

export const useSalesQuery = (filters, page, rowsPerPage, order, orderDirection) => {
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['salesList', filters, page, rowsPerPage, order, orderDirection],

    queryFn: async () => {
      const orderingParam = order ? `${orderDirection === 'asc' ? '' : '-'}${order}` : '-created_at';

      const { data } = await saleService.getOptimizedSales({
        ...filters,
        limit: rowsPerPage,
        page: page + 1, 
        ordering: orderingParam,
      });
      return data;
    },

    placeholderData: (previousData) => previousData,
  });

  return { data, isLoading, isError, error, isFetching };
};