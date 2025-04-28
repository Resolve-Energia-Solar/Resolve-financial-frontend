import {
    Grid,
} from '@mui/material';

export default function ClientCardRoot({ children }) {
    return (
        <Grid
            container
            xs={12}
            sx={{
                width: '100%',
                border: '1px solid rgba(94, 96, 99, 0.17)',
                boxShadow: 1,
                borderRadius: 2,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                p: '16px',
                display: 'grid',
                // gridTemplateColumns: 'minmax(100px, auto) 1fr 1fr 1fr',
                gridTemplateColumns: 'auto 1fr 1fr',
                gridTemplateAreas: `"client address chip"`,
                alignItems: 'center',
                gap: '1rem'
            }}
        >
            {children}
        </Grid>

    );
}