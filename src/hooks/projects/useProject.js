import { useState, useEffect } from 'react';
import projectService from '@/services/projectService';

const useProject = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [rowSelected, setRowSelected] = useState(null)

  const handleRowClick = (item) => {

    setOpenDrawer(true)
    setRowSelected(item)

  }

  const toggleDrawerClosed = () => {
    setOpenDrawer(false)
    setRowSelected(null)
  };


  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const data = await projectService.getProjectById(id);
        setProjectData(data);
      } catch (err) {
        setError('Erro ao carregar o projeto');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  return { loading, error, projectData, openDrawer,rowSelected, toggleDrawerClosed, handleRowClick };
};

export default useProject;
