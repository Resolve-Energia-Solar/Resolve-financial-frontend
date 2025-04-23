import { Button, Grid, useTheme } from "@mui/material";
import { Add } from "@mui/icons-material";

export default function TableHeaderButton({ buttonLabel, onButtonClick, sx }) {
    const theme = useTheme();
    
    return (
        <Grid item xs={6} sx={{ display: 'flex', flexDirection: "row", justifyContent: 'flex-end' }}>
            <Button
                startIcon={<Add />}
                onClick={onButtonClick}
                sx={{
                    // width: 74,
                    height: 36,
                    fontSize: '0.75rem',
                    p: '4px 8px',
                    minWidth: 'unset',
                    borderRadius: '4px',
                    color: theme.palette.primary.light,
                    borderRadius: 5,
                    backgroundColor: theme.palette.primary.main,
                    '&:hover': { backgroundColor: theme.palette.primary.light, color: theme.palette.primary.main, border: '1px solid', borderColor: theme.palette.primary.main },
                    ... sx,
                }}
            >
                {buttonLabel}

            </Button>
        </Grid>
    );
}