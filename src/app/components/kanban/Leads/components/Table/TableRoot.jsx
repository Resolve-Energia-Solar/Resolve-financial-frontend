import { Grid } from "@mui/material";

export function TableRoot({ children }) {
    return (
        <Grid container xs={12}>
            {children}
        </Grid>
    );
}