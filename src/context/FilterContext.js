'use client';

import React, { createContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const FilterContext = createContext({
  filters: {},
  setFilters: () => {},
  clearFilters: () => {},
});

export const FilterProvider = ({ children }) => {
  const pathname = usePathname();
  const storageKey = `filters:${pathname}`;

  // 1) Estado inicial já vindo do sessionStorage
  const [filters, setFiltersState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // 2) Se o usuário navegar para outra rota, recarrega os filtros daquela rota
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(storageKey);
      setFiltersState(saved ? JSON.parse(saved) : {});
    }
  }, [storageKey]);

  // 3) Sempre que filters mudar, persiste no sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(storageKey, JSON.stringify(filters));
    }
  }, [filters, storageKey]);

  const setFilters = (newFilters) => {
    setFiltersState(newFilters);
  };

  const clearFilters = () => {
    setFiltersState({});
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(storageKey);
    }
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
};
