import { Box, Typography, MenuItem, Select } from "@mui/material";
import { ExpandMore } from "@mui/icons-material"; // Custom dropdown icon

const FilterSelect = ({ label, options, value, onChange }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography sx={{ color: "#7E8388", fontSize: "14px", fontWeight: 500 }}>
        {label}
      </Typography>
      <Select
        value={value}
        onChange={onChange}
        displayEmpty
        IconComponent={ExpandMore} 
        sx={{
          fontSize: "14px",
          color: "#7E8388",
          backgroundColor: "transparent",
          border: "none",
          "&:hover": { backgroundColor: "transparent" },
          "& .MuiOutlinedInput-notchedOutline": { border: "none" },
        }}
      >
        <MenuItem value="">Todos</MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default FilterSelect;
