import { Grid, useTheme, Typography, } from "@mui/material"

export default function ClientCardAddressText({ title, subtitle, loading }) {

    const theme = useTheme();

    return (
        <Grid item sx={{ gridArea: 'address' }}>
            <Grid container size="auto" alignItems="center" spacing={2}>
                <Grid item size="auto" sx={{ position: 'relative', display: 'inline-block'}}>
                    <Typography fontSize={14} sx={{ fontWeight: '400', color: theme.palette.text.disabled }}>
                        {title}
                    </Typography>
                    <Typography fontSize={16} sx={{ fontWeight: '600', color: theme.palette.text.primary }}>
                        {subtitle}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );

}