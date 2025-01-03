'use client';
import { createContext, useState } from 'react';

export const ServiceOpinionsContext = createContext();

export const ServiceOpinionsContextProvider = ({ children }) => {
  const [options, setOptions] = useState([]);
  const [filters, setFilters] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const refreshData = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <ServiceOpinionsContext.Provider
      value={{ options, setOptions, filters, setFilters, refreshData, refresh }}
    >
      {children}
    </ServiceOpinionsContext.Provider>
  );
};
