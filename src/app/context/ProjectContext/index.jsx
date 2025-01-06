'use client';
import { createContext, useState } from 'react';

export const ProjectDataContext = createContext();

export const ProjectDataContextProvider = ({ children }) => {
  const [filters, setFilters] = useState([]);

  const [refresh, setRefresh] = useState(false);

  const refreshData = () => {
    setRefresh((prev) => !prev);
  };


  return (
    <ProjectDataContext.Provider value={{ filters, setFilters, refreshData, refresh }}>
      {children}
    </ProjectDataContext.Provider>
  );
};

