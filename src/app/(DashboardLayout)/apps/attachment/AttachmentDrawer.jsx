import React, { useState } from "react";
import { Drawer, Box, Button } from "@mui/material";
import AttachmentTable from "@/app/components/apps/attachment/attachmentTable";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const AttachmentDrawer = ({ objectId, attachments, onAddAttachment, appLabel, model }) => {
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpenDrawer(true)}
        startIcon={<AttachFileIcon />}
      >
        Anexos
      </Button>
      <Drawer anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <Box sx={{ width: 800, p: 2 }}>
          {contentTypeId ? (
            <AttachmentTable
              objectId={objectId}
              appLabel={appLabel}
              model={model}
              attachments={attachments}
              onAddAttachment={onAddAttachment}
              onDelete={() => {}}
            />
          ) : (
            <div>Carregando...</div>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default AttachmentDrawer;
