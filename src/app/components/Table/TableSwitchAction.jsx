import React, { useContext } from "react";
import { TableCell, Switch } from "@mui/material";
import { TableCtxt } from "./TableRoot";

export function TableSwitchAction({
    isSelected,
    onToggle,
    align = "center",
    sx,
    row: rowProp,
  }) {
    const context = useContext(TableCtxt);
    const row = rowProp || context?.row;
    
    if (!row) {
      console.warn("TableSwitchAction: row não está definida no contexto nem fornecida como prop");
      return <TableCell align={align} sx={{ ...sx }}></TableCell>;
    }
    
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