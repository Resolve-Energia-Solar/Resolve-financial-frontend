import { Grid, Typography } from "@mui/material";

export default function TableHeaderTitle({ title, totalItems, objNameNumberReference }) {
    return (
        <Grid item gridArea={"title"} sx={{ display: 'flex', flexDirection: "row", justifyContent: 'flex-end' }}>
            <Typography sx={{ fontSize: '16px', color: "#303030" }}>
                <span style={{ fontWeight: 'bold' }}>{title}: </span> {totalItems} {objNameNumberReference}
            </Typography>
        </Grid>
    );
}