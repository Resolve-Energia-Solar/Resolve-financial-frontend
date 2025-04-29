import { Grid } from "@mui/material";

export default function DetailsVisualizationRoot({ children }) {
    return (
        <Grid container xs={12} sx={{ border: '1px solid rgba(126, 131, 136, 0.17)', boxShadow: 2 , px: 3, borderRadius: 2, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', my: 2, py: 3 }}>
            {children}
        </Grid>
    );
}