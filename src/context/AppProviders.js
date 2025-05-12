'use client';
import { usePathname } from 'next/navigation';
import { SystemConfigProvider } from './SystemConfigContext';
import { FilterProvider } from './FilterContext';

const AppProviders = ({ children }) => {
  const pathname = usePathname();
  return (
    <SystemConfigProvider>
      <FilterProvider key={pathname}>
        {children}
      </FilterProvider>
    </SystemConfigProvider>
  );
};

export default AppProviders;
