import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFCC00",
    },
    secondary: {
      main: "#303030",
    },
    error: {
      main: red.A400,
    },
    gray: {
      main: "#C4C4C4",
    },
    
  },
});

export default theme;


