import { SystemConfigProvider } from "./SystemConfigContext";
import { FilterProvider } from "./FilterContext";

const AppProviders = ({ children }) => {
  return (
    <SystemConfigProvider>
      <FilterProvider>
        {children}
      </FilterProvider>
    </SystemConfigProvider>
  );
};

export default AppProviders;
