import React, { useState } from "react";
import { Box, Button, Grid, Typography, Dialog } from "@mui/material";
import { ChromePicker } from "react-color";

const ColorPicker = ({ value = "#FFFFFF", onChange }) => {
  const predefinedColors = [
    "#FF5733", // Vermelho
    "#33FF57", // Verde
    "#3357FF", // Azul
    "#F1C40F", // Amarelo
    "#9B59B6", // Roxo
  ];

  const [selectedColor, setSelectedColor] = useState(value); // Inicializa com `value`
  const [customColor, setCustomColor] = useState(value); // Inicializa com `value`
  const [openPicker, setOpenPicker] = useState(false);

  const handlePredefinedColorClick = (color) => {
    setSelectedColor(color);
    if (onChange) onChange(color); // Dispara callback
  };

  const handleCustomColorChange = (color) => {
    setCustomColor(color.hex);
    setSelectedColor(color.hex);
    if (onChange) onChange(color.hex); // Dispara callback
  };

  const handleOpenPicker = () => {
    setOpenPicker(true);
  };

  const handleClosePicker = () => {
    setOpenPicker(false);
  };

  return (
    <Box sx={{ padding: 0 }}>
      <Grid container spacing={2}>
        {predefinedColors.map((color) => (
          <Grid item key={color}>
            <Button
              onClick={() => handlePredefinedColorClick(color)}
              sx={{
                width: 40,
                height: 40,
                backgroundColor: color,
                border: selectedColor === color ? "2px solid black" : "none",
                borderRadius: "50%",
                minWidth: 0,
              }}
            />
          </Grid>
        ))}
        <Grid item>
          <Button
            onClick={handleOpenPicker}
            sx={{
              width: 40,
              height: 40,
              backgroundColor: customColor,
              border: selectedColor === customColor ? "2px solid black" : "none",
              borderRadius: "50%",
              minWidth: 0,
            }}
          >
            +
          </Button>
        </Grid>
      </Grid>

      <Dialog open={openPicker} onClose={handleClosePicker}>
        <Box sx={{ padding: 2 }}>
          <ChromePicker
            color={customColor}
            onChange={handleCustomColorChange}
          />
          <Button
            onClick={handleClosePicker}
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Confirmar
          </Button>
        </Box>
      </Dialog>

      <Box mt={2}>
        <Typography variant="body1">
          <strong>Cor selecionada:</strong> {selectedColor}
        </Typography>
      </Box>
    </Box>
  );
};

export default ColorPicker;
