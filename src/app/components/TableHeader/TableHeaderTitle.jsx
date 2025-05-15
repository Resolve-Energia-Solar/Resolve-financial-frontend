import { Grid, Skeleton, Typography, useTheme } from "@mui/material";

export default function TableHeaderTitle({ title, totalItems, objNameNumberReference, loading }) {
    const theme = useTheme();
    const formattedTotalItems = totalItems?.toLocaleString() ?? 0;

    return (
        <Grid item gridArea={"title"} sx={{ display: 'flex', flexDirection: "row", justifyContent: 'flex-end' }}>
            <Typography sx={{ fontSize: '18px', color: theme.palette.primary.title }}>
                <span style={{ fontWeight: 'bold' }}>{title}: </span> {loading ? <Skeleton variant="text" width={40} sx={{ display: 'inline-block' }} /> : formattedTotalItems} {objNameNumberReference}
            </Typography>
        </Grid>
    );
}