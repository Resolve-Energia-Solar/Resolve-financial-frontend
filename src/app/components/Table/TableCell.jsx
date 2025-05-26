import React, { useContext } from 'react';
import { TableCell as MuiCell, useTheme } from '@mui/material';
import { TableCtxt } from './TableRoot';

export function TableCell({ field, render, align = 'left', sx, children, ...other }) {
    const { row } = useContext(TableCtxt);
    const theme = useTheme();

    const content = row
        ? (render ? render(row) : (row[field] ?? '-'))
        : children;

    return (
        <MuiCell
            align={align}
            sx={{
                fontWeight: 600,
                fontSize: '14px',
                color: theme.palette.primary.title,
                ...sx,
            }}
            {...other}
        >
            {content}
        </MuiCell>
    );
}
