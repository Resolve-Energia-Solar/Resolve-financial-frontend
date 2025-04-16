import {
    Grid,
    Box,
  } from '@mui/material';

export function LeadInfoHeaderRoot({ children, }) {

    return (  
        <Grid
            container
            xs={12}
            sx={{
            width: '100%',
            borderBottom: '1px solid #E0E0E0',
            p: '16px',
            display: 'grid',
            gridTemplateColumns: 'minmax(100px, auto) 1fr 1fr 1fr',
            gridTemplateAreas: `"profile interest status project"`,
            alignItems: 'center',
            gap: '1rem'
            }}
        >
            {children}
        </Grid>

    );
}