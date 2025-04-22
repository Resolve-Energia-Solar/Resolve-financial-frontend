import React from "react";
import { TableHead as MuiHead, TableRow } from "@mui/material";

export function TableHead({ children }) {
    return (
        <MuiHead>
            <TableRow>
                {/* {columns.map((column) => (
                    <TableCell key={column.field} sx={{ fontWeight: 600, fontSize: '14px', color: '#303030' }}>
                        {column.headerName}
                    </TableCell>
                ))} */}

                {children}
            </TableRow>
        </MuiHead>
    );
}