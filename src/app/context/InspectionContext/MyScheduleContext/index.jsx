'use client';
import { createContext, useState } from 'react';

export const MyScheduleDataContext = createContext();

export const MyScheduleDataContextProvider = ({ children }) => {
  const [filters, setFilters] = useState([]);

  const [refresh, setRefresh] = useState(false);

  const refreshData = () => {
    setRefresh((prev) => !prev);
  };


  return (
    <MyScheduleDataContext.Provider value={{ filters, setFilters, refreshData, refresh }}>
      {children}
    </MyScheduleDataContext.Provider>
  );
};

