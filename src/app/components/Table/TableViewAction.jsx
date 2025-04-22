import React, { useContext } from "react";
import { TableCell, IconButton } from "@mui/material";
import { IconEye } from "@tabler/icons-react";
import { TableCtxt } from "./TableRoot";

export function TableViewAction({ onClick }) {
    const { row } = useContext(TableCtxt);
    
    return (
        <TableCell sx={{ textAlign: 'center' }}>
            <IconButton size="small" onClick={() => onClick(row)}>
                <IconEye fontSize="small" color="#7E8388" />
            </IconButton>
        </TableCell>
    );
}