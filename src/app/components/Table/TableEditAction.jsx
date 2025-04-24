import React, { useContext } from "react";
import { TableCell, IconButton } from "@mui/material";
import { IconPencil } from "@tabler/icons-react";
import { TableCtxt } from "./TableRoot";

export function TableEditAction({ onClick }) {
    const { row } = useContext(TableCtxt);

    return (
        <TableCell sx={{ textAlign: 'center' }}>
            <IconButton size="small" onClick={() => onClick(row)}>
                <IconPencil fontSize="small" color="#7E8388" />
            </IconButton>
        </TableCell>
    );
}