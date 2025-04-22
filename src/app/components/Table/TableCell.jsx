import React, { useContext } from "react";
import { TableCell as MuiCell } from "@mui/material";
import { TableCtxt } from "./TableRoot";

export function TableCell({ field, render, align = 'left', sx, children }) {
    const { row } = useContext(TableCtxt);
    const content = row
        ? (render ? render(row) : (row[field] ?? "-"))
        : children;

    return (
        <MuiCell>
            {content}
        </MuiCell>
    );
}     