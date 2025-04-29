import { Chip, Grid, Typography } from "@mui/material";
import { useContext } from "react";
import { useTheme } from "@emotion/react";
import { ProjectDetailsContext } from "../../context/ProjectDetailsContext";
import FinalServiceOpinionChip from "../../../inspections/schedule/StatusChip/FinalServiceOpinionChip";

export default function ClientCardChips({ chipsTitle, status, loading }) {
    // const { project } = useContext(ProjectDetailsContext);
    const theme = useTheme();

    return (
        // <Grid item sx={{ gridArea: 'status' }}>
        //     <Grid container size="auto" display="flex" alignItems="center" justifyContent="flex-start" spacing={2}>
        //         <Grid
        //             item
        //             xs={12}
        //             sx={{
        //                 display: 'flex',
        //                 flexDirection: 'column ',
        //                 alignItems: 'flex-start',
        //             }}
        //             >
        //             <Typography variant="caption" sx={{ color: 'gray', mb: 0.5 }}>
        //                 {chipsTitle}
        //             </Typography>
        //             <Chip
        //                 label={project?.column?.name}
        //                 variant="outlined"
        //                 sx={{
        //                 color: 'gray',
        //                 borderColor: `${project?.column?.color}`,
        //                 px: 1,
        //                 }}
        //             />
        //         </Grid>
        //     </Grid>
        // </Grid>

        <Grid item sx={{ gridArea: "status" }}>
            <Grid container size="auto" sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', justifyContent: 'flex-start' }} spacing={2}>
                <Grid
                    item
                    xs={12}
                    sx={{
                        position: 'relative', 
                        display: 'flex', 
                        flexDirection: 'column',
                        width: '100%'
                    }}
                >
                    <Typography variant="caption" color="gray" gutterBottom>
                        {chipsTitle}
                    </Typography>

                    {loading
                        ? <Skeleton variant="rectangular" width={80} height={32} />
                        : <FinalServiceOpinionChip status={status} />
                    }
                </Grid>
            </Grid>
        </Grid>
    );
}