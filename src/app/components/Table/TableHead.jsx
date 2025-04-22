import { TableHead, TableBody as TableRow } from "@mui/material";

export function TableHead({ children }) {
    return (
        <TableHead>
            <TableRow>
                {/* {columns.map((column) => (
                    <TableCell key={column.field} sx={{ fontWeight: 600, fontSize: '14px', color: '#303030' }}>
                        {column.headerName}
                    </TableCell>
                ))} */}

                {children}
            </TableRow>
        </TableHead>
    );
}