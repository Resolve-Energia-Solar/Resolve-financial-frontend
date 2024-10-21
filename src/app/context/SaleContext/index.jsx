'use client';
import { createContext, useState } from 'react';

export const SaleDataContext = createContext();

export const SaleDataContextProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    dateRange: [null, null],
    statusDocument: [],
  });


  return (
    <SaleDataContext.Provider value={{ filters, setFilters }}>
      {children}
    </SaleDataContext.Provider>
  );
};

