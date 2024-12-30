'use client';
import { createContext, useState } from 'react';

export const DeadlineDataContext = createContext();

export const DeadlineDataContextProvider = ({ children }) => {
  const [filters, setFilters] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const refreshData = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <DeadlineDataContext.Provider value={{ filters, setFilters, refreshData, refresh }}>
      {children}
    </DeadlineDataContext.Provider>
  );
};
