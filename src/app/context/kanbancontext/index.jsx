"use client";
import { createContext, useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import Cookies from "js-cookie";

export const KanbanDataContext = createContext();

export const KanbanDataContextProvider = ({ children }) => {
  const [todoCategories, setTodoCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoriesAndLeads = async () => {
      try {
        const { data: categories, error: categoriesError } = await supabase
          .from("kanban_categories")
          .select("*");

        if (categoriesError) {
          throw new Error(categoriesError.message);
        }

        const { data: tasks, error: tasksError } = await supabase
          .from("leads")
          .select("*");

        if (tasksError) {
          throw new Error(tasksError.message);
        }

        const categoriesWithTasks = categories.map((category) => ({
          ...category,
          child: tasks.filter((task) => task.category_id === category.id),
        }));

        setTodoCategories(categoriesWithTasks);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCategoriesAndLeads();
  }, []);

  const addCategory = async (categoryName) => {
    try {
      const { data, error } = await supabase
        .from("kanban_categories")
        .insert([{ name: categoryName }])
        .single();

      if (error) throw error;

      setTodoCategories((prevCategories) => [
        ...prevCategories,
        { ...data, child: [] },
      ]);
    } catch (error) {
      setError(error.message);
    }
  };

  const addTask = async (categoryId, newTaskData) => {
    try {
      const { data, error } = await supabase
        .from("leads")
        .insert([{ ...newTaskData, category_id: categoryId }])
        .single();

      if (error) throw error;

      setTodoCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryId
            ? { ...category, child: [...category.child, data] }
            : category
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <KanbanDataContext.Provider
      value={{ todoCategories, addCategory, addTask, error }}
    >
      {children}
    </KanbanDataContext.Provider>
  );
};
