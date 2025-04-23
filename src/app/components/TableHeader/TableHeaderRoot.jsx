export function TableHeaderRoot({ children }) {
    return (
        <Grid container xs={12} sx={{ display: 'flex', flexDirection: "row", justifyContent: 'space-between', width: '100%', alignItems: 'center', p: 2 }}>
            <Grid item xs={5}>
                <Typography sx={{ fontSize: '16px', color: "#092C4C" }}>
                    <span style={{ fontWeight: 'bold' }}>Tabela de Leads</span>
                </Typography>
            </Grid>
        </Grid>
    );
}