import { Grid, Typography, useTheme } from "@mui/material";

export default function DetailsVisualizationDataText({ title, dataText }) {
    const theme = useTheme();
    return (
        <Grid container xs={6} sx={{ mt: 3 }}>
            <Grid item xs={12}>
                <Typography sx={{ fontSize: "14px", fontWeight: 700, color: theme.palette.primary.text }}>
                    {title}
                </Typography>
                <Typography sx={{ fontSize: "16px", fontWeight: 700, color: theme.palette.primary.text, opacity: 0.6 }}>
                    {dataText}
                </Typography>
            </Grid>
        </Grid>
    );
}