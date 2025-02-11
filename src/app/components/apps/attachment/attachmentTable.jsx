import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Link,
  Typography,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAttachmentModal from "@/app/(DashboardLayout)/apps/attachment/AddAttachmentModal";
import attachmentService from "@/services/attachmentService";

const AttachmentTable = ({ objectId, contentType, attachments: attachmentsProp, onAddAttachment, onDelete }) => {
  const [fetchedAttachments, setFetchedAttachments] = useState([]);
  const [openAttachmentModal, setOpenAttachmentModal] = useState(false);

  useEffect(() => {
    if (objectId) {
      fetchAttachments();
    }
  }, [objectId, contentType]);

  const fetchAttachments = async () => {
    try {
      const response = await attachmentService.getAttachment(objectId, contentType);
      setFetchedAttachments(response.results || []);
    } catch (error) {
      console.error("Erro ao buscar anexos:", error);
      setFetchedAttachments([]);
    }
  };

  const displayAttachments = objectId ? fetchedAttachments : attachmentsProp;

  const getFileName = (file) => {
    if (typeof file === "string") {
      return file.split("?")[0].split("/").pop();
    } else if (file instanceof File) {
      return file.name;
    }
    return "";
  };

  return (
    <TableContainer component={Paper}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Typography variant="h6">Anexos</Typography>
        <Button variant="contained" onClick={() => setOpenAttachmentModal(true)}>
          Adicionar Anexo
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Nome do Arquivo</strong></TableCell>
            <TableCell><strong>Descrição</strong></TableCell>
            <TableCell><strong>Data de Upload</strong></TableCell>
            <TableCell><strong>Ações</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayAttachments.length > 0 ? (
            displayAttachments.map((attachment) => (
              <TableRow key={attachment.id || attachment.file.name}>
                <TableCell>
                  {typeof attachment.file === "string" ? (
                    <Link href={attachment.file} target="_blank" rel="noopener noreferrer">
                      {getFileName(attachment.file)}
                    </Link>
                  ) : (
                    getFileName(attachment.file)
                  )}
                </TableCell>
                <TableCell>{attachment.description || "-"}</TableCell>
                <TableCell>
                  {attachment.created_at
                    ? new Date(attachment.created_at).toLocaleString("pt-BR")
                    : "-"}
                </TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => onDelete && onDelete(attachment.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                Nenhum anexo disponível.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <AddAttachmentModal
        open={openAttachmentModal}
        onClose={() => setOpenAttachmentModal(false)}
        objectId={objectId}
        contentType={contentType}
        onAddAttachment={(attachment) => {
          if (!objectId) {
            onAddAttachment && onAddAttachment(attachment);
          } else {
            setFetchedAttachments((prev) => [...prev, attachment]);
          }
        }}
        showFields={{ description: true }}
      />
    </TableContainer>
  );
};

export default AttachmentTable;
