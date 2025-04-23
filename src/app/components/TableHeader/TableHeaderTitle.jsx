import { Grid, Typography, useTheme } from "@mui/material";

export default function TableHeaderTtle({ title, totalItems, objNameNumberReference }) {
    const theme = useTheme();
    return (
        <Grid item gridArea={"title"} sx={{ display: 'flex', flexDirection: "row", justifyContent: 'flex-end' }}>
            <Typography sx={{ fontSize: '18px', color: theme.palette.primary.title }}>
                <span style={{ fontWeight: 'bold' }}>{title}: </span> {totalItems} {objNameNumberReference}
            </Typography>
        </Grid>
    );
}