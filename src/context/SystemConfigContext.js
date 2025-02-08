import { createContext, useContext, useEffect, useState } from "react";

const SystemConfigContext = createContext();

export const SystemConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/system-config/`)
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateConfig = async (newConfig) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/system-config/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newConfig),
    });

    if (response.ok) {
      const updatedConfig = await response.json();
      setConfig(updatedConfig);
    }
  };

  return (
    <SystemConfigContext.Provider value={{ config, loading, updateConfig }}>
      {children}
    </SystemConfigContext.Provider>
  );
};

export const useSystemConfig = () => useContext(SystemConfigContext);
