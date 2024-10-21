'use client';
import { createContext, useState } from 'react';

export const SaleDataContext = createContext();

export const SaleDataContextProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    dateRange: [null, null],
    statusDocument: [],
  });

  const [refresh, setRefresh] = useState(false);

  const refreshData = () => {
    setRefresh((prev) => !prev);
  };


  return (
    <SaleDataContext.Provider value={{ filters, setFilters, refreshData, refresh }}>
      {children}
    </SaleDataContext.Provider>
  );
};

