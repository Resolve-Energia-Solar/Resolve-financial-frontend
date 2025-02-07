'use client';
import { createContext, useState } from 'react';

export const RequestDataContext = createContext();

export const RequestDataContextProvider = ({ children }) => {
  const [filters, setFilters] = useState([]);

  const [refresh, setRefresh] = useState(false);

  const refreshData = () => {
    setRefresh((prev) => !prev);
  };


  return (
    <RequestDataContext.Provider value={{ filters, setFilters, refreshData, refresh }}>
      {children}
    </RequestDataContext.Provider>
  );
};

