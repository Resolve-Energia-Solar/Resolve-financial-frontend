import React, { useState } from "react";
import { Button } from "@mui/material";
import GenericFilterDrawer from "../../filters/GenericFilterDrawer";

const filterConfig = [
  {
    key: "level__in",
    label: "Nível (lista)",
    type: "multiselect",
    options: [
      { value: "success", label: "Sucesso" },
      { value: "info", label: "Informação" },
      { value: "warning", label: "Aviso" },
      { value: "error", label: "Erro" },
    ],
  },
  {
    key: "unread",
    label: "Não Lidas",
    type: "select",
    options: [
      { value: "true", label: "Não Lidas" },
      { value: "false", label: "Lidas" },
    ],
  },
  {
    key: "verb__icontains",
    label: "Verbo (contém)",
    type: "text",
  },
  {
    key: "description__icontains",
    label: "Descrição (contém)",
    type: "text",
  },
  {
    key: "timestamp__range",
    label: "Timestamp (entre)",
    type: "range",
    inputType: "date",
  },
  {
    key: "public",
    label: "Público",
    type: "select",
    options: [
      { value: "true", label: "Sim" },
      { value: "false", label: "Não" },
    ],
  },
  {
    key: "deleted",
    label: "Deletado",
    type: "select",
    options: [
      { value: "true", label: "Sim" },
      { value: "false", label: "Não" },
    ],
  }
];

const NotificationFilter = ({ onApplyFilters }) => {
  const [open, setOpen] = useState(false);

  const handleApply = (filters) => {
    console.log("Filtros aplicados:", filters);
    if (onApplyFilters) onApplyFilters(filters);
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Filtros
      </Button>
      <GenericFilterDrawer
        filters={filterConfig}
        initialValues={{}}
        onApply={handleApply}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default NotificationFilter;
