"use client";

import React, { useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardHeader,
  CardContent,
  Avatar
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ProjectDetailDrawer from "../Project-Detail/ProjectDrawer";
import KanbanSkeleton from "@/app/(DashboardLayout)/apps/project/kanban/KanbanSkeleton";

const LABELS = {
  vistoria: "Vistoria",
  documentacao: "Documentação",
  financeiro: "Financeiro",
  projeto_engenharia: "Projeto de Engenharia",
  lista_materiais: "Lista de Materiais",
  logistica: "Logística",
  instalacao: "Instalação",
  vistoria_final: "Vistoria Final",
  homologado: "Homologado",
};

export default function JourneyKanban({ kanbanData, loadMore, loadingColumns, loading }) {
  const theme = useTheme();
  const containersRef = useRef({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const handleScroll = (key) => (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    const nextPage = kanbanData[key]?.current_page + 1;

    if (
      !loadingColumns[key] &&
      nextPage <= kanbanData[key]?.total_pages &&
      scrollTop + clientHeight >= scrollHeight - 50
    ) {
      loadMore(key);
    }
  };

  const handleCardClick = (projectId) => {
    setSelectedProjectId(projectId);
    setDrawerOpen(true);
  };

  return (
    loading
      ? (<KanbanSkeleton columns={LABELS.length} itemsPerColumn={5} />)
      : (
        <Box
          sx={{
            display: "flex",
            gap: 3,
            overflowX: "auto",
            p: 2,
            bgcolor: theme.palette.background.default,
          }}
        >
          {Object.entries(kanbanData).map(([key, data]) => (
            <Paper
              key={key}
              elevation={4}
              sx={{
                minWidth: 400,
                maxWidth: 400,
                display: "flex",
                flexDirection: "column",
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderRadius: 2,
                maxHeight: "80vh",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  borderRadius: '8px 8px 0 0',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.dark, width: 32, height: 32 }}>
                    <AssignmentIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600, ml: 1 }}>
                    {LABELS[key] || key}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  {kanbanData[key]?.count} itens
                </Typography>
              </Box>

              <Box
                sx={{ flex: 1, overflowY: "auto", p: 2 }}
                onScroll={handleScroll(key)}
                ref={(el) => (containersRef.current[key] = el)}
              >
                {data.projects.length > 0 ? (
                  data.projects.map((proj) => (
                    <Card
                      key={proj.id}
                      variant="outlined"
                      sx={{
                        mb: 2,
                        borderRadius: 2,
                        boxShadow: theme.shadows[3],
                        minHeight: 180,
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: theme.shadows[6],
                        },
                      }}
                      onClick={() => handleCardClick(proj.id)}
                    >
                      <CardHeader
                        avatar={
                          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                            <AssignmentIcon />
                          </Avatar>
                        }
                        title={
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 500 }}
                          >
                            {proj.project_number}
                          </Typography>
                        }
                        subheader={
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
                            {proj.customer_name}
                          </Typography>
                        }
                      />
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <ReceiptIcon fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2">
                            Contrato: {proj.contract_number}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CalendarTodayIcon
                            fontSize="small"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body2">
                            Assinado em:{' '}
                            {proj.signature_date
                              ? new Date(proj.signature_date).toLocaleString()
                              : "Não assinado"}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    — Vazio —
                  </Typography>
                )}

                {loadingColumns[key] && (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <CircularProgress size={28} />
                  </Box>
                )}
              </Box>
            </Paper>
          ))}

          {/* Add the ProjectDetailDrawer component */}
          <ProjectDetailDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            projectId={selectedProjectId}
          />
        </Box>
      )
  );
}