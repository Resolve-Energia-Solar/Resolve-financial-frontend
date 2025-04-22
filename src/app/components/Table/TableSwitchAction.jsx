import React, { useContext } from "react";
import { TableCell, Switch } from "@mui/material";
import { TableCtxt } from "./TableRoot";

export function TableSwitchAction({
    isSelected,
    onToggle,
    align = "center",
    sx,
  }) {
    const { row } = useContext(TableCtxt);
    const checked = isSelected(row);
  
    const handleChange = (_evt, next) => {
      onToggle(row, next);
    };
  
    return (
      <TableCell align={align} sx={{ ...sx }}>
        <Switch checked={checked} onChange={handleChange} />
      </TableCell>
    );
  }