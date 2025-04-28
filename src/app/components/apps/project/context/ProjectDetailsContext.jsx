import projectService from '@/services/projectService';
import { fi } from 'date-fns/locale';
import { useSnackbar } from 'notistack';
import React, { createContext, useEffect, useState } from 'react';

export const ProjectDetailsContext = createContext();

export function projectModalTabProvider({ projectId, children }) {
    const [project, setProject] = useState(null);
    const { enqueueSnackbar } = useSnackbar();


    useEffect(() => {
        const fetchproject = async () => {
            try {
                const data = await projectService.find(projectId, {
                    expand: "sale.costumer.complete_name,address",
                    //   expand: "sale.costumer.complete_name,address,products,scheduled_agent,service,project",
                    fields: "id,address.street,address.number,address.neighborhood",
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
