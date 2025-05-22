import { useState, useEffect, useCallback } from "react";
import { Table } from "@/app/components/Table";
import { TableHeader } from "@/app/components/TableHeader";
import { Add } from "@mui/icons-material";
import phoneNumberService from "@/services/phoneNumberService";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import CreatePhonePage from "../../phone/Add-phone";

export default function UserPhoneNumbersTable({
    userId = null,
    phoneNumbers: propPhones = [],
    onChange,
    viewOnly = false,
}) {
    const [phones, setPhones] = useState(propPhones);
    const [phoneNumbersCount, setPhoneNumbersCount] = useState(0);
    const [openAdd, setOpenAdd] = useState(false);

    const fetchPhoneNumbers = useCallback(async () => {
        if (!userId) {
            setPhones(propPhones);
            setPhoneNumbersCount(propPhones.length);
            return;
        }
        let mounted = true;
        (async () => {
            try {
                const resp = await phoneNumberService.index({
                    user: userId,
                    fields: 'id,country_code,area_code,phone_number,is_main'
                });
                if (!mounted) return;
                setPhones(resp.results);
                setPhoneNumbersCount(resp.meta.pagination.total_count);
            } catch (e) {
                console.error(e);
            }
        })();
        return () => { mounted = false };
    }, [userId]);

    useEffect(() => {
        fetchPhoneNumbers();
    }, [fetchPhoneNumbers]);

    const handleSwitchToggle = (row, newState) => {
        const updated = phones.map(pn =>
            pn.id === row.id ? { ...pn, is_main: newState } : { ...pn, is_main: false }
        );
        setPhones(updated);
        onChange(updated);
        if (userId) {
            phoneNumberService.update(row.id, { is_main: newState });
            fetchPhoneNumbers();
        }
    };

    const handleAdd = () => {
        const novo = { id: Date.now(), country_code: '', area_code: '', phone_number: '', is_main: false };
        const updated = [...phones, novo];
        setPhones(updated);
        onChange(updated);
        setPhoneNumbersCount(updated.length);
    };

    const handleCloseModal = () => {
        setOpenAdd(false);
        setPhones(phones.filter(p => p.id !== undefined));
        setPhoneNumbersCount(phones.length);
        onChange(phones);
        if (userId) {
            fetchPhoneNumbers();
        }
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
                {!viewOnly && <TableHeader.Button
                    buttonLabel="Adicionar telefone"
                    icon={<Add />}
                    onButtonClick={() => setOpenAdd(true)}
                    sx={{ width: 200 }}
                />}
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
                <DialogTitle>Adicionar Telefone</DialogTitle>
                <DialogContent>
                    <CreatePhonePage
                        userId={userId}
                        onClosedModal={handleCloseModal}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}