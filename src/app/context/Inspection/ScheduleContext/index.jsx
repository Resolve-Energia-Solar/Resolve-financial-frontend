'use client';
import { createContext, useState } from 'react';

export const ScheduleDataContext = createContext();

export const ScheduleDataContextProvider = ({ children }) => {
  const [filters, setFilters] = useState([]);

  const [refresh, setRefresh] = useState(false);

  const refreshData = () => {
    setRefresh((prev) => !prev);
  }

  return (
    <ScheduleDataContext.Provider value={{ filters, setFilters, refreshData, refresh }}>
      {children}
    </ScheduleDataContext.Provider>
  );
}
