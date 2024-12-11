'use client';
import { createContext, useState } from 'react';

export const OnboardingSaleContext = createContext();

export const OnboardingSaleContextProvider = ({ children }) => {
  const [customerId, setCustomerId] = useState(null);
  const [productIds, setProductIds] = useState([]);
  const [financialIds, setFinancialIds] = useState([]);
  const [checklistIds, setChecklistIds] = useState([]);

  const [isCustomerClicked, setIsCustomerClicked] = useState(false);

  console.log('productIds', productIds);

  return (
    <OnboardingSaleContext.Provider value={{ financialIds, setFinancialIds, productIds, setProductIds, customerId, setCustomerId, checklistIds, setChecklistIds, isCustomerClicked, setIsCustomerClicked }}>
      {children}
    </OnboardingSaleContext.Provider>
  );
};

