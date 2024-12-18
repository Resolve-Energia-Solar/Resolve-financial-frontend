'use client';
import { createContext, useState } from 'react';

export const CategoryDataContext = createContext();

export const CategoryDataContextProvider = ({ children }) => {
  const [filters, setFilters] = useState([]);

  const [refresh, setRefresh] = useState(false);

  const refreshData = () => {
    setRefresh((prev) => !prev);
  }

  return (
    <CategoryDataContext.Provider value={{ filters, setFilters, refreshData, refresh }}>
      {children}
    </CategoryDataContext.Provider>
  );
};
