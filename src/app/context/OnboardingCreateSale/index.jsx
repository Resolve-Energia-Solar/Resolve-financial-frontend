'use client';
import { createContext, useState } from 'react';

export const OnboardingSaleContext = createContext();

export const OnboardingSaleContextProvider = ({ children }) => {
  const [saleId, setSaleId] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const [customerId, setCustomerId] = useState(null);
  const [productIds, setProductIds] = useState([]);
  const [financialIds, setFinancialIds] = useState([]);
  const [checklistIds, setChecklistIds] = useState([]);

  const [isCustomerClicked, setIsCustomerClicked] = useState(false);

  console.log('productIds', productIds);

  return (
    <OnboardingSaleContext.Provider
      value={{
        saleId,
        setSaleId,
        totalValue,
        setTotalValue,
        customerId,
        setCustomerId,
        productIds,
        setProductIds,
        financialIds,
        setFinancialIds,
        checklistIds,
        setChecklistIds,
        isCustomerClicked,
        setIsCustomerClicked,
      }}
    >
      {children}
    </OnboardingSaleContext.Provider>
  );
};
