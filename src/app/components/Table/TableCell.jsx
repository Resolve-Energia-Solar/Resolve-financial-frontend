import React, { useContext } from "react";
import { TableCell as MuiCell } from "@mui/material";
import { TableCtxt } from "./TableRoot";

export function TableCell({ field, render, align = 'left' }) {
    const row = useContext(TableCtxt);

    return (
        <MuiCell>
            {render ? render(row) : row[field] ?? '-'}
        </MuiCell>
    );
}     