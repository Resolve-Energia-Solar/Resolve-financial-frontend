"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

// Context para dados do Kanban
const KanbanDataContext = createContext({
    todoCategories: [],
    loadingCategories: false,
    moveTask: () => { },
    addCategory: () => { },
    deleteCategory: () => { },
    clearAllTasks: () => { },
    deleteTodo: () => { },
    setError: () => { },
    error: null,
});

// Hook para consumir contexto de Kanban
export const useKanbanData = () => {
    const context = useContext(KanbanDataContext);
    if (!context) throw new Error("useKanbanData deve ser usado dentro de KanbanDataContextProvider");
    return context;
};

// Provider que gerencia estado e oferece funções do Kanban
export function KanbanDataContextProvider({ initialData = {}, onPageChange, children }) {
    const [kanban, setKanban] = useState(initialData);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setKanban(initialData);
        setLoadingCategories(Object.keys(initialData).length === 0);
    }, [initialData]);

    const statusLabels = {
        projeto_engenharia: "Projeto de Engenharia",
        lista_materiais: "Lista de Materiais",
        logistica: "Logística",
        instalacao: "Instalação",
        vistoria_final: "Vistoria Final",
        homologado: "Homologado",
        vistoria: "Vistoria",
        documentacao: "Documentação",
        financeiro: "Financeiro",
    };

    // Constrói categorias para renderização
    const todoCategories = Object.entries(kanban).map(([key, data]) => ({
        id: key,
        name: statusLabels[key] || key,
        child: data.projects || [],
        currentPage: data.current_page,
        totalPages: data.total_pages,
        hasNext: data.current_page < data.total_pages,
        hasPrevious: data.current_page > 1,
    }));

    // Funções de movimentação e atualização
    const moveTask = (taskId, sourceCat, destCat) => {
        if (onPageChange) {
            onPageChange(sourceCat, kanban[sourceCat]?.current_page || 1);
            onPageChange(destCat, kanban[destCat]?.current_page || 1);
        }
    };
    const addCategory = (categoryName) => {
        const key = categoryName.toLowerCase().replace(/\s+/g, "_");
        setKanban(prev => ({
            ...prev,
            [key]: { count: 0, total_pages: 1, current_page: 1, projects: [] },
        }));
    };
    const deleteCategory = (categoryId) => {
        setKanban(prev => {
            const copy = { ...prev };
            delete copy[categoryId];
            return copy;
        });
    };
    const clearAllTasks = (categoryId) => {
        setKanban(prev => ({
            ...prev,
            [categoryId]: { ...prev[categoryId], count: 0, projects: [] },
        }));
    };
    const deleteTodo = (taskId) => {
        setKanban(prev => {
            const updated = {};
            for (let [k, data] of Object.entries(prev)) {
                const filtered = (data.projects || []).filter(t => t.id.toString() !== taskId.toString());
                updated[k] = { ...data, projects: filtered, count: filtered.length };
            }
            return updated;
        });
    };

    return (
        <KanbanDataContext.Provider value={{
            todoCategories,
            loadingCategories,
            moveTask,
            addCategory,
            deleteCategory,
            clearAllTasks,
            deleteTodo,
            setError,
            error,
        }}>
            {children}
        </KanbanDataContext.Provider>
    );
}

// Exportações
export { KanbanDataContext, KanbanDataContextProvider };
export default KanbanDataContextProvider;