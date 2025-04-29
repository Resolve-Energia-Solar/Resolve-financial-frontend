import { Grid, Typography, useTheme } from '@mui/material';

export default function DetailsVisualizationTitle({ title, children }) {
    const theme = useTheme();
    return (
        <>
            <Grid item xs={4} sx={{ display: 'flex', flexDirection: 'row' }}>
                <Typography sx={{ fontSize: "24px", fontWeight: 700, color: theme.palette.primary.text }}>
                    {title}
                </Typography>
            </Grid>

            {children}
            {/* <Grid item xs={12}>
                            <Typography sx={{ fontSize: "14px", fontWeight: 400, color: "#98959D" }}>
                                Selecione data, horário e selecione o endereço do cliente para criar o agendamento.
                            </Typography>
                        </Grid> */}
        </>
    );
}