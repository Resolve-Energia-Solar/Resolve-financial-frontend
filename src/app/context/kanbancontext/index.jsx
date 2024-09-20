'use client';


import { createContext, useState } from 'react';

export const KanbanDataContext = createContext();

export const KanbanDataContextProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [leads, setLeads] = useState([]);

  const addCategory = (category) => {
    setCategories((prevCategories) => [...prevCategories, category]);
  };

  const addLead = (lead) => {
    setLeads((prevLeads) => [...prevLeads, lead]);
  };

  return (
    <KanbanDataContext.Provider value={{ categories, leads, addCategory, addLead }}>
      {children}
    </KanbanDataContext.Provider>
  );
};

