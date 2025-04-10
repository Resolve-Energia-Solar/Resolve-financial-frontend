import {
    Grid,
    Box,
  } from '@mui/material';

export function LeadInfoHeaderRoot({ childern, }) {

    return (
        <Box
            sx={{
                width: '100%',
                borderBottom: '1px solid #E0E0E0',
                borderRadius: '0px',
                padding: '16px',
                display: 'flex',
            }}
            spacing={2}
        >
            <Grid container xs={12} alignItems="center">
                {childern}
            </Grid>
        </Box>
    );
}