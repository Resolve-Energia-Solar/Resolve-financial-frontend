import { useEffect, useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { useSnackbar } from "notistack";
import TableSkeleton from "../../../../comercial/sale/components/TableSkeleton";
import { formatDate } from "@/utils/dateUtils";
import { Table } from "@/app/components/Table";
import { TableHeader } from "@/app/components/TableHeader";
import financialRecordService from "@/services/financialRecordService";
import { Add } from "@mui/icons-material";
import { Box, Switch } from "@mui/material";

export default function FinancialRecordsTab({ projectId, viewOnly = false }) {
    const { enqueueSnackbar } = useSnackbar();
    const [financialRecords, setFinancialRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [lossesOnly, setLossesOnly] = useState(false);
    const router = useRouter();

    const getStatusLabel = (status) => {
        switch (status) {
            case 'S': return 'Solicitada';
            case 'E': return 'Em Andamento';
            case 'P': return 'Paga';
            case 'C': return 'Cancelada';
            default: return 'Desconhecido';
        }
    };

    const fetchFinancialRecords = useCallback(async () => {
        if (!projectId) return;
        setLoading(true);
        try {
            const response = await financialRecordService.index({
                fields: "id,protocol,due_date,client_supplier_name,value,status,lost_reason.name",
                expand: "lost_reason",
                project__in: projectId,
                category_name__icontains: lossesOnly ? 'Perdas' : null,
            });
            setFinancialRecords(response.results);
        } catch (error) {
            enqueueSnackbar(`Erro ao carregar Registros Financeiros: ${error.message}`, { variant: "error" });
        } finally {
            setLoading(false);
        }
    }, [projectId, lossesOnly, enqueueSnackbar]);

    useEffect(() => { fetchFinancialRecords(); }, [fetchFinancialRecords]);

    const handleRowClick = (row) => {
        router.push(`/apps/financial-record/${row.protocol}`);
    }

    if (loading) {
        return <TableSkeleton columns={8} rows={4} />;
    }

    const columns = [
        { field: 'protocol', headerName: 'Protocolo', render: r => r.protocol },
        { field: 'client_supplier_name', headerName: 'Beneficiário', render: r => r.client_supplier_name },
        { field: 'due_date', headerName: 'Data de Vencimento', render: r => formatDate(r.due_date) },
        { field: 'value', headerName: 'Valor', render: r => parseFloat(r.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
        { field: 'status', headerName: 'Status', render: r => getStatusLabel(r.status) },
        ...(lossesOnly ? [{ field: 'lost_reason', headerName: 'Motivo da Perda', render: r => (r.lost_reason?.name) }] : [])
    ];

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Switch
                    checked={lossesOnly}
                    onChange={() => {setLossesOnly(!lossesOnly);}}
                    color="primary"
                />
                <span>Exibir apenas Perdas</span>
            </Box>
            <TableHeader.Root>
                <TableHeader.Title
                    title="Total"
                    totalItems={financialRecords.length}
                    objNameNumberReference={financialRecords.length === 1 ? "Registro Financeiro" : "Registros Financeiros"}
                />
                {!viewOnly && <TableHeader.Button
                    buttonLabel="Adicionar Registro Financeiro"
                    icon={<Add />}
                    onButtonClick={() => router.push(`/apps/financial-record/create?project=${projectId}`)}
                    sx={{ width: 200 }}
                />}
            </TableHeader.Root>

            <Table.Root
                data={financialRecords}
                totalRows={financialRecords.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                onRowClick={handleRowClick}
            >
                <Table.Head columns={columns} />

                <Table.Body
                    loading={loading}
                    columns={columns.length}
                >
                    {columns.map(col => (
                        <Table.Cell
                            key={col.field}
                            render={col.render}
                            sx={{ cursor: 'pointer' }}
                        />
                    ))}
                </Table.Body>
            </Table.Root>
        </>
    );
}
