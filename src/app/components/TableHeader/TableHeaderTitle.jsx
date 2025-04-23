import { Grid, Typography } from "@mui/material";

export default function TableHeaderTitle({ title, totalItems, objNameNumberReference }) {
    return (
        <Grid item xs={5}>
            <Typography sx={{ fontSize: '16px', color: "#092C4C" }}>
                <span style={{ fontWeight: 'bold' }}>{title}: </span> {totalItems} {objNameNumberReference}
            </Typography>
        </Grid>
    );
}