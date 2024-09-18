import React, { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Box, Paper, Typography, Stack, Chip, IconButton, Menu, MenuItem } from "@mui/material";
import { IconDotsVertical } from "@tabler/icons-react";

const KanbanColumn = ({ category, leads, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const backgroundColor = category
    ? category.name === "Novo Lead"
      ? "primary.light"
      : category.name === "Primeiro Contato"
        ? "secondary.light"
        : category.name === "Pending"
          ? "warning.light"
          : category.name === "Done"
            ? "success.light"
            : "primary.light"
    : "primary.light";

  return (
    <Droppable droppableId={category.id.toString()}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            minWidth: "300px",
            backgroundColor: "#f4f4f4",
            p: 2,
            maxHeight: "80vh",
            overflowY: "auto"
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" gutterBottom>{category.name}</Typography>
            <IconButton onClick={handleMenuClick}>
              <IconDotsVertical size="1rem" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
              <MenuItem onClick={onEdit}>Editar Coluna</MenuItem>
              <MenuItem onClick={onDelete}>Deletar Coluna</MenuItem>
            </Menu>
          </Box>

          {leads.map((lead, index) => (
            <Draggable draggableId={lead.id.toString()} index={index} key={lead.id}>
              {(provided, snapshot) => (
                <Paper
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: snapshot.isDragging ? "#e0f7fa" : backgroundColor,
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <Typography variant="h6">{lead.name}</Typography>
                  <Typography variant="body2">{lead.email}</Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    <Chip label={`Phone: ${lead.phone}`} />
                  </Stack>
                </Paper>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
};

export default KanbanColumn;
