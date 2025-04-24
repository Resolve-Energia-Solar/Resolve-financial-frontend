import AttachmentTable from "@/app/components/apps/attachment/attachmentTable";
import { Grid, Typography } from "@mui/material";
import { useState } from "react";

export default function ArchivesTab({ projectId, processId, onClose }) {
    const [project, setProject] = useState(null);

    return (
        <Grid container>
            <Typography variant="h6" sx={{ mb: 3 }}>Anexos do Projeto</Typography>
            <AttachmentTable appLabel="resolve_crm" model="project" objectId={projectId} />
            <Typography variant="h6" sx={{ my: 3 }}>Anexos da Venda</Typography>
            <AttachmentTable appLabel="resolve_crm" model="sale" objectId={project?.sale} />
        </Grid>
    );
}