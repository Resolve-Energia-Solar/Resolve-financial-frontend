import TableSkeleton from "@/app/components/apps/comercial/sale/components/TableSkeleton";
import { TableBody as MuiBody, TableRow, TableCell } from "@mui/material";
import { IconEye } from "@tabler/icons-react";
import { useContext } from "react";
import { TableCtxt } from "./TableRoot";

export function TableBody({ loading, children}) {

    const { data, page, rowsPerPage } = useContext(TableCtxt);
    const slice = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
   
    // const filteredData = data.filter((row) => {
    //     const activeFilters = filters || {};

    //     return Object.keys(activeFilters).every((key) => {
    //         if (!filters[key]) return true;
    //         return row[key]?.toString().toLowerCase().includes(filters[key].toLowerCase());
    //     });
    // });

    if (loading) {
        return <TableSkeleton columns={8} rows={4} />;
    }

    return (
        <MuiBody>
            {slice.map((row) => (
                <TableCtxt.Provider key={row.id} value={{ ...useContext(TableCtxt), row }}>
                    <TableRow
                        // key={row.id}
                        sx={{ '&:hover': { backgroundColor: 'rgba(236, 242, 255, 0.35)' }, borderBottom: 'none' }}
                    >
                        {/* {children(row)}
                        <TableCell sx={{ textAlign: 'center' }}>
                            <IconEye size={20} color="#7E8388" />
                        </TableCell> */}
                        {children}
                    </TableRow>
                </TableCtxt.Provider>
            ))}
        </MuiBody>
        
    );

}