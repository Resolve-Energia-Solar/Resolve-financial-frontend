import { Grid } from "@mui/material";

export function TableHeaderRoot({ children }) {
    
    return (
        <Grid container xs={12} sx={{ display: 'flex', flexDirection: "row", justifyContent: 'space-between', width: '100%', alignItems: 'center', p: 2 }}>
            {children}
        </Grid>
    );
}