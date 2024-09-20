import { createContext, useState } from 'react';

// Criação do contexto
export const KanbanDataContext = createContext();

// Criação do provider
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

