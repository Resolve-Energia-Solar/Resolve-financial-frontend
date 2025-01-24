'use client';
import { createContext, useState, useEffect } from 'react';
import axios from '@/utils/axios';
import columnService from '@/services/boardColumnService';

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

  console.log('boardId Context', boardId);

  // Fetch todo data from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoadingCategories(true);
      try {
        const response = await columnService.getColumns({ params: { fields: 'id,name', board: boardId } });
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

  const moveTask = (
    taskId,
    sourceCategoryId,
    destinationCategoryId,
    sourceIndex,
    destinationIndex,
  ) => {
    setTodoCategories((prevCategories) => {
      console.log('prevCategories', prevCategories);
      // Find the source and destination categories
      const sourceCategoryIndex = prevCategories.findIndex(
        (cat) => cat.id.toString() === sourceCategoryId,
      );
      console.log('sourceCategoryIndex', sourceCategoryIndex);
      const destinationCategoryIndex = prevCategories.findIndex(
        (cat) => cat.id.toString() === destinationCategoryId,
      );
      console.log('destinationCategoryIndex', destinationCategoryIndex);

      if (sourceCategoryIndex === -1 || destinationCategoryIndex === -1) {
        return prevCategories; // Return previous state if categories are not found
      }
      // Clone the source and destination categories
      const updatedCategories = [...prevCategories];
      console.log('updatedCategories', updatedCategories);
      const sourceCategory = { ...updatedCategories[sourceCategoryIndex] };
      console.log('sourceCategory', sourceCategory);
      const destinationCategory = { ...updatedCategories[destinationCategoryIndex] };

      // Remove the task from the source category
      const taskToMove = sourceCategory.child.splice(sourceIndex, 1)[0];

      // Insert the task into the destination category at the specified index
      destinationCategory.child.splice(destinationIndex, 0, taskToMove);

      // Update the categories in the state
      updatedCategories[sourceCategoryIndex] = sourceCategory;
      updatedCategories[destinationCategoryIndex] = destinationCategory;

      return updatedCategories;
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
