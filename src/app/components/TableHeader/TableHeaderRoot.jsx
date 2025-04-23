import { Grid } from "@mui/material";

export function TableHeaderRoot({ children }) {

    return (
        <Grid 
            container 
            xs={12} 
            sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'auto 1fr auto',
                gridTemplateAreas: `"title button"`,
                justifyContent: 'space-between', 
                width: '100%', 
                alignItems: 'center', 
                p: 2,
                gap: '1rem',
                // borderBottom: '1px solid #E0E0E0',

            }}>
            {children}
        </Grid>
    );
}