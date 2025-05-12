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
                    expand: "sale.costumer.complete_name,address,schedule",
                    fields: "id,address.street,address.number,address.neighborhood,schedule.final_service_opinion.name",
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
