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
import getContentType from "@/utils/getContentType";
import { useSelector } from "react-redux";

const AttachmentTable = ({
  objectId,
  attachments: attachmentsProp,
  onAddAttachment,
  appLabel,
  model,
  onDelete,
}) => {
  const [fetchedAttachments, setFetchedAttachments] = useState([]);
  const [openAttachmentModal, setOpenAttachmentModal] = useState(false);
  const [contentTypeId, setContentTypeId] = useState(null);

  // Recupera os dados do usuário e suas permissões do Redux
  const user = useSelector((state) => state.user?.user);
  const canDelete = user?.permissions?.includes(`${appLabel}.delete_${model}`);

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

  useEffect(() => {
    if (objectId) {
      fetchAttachments();
    }
  }, [objectId, contentTypeId]);

  const fetchAttachments = async () => {
    try {
      const response = await attachmentService.getAttachment(objectId, contentTypeId);
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
            <TableCell>
              <strong>Nome do Arquivo</strong>
            </TableCell>
            <TableCell>
              <strong>Descrição</strong>
            </TableCell>
            <TableCell>
              <strong>Data de Upload</strong>
            </TableCell>
            <TableCell>
              <strong>Ações</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayAttachments.length > 0 ? (
            displayAttachments.map((attachment) => (
              <TableRow key={attachment.id || attachment.file.name}>
                <TableCell>
                  {typeof attachment.file === "string" ? (
                    <Link
                      href={attachment.file}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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
                  {canDelete && (
                    <IconButton
                      color="error"
                      onClick={() => onDelete && onDelete(attachment.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
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
        contentType={contentTypeId}
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
