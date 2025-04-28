import projectService from '@/services/projectService';
import { useSnackbar } from 'notistack';
import React, { createContext, useEffect, useState } from 'react';

export const ProjectDetailsContext = createContext();

export function projectModalTabProvider({ projectId, children }) {
  const [project, setProject] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  
  useEffect(() => {
    const fetchproject = async () => {
      try {
        const data = await projectService.find(projectId,{
          expand: "seller"
        })
        setProject(data);
      } catch (err) {
        enqueueSnackbar('Não foi possível carregar o projeto', { variant: 'error' });
      }
    };
    fetchproject();
  }, [projectId]);


  return <ProjectDetailsContext.Provider value={{ project }}>{children}</ProjectDetailsContext.Provider>;
}
