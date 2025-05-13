import { useState, useEffect } from 'react'
import { Table } from "@/app/components/Table";
import { TableHeader } from "@/app/components/TableHeader";
import { Add } from "@mui/icons-material";
import userService from '@/services/userService';

export default function UserAddressesTable({
    userId = null,
    addresses: propAddresses = [],
    onChange,
}) {
    const [addresses, setAddresses] = useState(propAddresses)
    const [totalRows, setTotalRows] = useState(propAddresses.length)

    useEffect(() => {
        if (userId) {
            // busca endereços do usuário existente
            userService
                .find(userId, { expand: 'addresses', fields: 'addresses' })
                .then((res) => {
                    const list = res.addresses || []
                    setAddresses(list)
                    setTotalRows(list.length)
                })
        } else {
            // novo usuário: usa os dados vindos do form
            setAddresses(propAddresses)
            setTotalRows(propAddresses.length)
        }
    }, [userId, propAddresses])

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
                {/* <TableHeader.Button
                    buttonLabel="Adicionar endereço"
                    icon={<Add />}
                    onButtonClick={userId ? () => { } : handleAdd}
                    sx={{ width: 200 }}
                /> */}
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
                <Table.Body>
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
        </>
    );
}
