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
                borderBottom: '1px solid #E0E0E0',
                p: '16px',
                display: 'grid',
                gridTemplateColumns: 'minmax(100px, auto) 1fr 1fr 1fr',
                gridTemplateAreas: `"client address chip"`,
                alignItems: 'center',
                gap: '1rem'
            }}
        >
            {children}
        </Grid>

    );
}