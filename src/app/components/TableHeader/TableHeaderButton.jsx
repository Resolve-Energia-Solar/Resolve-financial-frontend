import { Button, Grid, Typography, useTheme } from "@mui/material";

export default function TableHeaderButton({ buttonLabel, onButtonClick, sx, icon }) {
    const theme = useTheme();
    
    return (
        <Grid item gridArea={"button"} sx={{ display: 'flex', flexDirection: "row", justifyContent: 'flex-end' }}>
            <Button
                startIcon={icon}
                onClick={onButtonClick}
                sx={{
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
                <Typography sx={{ fontWeight: "600" }}> {buttonLabel} </Typography>

            </Button>
        </Grid>
    );
}