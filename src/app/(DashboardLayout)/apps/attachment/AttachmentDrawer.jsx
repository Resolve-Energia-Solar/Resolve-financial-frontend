import React, { useState, useEffect } from "react";
import { Drawer, Box, Button } from "@mui/material";
import AttachmentTable from "@/app/components/apps/attachment/attachmentTable";
import getContentType from "@/utils/getContentType";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const AttachmentDrawer = ({ objectId, attachments, onAddAttachment, appLabel, model }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [contentTypeId, setContentTypeId] = useState(null);

  useEffect(() => {
    async function fetchContentTypeId() {
      try {
        const id = await getContentType(appLabel, model);
        setContentTypeId(id);
      } catch (error) {
        console.error("Erro ao buscar content type:", error);
      }
    }
    fetchContentTypeId();
  }, [appLabel, model]);

  console.log("Content Type ID:", contentTypeId);

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
