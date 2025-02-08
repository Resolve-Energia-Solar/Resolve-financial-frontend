import { SystemConfigProvider } from "./SystemConfigContext";

const AppProviders = ({ children }) => {
  return (
    <SystemConfigProvider>
      {children}
    </SystemConfigProvider>
  );
};

export default AppProviders;
