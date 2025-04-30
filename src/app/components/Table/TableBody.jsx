import TableSkeleton from "@/app/components/apps/comercial/sale/components/TableSkeleton";
import { TableBody as MuiBody, TableRow, TableCell } from "@mui/material";
import { IconEye } from "@tabler/icons-react";
import { useContext } from "react";
import { TableCtxt } from "./TableRoot";

export function TableBody({ loading, children }) {

    const { data, page, rowsPerPage } = useContext(TableCtxt);
    const slice = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const onRowClick = useContext(TableCtxt).onRowClick;

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
                        onClick={() => onRowClick && onRowClick(row)}
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

        // <Grid item xs={12}>
        //     <TableContainer sx={{ borderRadius: '12px' }}>
        //         <Table sx={{ borderCollapse: 'separate', borderSpacing: '0px 8px' }}>
        //             <TableHead>
        //                 <TableRow>
        //                     {columns.map((column) => (
        //                         <TableCell key={column.field} sx={{ fontWeight: 600, fontSize: '14px', color: '#303030' }}>
        //                             {column.headerName}
        //                         </TableCell>
        //                     ))}
        //                     <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#303030', textAlign: 'center' }}>
        //                         Editar
        //                     </TableCell>
        //                     <TableCell sx={{ fontWeight: 600, fontSize: '14px', color: '#303030', textAlign: 'center' }}>
        //                         Ver
        //                     </TableCell>
        //                 </TableRow>
        //             </TableHead>

        //             {loading ? (
        //                 <TableSkeleton rows={rowsPerPage} columns={columns.length} />
        //             ) : (
        //                 <TableBody>
        //                     {data.length > 0 ? (
        //                         data.map((row) => (
        //                             <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: 'rgba(236, 242, 255, 0.35)' }, borderBottom: 'none' }}>
        //                                 {columns.map((column) => (
        //                                     <TableCell key={column.field} sx={{ fontWeight: column.field === 'name' ? 600 : 400, fontSize: '14px', color: '#7E8388' }}>
        //                                         {column.render ? column.render(row) : row[column.field] || '-'}
        //                                     </TableCell>
        //                                 ))}

        //                                 <TableCell sx={{ textAlign: 'center' }}>
        //                                     {actions?.edit && (
        //                                         <IconButton
        //                                             size="small"
        //                                             onClick={() => actions.edit(row)}
        //                                             sx={{ color: '#7E8388' }}
        //                                         >
        //                                             <IconPencil fontSize="small" />
        //                                         </IconButton>
        //                                     )}
        //                                 </TableCell>

        //                                 <TableCell sx={{ textAlign: 'center' }}>
        //                                     {actions?.view && (
        //                                         <IconButton
        //                                             size="small"
        //                                             onClick={() => actions.view(row)}
        //                                             sx={{ color: '#7E8388' }}
        //                                         >
        //                                             <IconEye fontSize="small" />
        //                                         </IconButton>
        //                                     )}
        //                                 </TableCell>

        //                             </TableRow>
        //                         ))
        //                     ) : (
        //                         <TableRow>
        //                             <TableCell colSpan={columns.length} align="center" sx={{ borderBottom: 'none', justifyContent: 'center' }}>
        //                                 <Typography variant="body2" color="textSecondary" sx={{ py: 2, alignItems: 'center' }}>
        //                                     Nenhuma informação encontrada.
        //                                 </Typography>
        //                             </TableCell>
        //                         </TableRow>
        //                     )}
        //                 </TableBody>
        //             )}
        //         </Table>


        //         {data.length >= 5 && (
        //             <TablePagination
        //                 rowsPerPageOptions={[5, 10, 25]}
        //                 component="div"
        //                 count={totalRows}
        //                 rowsPerPage={rowsPerPage}
        //                 page={page}
        //                 onPageChange={(_, newPage) => onPageChange(newPage)}
        //                 onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
        //                 labelRowsPerPage="Linhas por página"
        //                 sx={{
        //                     '& .Mui-selected': {
        //                         backgroundColor: '#FFCC00 !important',
        //                         color: '#7E8388',
        //                         borderRadius: '6px',
        //                     },
        //                 }}
        //             />
        //         )}

        //     </TableContainer>
        // </Grid>

    );

}