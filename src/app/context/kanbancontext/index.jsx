'use client';
import { createContext, useState, useEffect } from 'react';
import axios from '@/utils/axios';
import columnService from '@/services/boardColumnService';
import leadService from '@/services/leadService';
import { useSnackbar } from 'notistack';

export const KanbanDataContext = createContext();
const config = {
  todoCategories: [],
  error: null,
};

export const KanbanDataContextProvider = ({ children }) => {
  const [todoCategories, setTodoCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [boardId, setBoardId] = useState(null);
  const [loadingLeadsIds, setLoadingLeadsIds] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingCategories(true);
      try {
        const response = await columnService.getColumns({
          params: { fields: 'id,name,color,column_type', board: boardId, ordering: 'position' },
        });
        setTodoCategories(response || []);
      } catch (error) {
        console.log(error?.message)
      } finally {
        setLoadingCategories(false);
      }
    };
    if (boardId) {
      fetchData();
    }
  }, [boardId, reload]);

  const refresh = () => {
    setReload((prev) => !prev);
  };

  const moveTask = async (
    taskId,
    sourceCategoryId,
    destinationCategoryId,
    sourceIndex,
    destinationIndex,
  ) => {
    setLoadingLeadsIds((prev) => [...prev, taskId]);
  
    let originalState;
  
    setTodoCategories((prevCategories) => {
      const sourceCategoryIndex = prevCategories.findIndex(
        (cat) => cat.id.toString() === sourceCategoryId,
      );
      const destinationCategoryIndex = prevCategories.findIndex(
        (cat) => cat.id.toString() === destinationCategoryId,
      );
  
      if (sourceCategoryIndex === -1 || destinationCategoryIndex === -1) {
        return prevCategories;
      }
  
      const updatedCategories = [...prevCategories];
      const sourceCategory = { ...updatedCategories[sourceCategoryIndex] };
      const destinationCategory = { ...updatedCategories[destinationCategoryIndex] };
  
      originalState = JSON.parse(JSON.stringify(updatedCategories));
  
      const taskToMove = sourceCategory.child.splice(sourceIndex, 1)[0];
  
      destinationCategory.child.splice(destinationIndex, 0, taskToMove);
  
      updatedCategories[sourceCategoryIndex] = {
        ...sourceCategory,
        count: sourceCategory.count - 1,
      };
      updatedCategories[destinationCategoryIndex] = {
        ...destinationCategory,
        count: destinationCategory.count + 1,
      };
  
      return updatedCategories;
    });
  
    try {
      await leadService.patchLead(taskId, { column_id: destinationCategoryId });
      enqueueSnackbar('Lead movido com sucesso', { variant: 'success' });
    } catch (error) {
      console.error('Erro ao mover o lead:', error.message);
      enqueueSnackbar('Erro ao mover o lead', { variant: 'error' });
      setTodoCategories(originalState);
    } finally {
      setLoadingLeadsIds((prev) => prev.filter((id) => id !== taskId));
    }
  };
  

  const insertChildren = (categoryId, childrenToAdd, overwrite = false) => {
    setTodoCategories((prevCategories) => {
      return prevCategories.map((category) => {
        if (category.id === categoryId) {
          const currentChildren = category.child ?? [];
          
          if (childrenToAdd.length === 0 && !overwrite) {
            console.warn('Nenhum child foi adicionado.');
            return category;
          }
          return {
            ...category,
            child: overwrite ? [...childrenToAdd] : [...currentChildren, ...childrenToAdd],
          };
        }
        return category;
      });
    });
  };
  
  const setCount = (categoryId, count) => {
    setTodoCategories((prevCategories) => {
      return prevCategories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            count,
          };
        }
        return category;
      });
    });
  };
  

  const updateTask = (taskId, data) => {
    setTodoCategories((prevCategories) => {
      return prevCategories.map((category) => {
        return {
          ...category,
          child: category.child.map((task) =>
            task.id === taskId ? { ...task, ...data } : task
          ),
        };
      });
    });
  };

  const addTask = (categoryId, newTask) => {
    setTodoCategories((prevCategories) => {
      return prevCategories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            child: [newTask, ...category.child],
            count: (category.count || 0) + 1,
          };
        }
        return category;
      });
    });
  };
  
  
  return (
    <KanbanDataContext.Provider
      value={{
        todoCategories,
        loadingCategories,
        boardId,
        loadingLeadsIds,
        setCount,
        insertChildren,
        setLoadingLeadsIds,
        updateTask,
        addTask,
        refresh,
        setBoardId,
        setTodoCategories,
        moveTask,
      }}
    >
      {children}
    </KanbanDataContext.Provider>
  );
};
