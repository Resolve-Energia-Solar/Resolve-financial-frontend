import { Grid, useTheme, Typography, } from "@mui/material"

export default function ClientCardText({ title, content }) {

    const theme = useTheme();

    return (
        <Grid item sx={{ gridArea: 'profile' }}>
            <Grid container size="auto" alignItems="center" spacing={2}>
                <Grid item size="auto" sx={{ position: 'relative', display: 'inline-block'}}>
                    <Typography variant="caption" sx={{ color: 'gray' }}>
                        {title}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {content}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );

}