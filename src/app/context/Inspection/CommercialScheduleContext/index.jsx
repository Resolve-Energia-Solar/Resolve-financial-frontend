'use client';
import { createContext, useState } from 'react';

export const CommercialScheduleDataContext = createContext();

export const CommercialScheduleDataContextProvider = ({ children }) => {
  const [filters, setFilters] = useState([]);

  const [refresh, setRefresh] = useState(false);

  const refreshData = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <CommercialScheduleDataContext.Provider value={{ filters, setFilters, refreshData, refresh }}>
      {children}
    </CommercialScheduleDataContext.Provider>
  );
};
