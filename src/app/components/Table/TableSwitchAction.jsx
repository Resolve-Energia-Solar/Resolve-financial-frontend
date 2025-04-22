import React, { useContext } from "react";
import { TableCell, Switch } from "@mui/material";
import { TableCtxt } from "./TableRoot";

export function TableSwitchAction({ selectedId, onSelect }) {
    const { row } = useContext(TableCtxt);

    return (
        <TableCell sx={{ textAlign: 'center' }}>
            <Switch 
                checked={row.id === selectedId}
                onChange={() => onSelect(row.id)}
                color="primary"
            />
        </TableCell>
    );
}