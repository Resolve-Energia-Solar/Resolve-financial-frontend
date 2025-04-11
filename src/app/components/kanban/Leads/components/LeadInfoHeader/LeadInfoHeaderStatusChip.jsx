import { Chip, Grid, Typography } from "@mui/material";
import { useContext } from "react";
import { LeadModalTabContext } from "../../context/LeadModalTabContext";
import { useTheme } from "@emotion/react";

export function LeadInfoHeaderStatusChip({ leadId, tabValue }) {
    const { lead } = useContext(LeadModalTabContext);
    const theme = useTheme();

    return (
        <Grid item sx={{ gridArea: 'status' }}>
            <Grid container size="auto" display="flex" alignItems="center" justifyItems="flex-end" spacing={2}>
                <Grid
                    item
                    xs={12}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column ',
                        alignItems: 'flex-start',
                    }}
                    >
                    <Typography variant="caption" sx={{ color: 'gray', mb: 0.5 }}>
                        Status Kanban
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
        </Grid>
    );
}