import { Grid, Typography, useTheme } from "@mui/material";

export function DetailsVisualizationInfoItem({ Icon, label, value }) {
    const theme = useTheme();

    return (
        <Grid item sx={{ display: "flex", alignItems: "center", flexDirection: "row", gap: 1 }}>
            <Grid item>
                <Icon stroke={2} color={theme.palette.primary.main} />
            </Grid>
            <Grid item sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                    sx={{ fontSize: 14, fontWeight: 700, color: "text.primary", opacity: 0.6 }}
                >
                    {label}
                </Typography>
                <Typography
                    sx={{ fontSize: 14, fontWeight: 700, color: "text.primary" }}
                >
                    {value ?? "-"}
                </Typography>
            </Grid>
        </Grid>
    );
}
