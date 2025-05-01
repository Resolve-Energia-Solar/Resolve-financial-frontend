import { useContext } from "react";
import { TableCtxt } from "./TableRoot";
import {
  TableBody as MuiBody,
  TableRow,
  TableCell,
  useTheme,
} from "@mui/material";
import TableSkeleton from "@/app/components/apps/comercial/sale/components/TableSkeleton";

export function TableBody({ loading, children }) {
  const theme = useTheme();
  const { data, page, rowsPerPage, onRowClick } = useContext(TableCtxt);
  const slice = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return <TableSkeleton columns={8} rows={4} />;
  }

  return (
    <MuiBody>
      {slice.length === 0 ? (
        <TableRow>
          <TableCell colSpan={8} align="center">
            Nenhum registro
          </TableCell>
        </TableRow>
      ) : (
        slice.map((row) => (
          <TableCtxt.Provider
            key={row.id}
            value={{ ...useContext(TableCtxt), row }}
          >
            <TableRow
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: theme.palette.primary.light },
              }}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {children}
            </TableRow>
          </TableCtxt.Provider>
        ))
      )}
    </MuiBody>
  );
}
