import {
    Grid,
    Box,
  } from '@mui/material';

export function LeadInfoHeaderRoot({ children, }) {

    return (
        <Box
            sx={{
                width: '100%',
                borderBottom: '1px solid #E0E0E0',
                borderRadius: '0px',
                padding: '16px',
                display: 'flex',
            }}
        >
            <Grid container xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {children}
            </Grid>
        </Box>
    );
}