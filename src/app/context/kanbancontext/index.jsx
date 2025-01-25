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
  const [error, setError] = useState(config.error);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [boardId, setBoardId] = useState(null);
  const [loadingLeadsIds, setLoadingLeadsIds] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  console.log('todoCategories', todoCategories)

  // Fetch todo data from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoadingCategories(true);
      try {
        const response = await columnService.getColumns({
          params: { fields: 'id,name', board: boardId },
        });
        setTodoCategories(response || []);
        setError(null);
      } catch (error) {
        handleError(error.message);
      } finally {
        setLoadingCategories(false);
      }
    };
    if (boardId) {
      fetchData();
    }
  }, [boardId]);

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

      updatedCategories[sourceCategoryIndex] = sourceCategory;
      updatedCategories[destinationCategoryIndex] = destinationCategory;

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
          };
        }
        return category;
      });
    });
  };
  


  // Function to handle errors
  const handleError = (errorMessage) => {
    setError(errorMessage);
  };
  // Function to delete a category
  const deleteCategory = async (categoryId, setTodoCategories) => {
    try {
      const response = await axios.delete('/api/TodoData', { data: { id: categoryId } });
      setTodoCategories(response.data);
      setError(null);
    } catch (error) {
      handleError(error.message);
    }
  };
  // Function to clear all tasks in a category
  const clearAllTasks = async (categoryId) => {
    try {
      const response = await axios.delete('/api/TodoData/clearTasks', { data: { categoryId } });
      const updatedTodoData = response.data;
      setTodoCategories(updatedTodoData);
      setError(null);
    } catch (error) {
      handleError(error.message);
    }
  };
  // Function to add a new category
  const addCategory = async (categoryName) => {
    try {
      const response = await axios.post('/api/TodoData/addCategory', { categoryName });
      setTodoCategories((prevCategories) => [...prevCategories, response.data]);
      setError(null);
    } catch (error) {
      handleError(error.message);
    }
  };
  // Function to delete a todo task
  const deleteTodo = async (taskId, setTodoCategories) => {
    try {
      const response = await axios.delete('/api/TodoData/deleteTask', { data: { taskId } });
      setTodoCategories(response.data);
    } catch (error) {
      handleError(error.message);
    }
  };
  return (
    <KanbanDataContext.Provider
      value={{
        todoCategories,
        loadingCategories,
        boardId,
        loadingLeadsIds,
        setLoadingLeadsIds,
        updateTask,
        addTask,
        setBoardId,
        setTodoCategories,
        addCategory,
        deleteCategory,
        clearAllTasks,
        deleteTodo,
        setError,
        moveTask,
      }}
    >
      {children}
    </KanbanDataContext.Provider>
  );
};
