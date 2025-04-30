import { TableRow } from "@mui/material";
import { TableBody } from "./TableBody";
import { TableCell } from "./TableCell";
import { TableEditAction } from "./TableEditAction";
import { TableHead } from "./TableHead";
import { TableHeader } from "./TableHeader";
import { TablePagination } from "./TablePagination";
import { TableRoot } from "./TableRoot";
import { TableSwitchAction } from "./TableSwitchAction";
import { TableViewAction } from "./TableViewAction";

export const Table = {
    Root: TableRoot,
    Header: TableHeader,
    Body: TableBody,
    Cell: TableCell,
    Pagination: TablePagination,
    Head: TableHead,
    EditAction: TableEditAction,
    ViewAction: TableViewAction,
    SwitchAction: TableSwitchAction,
    Row: TableRow,
};