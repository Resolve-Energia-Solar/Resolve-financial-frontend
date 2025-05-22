import { useState, useEffect } from 'react'
import { Table } from "@/app/components/Table";
import { TableHeader } from "@/app/components/TableHeader";
import { Add } from "@mui/icons-material";
import userService from '@/services/userService';
import CreateAddressPage from "../../address/Add-address";
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

export default function UserAddressesTable({
    userId = null,
    addresses: propAddresses = [],
    onChange,
    viewOnly = false,
}) {
    const [addresses, setAddresses] = useState(propAddresses)
    const [totalRows, setTotalRows] = useState(propAddresses.length)
    const [openAdd, setOpenAdd] = useState(false);

    useEffect(() => {
        if (!userId) {
            setAddresses(propAddresses);
            setTotalRows(propAddresses.length);
            return;
        }
        let mounted = true;
        (async () => {
            try {
                const res = await userService.find(userId, {
                    expand: 'addresses',
                    fields: 'addresses'
                });
                if (!mounted) return;
                const list = res.addresses || [];
                setAddresses(list);
                setTotalRows(list.length);
            } catch (e) {
                console.error(e);
            }
        })();
        return () => { mounted = false };
    }, [userId]);

    const handleAdd = () => {
        const novo = {
            id: Date.now(),
            complete_address: '',
            zip_code: '',
            country: '',
            state: '',
            city: '',
            neighborhood: '',
            street: '',
            number: '',
            complement: '',
            latitude: null,
            longitude: null,
            is_deleted: false,
        }
        const updated = [...addresses, novo]
        setAddresses(updated)
        setTotalRows(updated.length)
        onChange(updated)
    }

    const handleFieldChange = (row, field, value) => {
        const updated = addresses.map((addr) =>
            addr.id === row.id ? { ...addr, [field]: value } : addr
        )
        setAddresses(updated)
        onChange(updated)
    }

    const handleRemove = (row) => {
        const updated = addresses.filter(addr => addr.id !== row.id)
        setAddresses(updated)
        setTotalRows(updated.length)
        onChange(updated)
    }

    const columns = [
        { field: 'complete_address', headerName: 'Endereço Completo', render: (r) => r.complete_address },
        { field: 'zip_code', headerName: 'CEP', render: (r) => r.zip_code },
        { field: 'city', headerName: 'Cidade', render: (r) => r.city },
        { field: 'state', headerName: 'UF', render: (r) => r.state },
        { field: 'street', headerName: 'Rua', render: (r) => r.street },
        { field: 'number', headerName: 'Número', render: (r) => r.number },
    ];

    return (
        <>
            <TableHeader.Root>
                <TableHeader.Title
                    title="Total"
                    totalItems={totalRows}
                    objNameNumberReference={totalRows === 1 ? "Endereço" : "Endereços"}
                />
                {!viewOnly && <TableHeader.Button
                    buttonLabel="Adicionar endereço"
                    icon={<Add />}
                    onButtonClick={() => setOpenAdd(true)}
                    sx={{ width: 200 }}
                />}
            </TableHeader.Root>

            <Table.Root
                data={addresses}
                totalRows={totalRows}
                noWrap={true}
            >
                <Table.Head>
                    {columns.map(c => (
                        <Table.Cell
                            key={c.field}
                            sx={{ fontWeight: 600, fontSize: '14px' }}
                        >
                            {c.headerName}
                        </Table.Cell>
                    ))}
                </Table.Head>
                <Table.Body columns={columns.length}>
                    {columns.map(c => (
                        <Table.Cell
                            key={c.field}
                            field={c.field}
                            render={c.render}
                            sx={{ fontWeight: 600, fontSize: '14px' }}
                        />
                    ))}
                </Table.Body>
            </Table.Root>

            <Dialog
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Adicionar Endereço</DialogTitle>
                <DialogContent>
                    <CreateAddressPage
                        userId={userId}
                        onClose={() => setOpenAdd(false)}
                        onAdd={(newAddr) => {
                            const updated = [...addresses, newAddr];
                            setAddresses(updated);
                            setTotalRows(updated.length);
                            onChange(updated);
                        }}
                    />
                </DialogContent>
            </Dialog >
        </>
    );
}
