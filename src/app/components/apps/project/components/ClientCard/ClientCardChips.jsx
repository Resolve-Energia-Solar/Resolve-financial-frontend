import { Chip, Grid, Typography } from "@mui/material";
import { useContext } from "react";
import { useTheme } from "@emotion/react";

export default function ClientCardChips({ chipsTitle }) {
    const { project } = useContext(ProjectDetailsContext);
    const theme = useTheme();

    return (
        <Grid item sx={{ gridArea: 'status' }}>
            <Grid container size="auto" display="flex" alignItems="center" justifyContent="flex-start" spacing={2}>
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
                        {chipsTitle}
                    </Typography>
                    <Chip
                        label={project?.column?.name}
                        variant="outlined"
                        sx={{
                        color: 'gray',
                        borderColor: `${project?.column?.color}`,
                        px: 1,
                        }}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}