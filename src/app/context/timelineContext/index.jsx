'use client';
import React, { createContext, useState } from 'react';

export const TimelineContext = createContext();

export const TimelineProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        date: null,
        agent: '',
      });
    const [refresh, setRefresh] = useState(false);

    const refreshData = () => {
        setRefresh((prev) => !prev);
    }

    return (

        <TimelineContext.Provider value={{ filters, setFilters, refreshData, refresh }}>
            {children}
        </TimelineContext.Provider>

    );

};
