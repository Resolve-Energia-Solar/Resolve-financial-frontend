import { useEffect, useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { useSnackbar } from "notistack";
import TableSkeleton from "../../../../comercial/sale/components/TableSkeleton";
import { formatDate } from "@/utils/dateUtils";
import { Table } from "@/app/components/Table";
import { TableHeader } from "@/app/components/TableHeader";
import financialRecordService from "@/services/financialRecordService";

export default function LossesTab({ projectId }) {
    const { enqueueSnackbar } = useSnackbar();
    const [losses, setLosses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
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

    const fetchLosses = useCallback(async () => {
        if (!projectId) return;
        setLoading(true);
        try {
            const response = await financialRecordService.index({
                fields: "id,protocol,due_date,client_supplier_name,value,status,lost_reason.name",
                expand: "lost_reason",
                category_name__icontains: 'Perdas',
                project__in: projectId
            });
            setLosses(response.results);
        } catch (error) {
            enqueueSnackbar(`Erro ao carregar Perdas: ${error.message}`, { variant: "error" });
        } finally {
            setLoading(false);
        }
    }, [projectId, enqueueSnackbar]);

    useEffect(() => { fetchLosses(); }, [fetchLosses]);

    if (loading) {
        return <TableSkeleton columns={8} rows={4} />;
    }

    const columns = [
        { field: 'protocol', headerName: 'Protocolo', render: r => r.protocol },
        { field: 'client_supplier_name', headerName: 'Beneficiário', render: r => r.client_supplier_name },
        { field: 'due_date', headerName: 'Data de Vencimento', render: r => formatDate(r.due_date) },
        { field: 'value', headerName: 'Valor', render: r => parseFloat(r.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
        { field: 'status', headerName: 'Status', render: r => getStatusLabel(r.status) },
        { field: 'lost_reason', headerName: 'Motivo da Perda', render: r => (r.lost_reason?.name) }
    ];

    return (
        <>
            <TableHeader.Root>
                <TableHeader.Title
                    title="Total"
                    totalItems={losses.length}
                    objNameNumberReference={losses.length === 1 ? "Perda" : "Perdas"}
                />
                <TableHeader.Button
                    buttonLabel="Adicionar Perda"
                    onButtonClick={() => router.push(`/apps/financial-record/create?project=${projectId}`)}
                    sx={{ width: 200 }}
                />
            </TableHeader.Root>

            <Table.Root
                data={losses}
                totalRows={losses.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
            >
                <Table.Head>
                    {columns.map(c => (
                        <Table.Cell key={c.field} sx={{ fontWeight: 600, fontSize: '14px' }}>
                            {c.headerName}
                        </Table.Cell>
                    ))}
                    <Table.Cell align="center">Ver</Table.Cell>
                </Table.Head>

                <Table.Body loading={loading}>
                    <Table.Cell render={row => row.protocol} sx={{ opacity: 0.7 }} />
                    <Table.Cell render={row => row.client_supplier_name} sx={{ opacity: 0.7 }} />
                    <Table.Cell render={row => formatDate(row.due_date)} sx={{ opacity: 0.7 }} />
                    <Table.Cell render={row => parseFloat(row.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sx={{ opacity: 0.7 }} />
                    <Table.Cell render={row => getStatusLabel(row.status)} sx={{ opacity: 0.7 }} />
                    <Table.Cell render={row => row.lost_reason?.name || '-'} sx={{ opacity: 0.7 }} />
                    <Table.ViewAction onClick={row => router.push(`/apps/financial-record/${row.protocol}`)} />
                </Table.Body>
            </Table.Root>
        </>
    );
}
