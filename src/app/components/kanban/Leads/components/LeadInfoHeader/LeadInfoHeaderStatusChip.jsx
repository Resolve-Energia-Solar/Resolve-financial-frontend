import { Chip, Grid, Typography } from "@mui/material";
import { useContext } from "react";
import { LeadModalTabContext } from "../../context/LeadModalTabContext";
import { useTheme } from "@emotion/react";

export function LeadInfoHeaderStatusChip({ leadId, tabValue }) {
    const { lead } = useContext(LeadModalTabContext);
    const theme = useTheme();

    return (
        <Grid container xs={2} alignItems="center" spacing={2}>
            <Grid
                item
                sx={{
                    display: 'flex',
                    flexDirection: 'column ',
                    alignItems: 'flex-start',
                }}
                >
                <Typography variant="caption" sx={{ color: 'gray', mb: 0.5 }}>
                    Status
                </Typography>
                <Chip
                    label={lead?.column?.name}
                    variant="outlined"
                    sx={{
                    color: 'gray',
                    borderColor: `${lead?.column?.color}`,
                    px: 1,
                    }}
                />
            </Grid>
        </Grid>
    );
}