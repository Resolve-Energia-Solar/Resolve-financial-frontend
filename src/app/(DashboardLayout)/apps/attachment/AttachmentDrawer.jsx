import React from "react";
import { Drawer, Box, Button } from "@mui/material";
import AttachmentTable from "@/app/components/apps/attachment/attachmentTable";

const AttachmentDrawer = ({ objectId, attachments, onAddAttachment, contentTypeId }) => {
  const [openDrawer, setOpenDrawer] = React.useState(false);

  return (
    <>
      <Button variant="outlined" onClick={() => setOpenDrawer(true)}>
        Anexos
      </Button>
      <Drawer anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <Box sx={{ width: 400, p: 2 }}>
          <AttachmentTable
            objectId={objectId}
            contentType={contentTypeId}
            attachments={attachments}
            onAddAttachment={onAddAttachment}
          />
        </Box>
      </Drawer>
    </>
  );
};

export default AttachmentDrawer;
