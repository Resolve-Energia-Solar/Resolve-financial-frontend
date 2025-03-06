import { Box, MenuItem, Select } from "@mui/material";
import { ExpandMore } from "@mui/icons-material"; 

const FilterSelect = ({ label, options, value, onChange }) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      displayEmpty
      IconComponent={ExpandMore} 
      renderValue={(selected) => (selected ? options.find(opt => opt.value === selected)?.label : label)}
      sx={{
        fontSize: "12px",
        color: "#7E8388",
        backgroundColor: "transparent",
        border: "none",
        fontWeight: 500,
        "&:hover": { backgroundColor: "transparent" },
        "& .MuiOutlinedInput-notchedOutline": { border: "none" }, 
      }}
    >
      <MenuItem disabled>{label}</MenuItem> 
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default FilterSelect;
