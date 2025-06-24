"use client";
import { useEffect, useState } from "react";
import JourneyKanban from "@/app/components/apps/project/Costumer-journey/kanban/Kanban";
import projectService from "@/services/projectService";
import { useSnackbar } from "notistack";
import PageContainer from "@/app/components/container/PageContainer";
import { Box, TextField, Tooltip } from "@mui/material";

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
    const { enqueueSnackbar } = useSnackbar();
    const [filters, setFilters] = useState({ q: '' });
    const [loading, setLoading] = useState(false);

    // Carrega a primeira página de todas as colunas
    useEffect(() => {
        setLoading(true);
        projectService.kanban({ ...pageNumbers, ...filters })
            .then((data) => {
                setKanbanData(data);
            })
            .catch((error) => {
                console.error("Erro ao carregar dados do kanban:", error);
                enqueueSnackbar("Erro ao carregar dados do kanban", { variant: "error" });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [filters, enqueueSnackbar]);

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

    const [debouncedSearch] = useState(() => {
        const debounce = (fn, delay) => {
            let timeoutId;
            return function (...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => fn.apply(this, args), delay);
            };
        };

        return debounce((value) => {
            setFilters(prev => ({ ...prev, q: value }));
        }, 1000);
    });

    return (
        <PageContainer title="Kanban da Jornada do Cliente" description="Visualização Kanban dos Projetos">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', marginBottom: 2, marginTop: 2 }}>
                <Tooltip title={
                    <div>
                        Pesquise por:
                        <ul>
                            <li>Número do Projeto</li>
                            <li>Projetista (Nome, CPF/CNPJ, Email)</li>
                            <li>Homologador (Nome, CPF/CNPJ, Email)</li>
                            <li>Número do Contrato</li>
                            <li>Cliente (Nome, CPF/CNPJ, Email)</li>
                            <li>Vendedor (Nome, CPF/CNPJ, Email)</li>
                            <li>Supervisor de Vendas (Nome, CPF/CNPJ, Email)</li>
                            <li>Gerente de Vendas (Nome, CPF/CNPJ, Email)</li>
                            <li>Fornecedor (Nome, CPF/CNPJ, Email)</li>
                        </ul>
                    </div>
                } arrow>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Pesquisar..."
                        onChange={(e) => debouncedSearch(e.target.value)}
                        sx={{
                            marginRight: 2,
                            width: 300,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 4,
                                borderColor: 'primary.main',
                                boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`,
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                },
                                '&.Mui-focused': {
                                    boxShadow: (theme) => `0 0 0 2px ${theme.palette.secondary.main}`,
                                },
                            },
                        }}
                    />
                </Tooltip>
            </Box>
            <JourneyKanban
                kanbanData={kanbanData}
                loadMore={loadMore}
                loadingColumns={loadingColumns}
                loading={loading}
            />
        </PageContainer>
    );
}