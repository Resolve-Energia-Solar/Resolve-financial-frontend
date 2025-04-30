import { useContext } from "react";
import { TableCtxt } from "./TableRoot";
import { TableBody as MuiBody, TableRow } from "@mui/material";
import TableSkeleton from "@/app/components/apps/comercial/sale/components/TableSkeleton";

export function TableBody({ loading, children, onRowClick }) {
  const tableContext = useContext(TableCtxt);
  const { data, page, rowsPerPage } = tableContext;
  const slice = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) return <TableSkeleton columns={8} rows={4} />;

  return (
    <MuiBody>
      {slice.map((row) => (
        <TableCtxt.Provider key={row.id} value={{ ...tableContext, row }}>
          {typeof children === "function" ? children(row, onRowClick) : null}
        </TableCtxt.Provider>
      ))}
    </MuiBody>
  );
}
