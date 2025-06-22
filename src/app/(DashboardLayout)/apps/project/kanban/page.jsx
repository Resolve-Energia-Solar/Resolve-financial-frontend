"use client";

import React, { useEffect, useState } from "react";
import JourneyKanban from "@/app/components/apps/project/Costumer-journey/Kanban";
import projectService from "@/services/projectService";
import { useSnackbar } from "notistack";
import PageContainer from "@/app/components/container/PageContainer";

const STATUS_KEYS = [
    "vistoria",
    "documentacao",
    "financeiro",
    "projeto_engenharia",
    "lista_materiais",
    "logistica",
    "instalacao",
    "vistoria_final",
    "homologado",
];

export default function KanbanPage() {
    const [kanbanData, setKanbanData] = useState({});
    const [pageNumbers, setPageNumbers] = useState(
        STATUS_KEYS.reduce((acc, key) => ({ ...acc, [`${key}_page`]: 1 }), {})
    );
    const [loadingColumns, setLoadingColumns] = useState({});
    const enqueueSnackbar = useSnackbar();

    // Carrega a primeira página de todas as colunas
    useEffect(() => {
        try {
            projectService.kanban(pageNumbers).then((data) => {
                setKanbanData(data);
            });
        } catch (error) {
            console.error("Erro ao carregar dados do kanban:", error);
            enqueueSnackbar("Erro ao carregar dados do kanban", { variant: "error" });
        }
    }, []);

    // Callback para carregar mais itens de uma coluna
    const loadMore = async (columnKey) => {
        const nextPage = pageNumbers[`${columnKey}_page`] + 1;
        setLoadingColumns((prev) => ({ ...prev, [columnKey]: true }));
        try {
            const data = await projectService.kanban({ [`${columnKey}_page`]: nextPage });
            setKanbanData((prev) => ({
                ...prev,
                [columnKey]: {
                    ...prev[columnKey],
                    projects: [...(prev[columnKey]?.projects || []), ...data[columnKey].projects],
                    current_page: data[columnKey].current_page,
                    total_pages: data[columnKey].total_pages,
                },
            }));
            setPageNumbers((prev) => ({ ...prev, [`${columnKey}_page`]: nextPage }));
        } catch (error) {
            console.error(`Erro ao carregar mais ${columnKey}:`, error);
        } finally {
            setLoadingColumns((prev) => ({ ...prev, [columnKey]: false }));
        }
    };

    return (
        <PageContainer title="Kanban da Jornada do Cliente" description="Visualização Kanban dos Projetos">
            <JourneyKanban
                kanbanData={kanbanData}
                loadMore={loadMore}
                loadingColumns={loadingColumns}
            />
        </PageContainer>
    );
}