import Comment from "@/app/components/apps/comment";
import { Grid, Typography } from "@mui/material";
import { useState } from "react";

export default function HistoryTab({ projectId }) {

    const [project, setProject] = useState(null);

    return (
        <Grid container spacing={2} sx={{ padding: 2 }}>
            <Grid item xs={6}>
                <Typography fontSize={16} fontWeight={400} sx={{ my: 1 }}>Comentários do <strong>Projeto</strong></Typography>
                <Comment appLabel="resolve_crm" model="project" objectId={projectId} />
            </Grid> 
            <Grid item xs={6}>
                <Typography fontSize={16} fontWeight={400} sx={{ my: 1 }}>Comentários da <strong>Venda</strong></Typography>
                <Comment appLabel="resolve_crm" model="sale" objectId={project?.sale} />
            </Grid>
        </Grid>
    );
}