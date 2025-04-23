import { Button, Grid, useTheme } from "@mui/material";
import { Add } from "@mui/icons-material";

export default function TableHeaderButton({ buttonLabel, onButtonClick, sx }) {
    const theme = useTheme();
    
    return (
        <Grid item xs={1} sx={{ display: 'flex', flexDirection: "row", justifyContent: 'flex-end' }}>
            <Button
                startIcon={<Add />}
                onClick={onButtonClick}
                sx={{
                    width: 74,
                    height: 28,
                    fontSize: '0.75rem',
                    p: '4px 8px',
                    minWidth: 'unset',
                    borderRadius: '4px',
                    color: '#000',
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': { backgroundColor: theme.palette.primary.light, color: '#000' },
                    ... sx,
                }}
            >
                {buttonLabel}

            </Button>
        </Grid>
    );
}