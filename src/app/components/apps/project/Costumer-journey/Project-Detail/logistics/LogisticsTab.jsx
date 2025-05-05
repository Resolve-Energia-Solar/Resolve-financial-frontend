import { useEffect, useState, useCallback } from "react";
import { useSnackbar } from "notistack";
import scheduleService from "@/services/scheduleService";
import TableSkeleton from "../../../../comercial/sale/components/TableSkeleton";
import ScheduleFromProjectForm from "../../../modal/ScheduleFromProjectForm";
import UserCard from "../../../../users/userCard";
import { formatDate } from "@/utils/dateUtils";
import ScheduleOpinionChip from "../../../../inspections/schedule/StatusChip/ScheduleOpinionChip";
import { Table } from "@/app/components/Table";
import { Chip, Dialog, DialogContent } from "@mui/material";
import { TableHeader } from "@/app/components/TableHeader";
import categoryService from "@/services/categoryService";
import DetailsDrawer from "@/app/components/apps/schedule/DetailsDrawer";
import purchaseService from "@/services/purchaseService";
import PurchaseForm from "./PurchaseForm";

export default function LogisticsTab({ projectId }) {
    const { enqueueSnackbar } = useSnackbar()
    const [deliveries, setDeliveries] = useState([])
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [categoryId, setCategoryId] = useState(null);
    const [selectedDelivery, setSelectedDelivery] = useState(null);

    const [openDeliveryFormModal, setOpenDeliveryFormModal] = useState(false);
    const [openViewDelivery, setOpenViewDelivery] = useState(false);
    const [openPurchaseFormModal, setOpenPurchaseFormModal] = useState(false);
    // const [openViewPurchase, setOpenViewPurchase] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);

    const fetchDeliveries = useCallback(async () => {
        if (projectId) {
            const fetchDeliveries = async () => {
                setLoading(true);
                try {
                    const response = await scheduleService.index(
                        {
                            fields: "id,address.complete_address,products.description,scheduled_agent,schedule_date,completed_date,final_service_opinion.name,project.inspection,project.product.description,service.name",
                            expand: "address,products,scheduled_agent,final_service_opinion,project,project.product,service",
                            project__in: projectId,
                            category__icontains: 'Entrega'
                        }
                    );
                    setDeliveries(response.results);
                } catch (error) {
                    enqueueSnackbar(`Erro ao carregar entregas: ${error.message}`, { variant: "error" });
                } finally {
                    setLoading(false);
                }
            }
            fetchDeliveries();
        }
        setLoading(false);
    }, [projectId, enqueueSnackbar]);


    useEffect(() => {
        fetchDeliveries();
    }, [projectId, fetchDeliveries]);

    useEffect(() => {
        const fetchCategory = async () => {
            const response = await categoryService.index({ name__in: 'Entrega' });
            if (response.results.length > 0) {
                setCategoryId(response.results[0].id);
            }
        }
        fetchCategory();
    }, []);

    const handleDeliveryFormSuccess = async () => {
        setOpenDeliveryFormModal(false);
        setSelectedDelivery(null);
        await fetchDeliveries();
    };

    const products = deliveries.map(i => i.project.products).flat();

    const deliveriesColumns = [
        { field: 'service', headerName: 'Serviço', render: r => r.service.name },
        { field: 'address', headerName: 'Endereço', render: r => r.address.complete_address },
        { field: 'schedule_date', headerName: 'Agendada', render: r => new Date(r.schedule_date).toLocaleDateString() },
        { field: 'products', headerName: 'Produto', render: r => r.products.map(p => p.description).join(', ') },
        { field: 'scheduled_agent', headerName: 'Fornecedor', render: r => r.scheduled_agent?.name },
        { field: 'final_service_opinion', headerName: 'Status', render: r => r.final_service_opinion?.name },
    ]

    const fetchPurchases = useCallback(async () => {
        if (projectId) {
            setLoading(true);
            try {
                const response = await purchaseService.index(
                    {
                        fields: "id,purchase_date,status,delivery_number,project,supplier.complete_name,project.product.description,delivery_type",
                        expand: "supplier,project.product",
                        project__in: projectId,
                    }
                );
                setPurchases(response.results);
            } catch (error) {
                enqueueSnackbar(`Erro ao carregar compras: ${error.message}`, { variant: "error" });
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [projectId, enqueueSnackbar]);

    useEffect(() => {
        fetchPurchases();
    }, [projectId, fetchPurchases]);

    const handlePurchaseFormSuccess = async () => {
        setOpenPurchaseFormModal(false);
        setSelectedPurchase(null);
        await fetchPurchases();
    };

    if (loading) {
        return <TableSkeleton columns={8} rows={4} />;
    }

    const purchasesColumns = [
        { field: 'purchase_date', headerName: 'Data da Compra', render: r => new Date(r.purchase_date).toLocaleDateString() },
        { field: 'status', headerName: 'Status', render: r => r.status },
        { field: 'delivery_number', headerName: 'Nº de Entrega', render: r => r.delivery_number },
        { field: 'supplier', headerName: 'Fornecedor', render: r => r.supplier.complete_name },
        { field: 'product', headerName: 'Produto', render: r => r.project?.product?.description },
        { field: 'delivery_type', headerName: 'Tipo de Entrega', render: r => r.delivery_type },
    ]

    return (
        <>
            {/* Entregas */}
            <TableHeader.Root>
                <TableHeader.Title
                    title="Total de Entregas"
                    totalItems={deliveries.length}
                />
                <TableHeader.Button
                    buttonLabel="Adicionar entrega"
                    onButtonClick={() => setOpenDeliveryFormModal(true)}
                    sx={{
                        width: 200,
                    }}
                />
            </TableHeader.Root>

            <Table.Root
                data={deliveries}
                totalRows={deliveries.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
            >
                <Table.Head>
                    {deliveriesColumns.map(c => (
                        <Table.Cell
                            key={c.field}
                            sx={{ fontWeight: 600, fontSize: '14px' }}
                        >
                            {c.headerName}
                        </Table.Cell>
                    ))}
                    <Table.Cell align="center">Editar</Table.Cell>
                    <Table.Cell align="center">Ver</Table.Cell>
                </Table.Head>

                <Table.Body loading={loading}>
                    <Table.Cell
                        render={row => row.service?.name}
                        sx={{ opacity: 0.7 }}
                    />
                    <Table.Cell
                        render={row => row.address?.complete_address}
                        sx={{ opacity: 0.7 }}
                    />
                    <Table.Cell render={row =>
                        formatDate(row.schedule_date)}
                        sx={{ opacity: 0.7 }}
                    />
                    <Table.Cell render={row =>
                        row.products?.length > 0
                            ? row.products[0].description
                            : row.project?.product?.description}
                        sx={{ opacity: 0.7 }}
                    />
                    <Table.Cell render={row =>
                        row.scheduled_agent
                            ? <UserCard userId={row.scheduled_agent} />
                            : "Sem agente"}
                        sx={{ opacity: 0.7 }}
                    />
                    <Table.Cell render={row => <ScheduleOpinionChip status={row.final_service_opinion?.name} />}
                        sx={{ opacity: 0.7 }}
                    />

                    <Table.EditAction onClick={row => { setSelectedDelivery(row.id); setOpenDeliveryFormModal(true); }} />
                    <Table.ViewAction onClick={row => { setSelectedDelivery(row.id); setOpenViewDelivery(true) }} />
                </Table.Body>
            </Table.Root>

            <Dialog
                open={openDeliveryFormModal}
                onClose={() => {
                    setOpenDeliveryFormModal(false);
                    setSelectedDelivery(null);
                }}
            >
                <DialogContent>
                    <ScheduleFromProjectForm
                        projectId={projectId}
                        scheduleId={selectedDelivery || null}
                        categoryId={categoryId}
                        useSupplier={true}
                        onSave={handleDeliveryFormSuccess}
                    />
                </DialogContent>
            </Dialog>

            <DetailsDrawer dialogMode={true} scheduleId={selectedDelivery} open={openViewDelivery} onClose={() => setOpenViewDelivery(false)} />

            {/* Compras */}
            <TableHeader.Root>
                <TableHeader.Title
                    title="Total de Compras"
                    totalItems={products.length}
                />
                <TableHeader.Button
                    buttonLabel="Adicionar compra"
                    onButtonClick={() => {
                        setOpenPurchaseFormModal(true);
                        setSelectedPurchase(null);
                    }}
                    sx={{ width: 200 }}
                />
            </TableHeader.Root>

            <Table.Root
                data={purchases}
                totalRows={purchases.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
            >
                <Table.Head>
                    {purchasesColumns.map(c => (
                        <Table.Cell
                            key={c.field}
                            sx={{ fontWeight: 600, fontSize: '14px' }}
                        >
                            {c.headerName}
                        </Table.Cell>
                    ))}
                    <Table.Cell align="center">Editar</Table.Cell>
                    {/* <Table.Cell align="center">Ver</Table.Cell> */}
                </Table.Head>

                <Table.Body loading={loading}>
                    <Table.Cell
                        render={row => formatDate(row.purchase_date)}
                        sx={{ opacity: 0.7 }}
                    />
                    <Table.Cell
                        render={row => {
                            const statusMap = {
                                'R': { label: 'Compra realizada', color: 'success' },
                                'C': { label: 'Cancelada', color: 'error' },
                                'D': { label: 'Distrato', color: 'error' },
                                'A': { label: 'Aguardando pagamento', color: 'info' },
                                'P': { label: 'Pendente', color: 'warning' }
                            };
                            const statusInfo = statusMap[row.status] || { label: row.status, color: 'default' };
                            return <Chip label={statusInfo.label} color={statusInfo.color} />;
                        }}
                        sx={{ opacity: 0.7 }}
                    />
                    <Table.Cell render={row =>
                        row.delivery_number || '-'}
                        sx={{ opacity: 0.7 }}
                    />
                    <Table.Cell render={row =>
                        row.supplier?.complete_name}
                        sx={{ opacity: 0.7 }}
                    />
                    <Table.Cell render={row =>
                        row.project?.product?.description}
                        sx={{ opacity: 0.7 }}
                    />
                    <Table.Cell render={row => {
                            const deliveryTypeMap = {
                                'D': 'Entrega Direta',
                                'C': 'Entrega CD'
                            };
                            return deliveryTypeMap[row.delivery_type] || row.delivery_type || '-';
                        }}
                        sx={{ opacity: 0.7 }}
                    />

                    <Table.EditAction onClick={row => { setSelectedPurchase(row.id); setOpenPurchaseFormModal(true);}} />
                    {/* <Table.ViewAction onClick={row => { setSelectedPurchase(row.id); setOpenViewPurchase(true) }} /> */}
                </Table.Body>
            </Table.Root>

            <Dialog
                open={openPurchaseFormModal}
                onClose={() => {
                    setOpenPurchaseFormModal(false);
                    setSelectedPurchase(null);
                }}
            >
                <DialogContent>
                    <PurchaseForm
                        purchaseId={selectedPurchase}
                        projectId={projectId}
                        onSave={handlePurchaseFormSuccess}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
