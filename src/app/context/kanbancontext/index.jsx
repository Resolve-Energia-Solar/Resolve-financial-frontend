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
    // Colocar o ID da tarefa em loading
    setLoadingLeadsIds((prev) => [...prev, taskId]);

    let originalState;

    setTodoCategories((prevCategories) => {
      // Encontrar as categorias de origem e destino
      const sourceCategoryIndex = prevCategories.findIndex(
        (cat) => cat.id.toString() === sourceCategoryId,
      );
      const destinationCategoryIndex = prevCategories.findIndex(
        (cat) => cat.id.toString() === destinationCategoryId,
      );

      if (sourceCategoryIndex === -1 || destinationCategoryIndex === -1) {
        return prevCategories; // Retornar o estado anterior se as categorias não forem encontradas
      }

      // Clonar as categorias (evitar mutação direta)
      const updatedCategories = [...prevCategories];
      const sourceCategory = { ...updatedCategories[sourceCategoryIndex] };
      const destinationCategory = { ...updatedCategories[destinationCategoryIndex] };

      // Salvar estado original para revertê-lo em caso de erro
      originalState = JSON.parse(JSON.stringify(updatedCategories));

      // Remover a tarefa da categoria de origem
      const taskToMove = sourceCategory.child.splice(sourceIndex, 1)[0];

      // Inserir a tarefa na categoria de destino na posição especificada
      destinationCategory.child.splice(destinationIndex, 0, taskToMove);

      // Atualizar as categorias no estado
      updatedCategories[sourceCategoryIndex] = sourceCategory;
      updatedCategories[destinationCategoryIndex] = destinationCategory;

      return updatedCategories;
    });

    try {
      await leadService.patchLead(taskId, { column_id: destinationCategoryId });
      enqueueSnackbar('Tarefa movida com sucesso', { variant: 'success' });
    } catch (error) {
      console.error('Erro ao mover tarefa:', error.message);
      enqueueSnackbar('Erro ao mover tarefa', { variant: 'error' });
      setTodoCategories(originalState);
    } finally {
      setLoadingLeadsIds((prev) => prev.filter((id) => id !== taskId));
    }
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
