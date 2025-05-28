import React from "react";
import { TableHead as MuiHead, TableRow, useTheme } from "@mui/material";
import { TableCell } from "./TableCell";

export function TableHead({ columns, ordering, onSort }) {
    const theme = useTheme();
    return (
        <MuiHead>
            <TableRow>
                {columns.map(col => (
                    <TableCell
                        key={col.field}
                        sortable={col.sortable}
                        onClick={() => col.sortable && onSort(col.field)}
                        isSorted={ordering === col.field}
                        isSortedDesc={ordering === `-${col.field}`}
                        sx={{ fontWeight: 600, fontSize: '14px', color: theme.palette.text.primary }}
                    >
                        {col.headerName}
                    </TableCell>
                ))}
            </TableRow>
        </MuiHead>
    );
}