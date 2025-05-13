import { useState, useEffect } from "react";
import { Table } from "@/app/components/Table";
import { TableHeader } from "@/app/components/TableHeader";
import { Add } from "@mui/icons-material";
import phoneNumberService from "@/services/phoneNumberService";

export default function UserPhoneNumbersTable({
    userId = null,
    phoneNumbers: propPhones = [],
    onChange,
}) {
    const [phones, setPhones] = useState(propPhones);
    const [phoneNumbersCount, setPhoneNumbersCount] = useState(0);

    useEffect(() => {
        if (userId) {
            const fetchPhoneNumbers = async () => {
                try {
                    const response = await phoneNumberService.index({
                        user: userId,
                        fields: 'id,country_code,area_code,phone_number,is_main'
                    });
                    setPhones(response.results);
                    setPhoneNumbersCount(response.meta.pagination.total_count);
                } catch (error) {
                    console.error("Error fetching phone numbers:", error);
                }
            };

            fetchPhoneNumbers();
        } else {
            setPhones(propPhones);
            setPhoneNumbersCount(propPhones.length);
        }
    }, [userId, propPhones]);


    const handleSwitchToggle = (row, newState) => {
        const updated = phones.map(pn =>
            pn.id === row.id ? { ...pn, is_main: newState } : { ...pn, is_main: false }
        );
        setPhones(updated);
        onChange(updated);
    };

    const handleAdd = () => {
        const novo = { id: Date.now(), country_code: '', area_code: '', phone_number: '', is_main: false };
        const updated = [...phones, novo];
        setPhones(updated);
        onChange(updated);
        setPhoneNumbersCount(updated.length);
    };

    const columns = [
        { field: 'country_code', headerName: 'Cód. País', render: (r) => r.country_code },
        { field: 'area_code', headerName: 'DDD', render: (r) => r.area_code },
        { field: 'phone_number', headerName: 'Número', render: (r) => r.phone_number },
        {
            field: 'is_main', headerName: 'Principal', render: (r) => {
                return (
                    <Table.SwitchAction row={r} isSelected={i => i.is_main} onToggle={handleSwitchToggle} label="Principal" />
                );
            }
        },
    ];

    return (
        <>
            <TableHeader.Root>
                <TableHeader.Title
                    title="Total"
                    totalItems={phoneNumbersCount}
                    objNameNumberReference={phoneNumbersCount === 1 ? "Telefone" : "Telefones"}
                />
                {/* <TableHeader.Button
                    buttonLabel="Adicionar telefone"
                    icon={<Add />}
                    onButtonClick={userId ? () => { } : handleAdd}
                    sx={{ width: 200 }}
                /> */}
            </TableHeader.Root>

            <Table.Root
                data={phones}
                totalRows={phoneNumbersCount}
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