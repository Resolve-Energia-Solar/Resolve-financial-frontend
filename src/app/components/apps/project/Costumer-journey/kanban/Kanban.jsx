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
  Avatar,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ProjectDetailDrawer from "../Project-Detail/ProjectDrawer";
import KanbanSkeleton from "@/app/(DashboardLayout)/apps/project/kanban/KanbanSkeleton";

// Ícones adicionais para colunas
import SearchIcon from "@mui/icons-material/Search";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BuildIcon from "@mui/icons-material/Build";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

export default function JourneyKanban({ kanbanData, loadMore, loadingColumns, loading }) {
  const theme = useTheme();
  const containersRef = useRef({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Meta de ícone e cor para cada coluna
  const COLUMN_META = {
    vistoria: { label: 'Vistoria', icon: SearchIcon, color: theme.palette.info.main },
    documentacao: { label: 'Documentação', icon: DescriptionIcon, color: theme.palette.warning.main },
    financeiro: { label: 'Financeiro', icon: AttachMoneyIcon, color: theme.palette.success.main },
    projeto_engenharia: { label: 'Projeto de Engenharia', icon: BuildIcon, color: theme.palette.primary.main },
    lista_materiais: { label: 'Lista de Materiais', icon: FormatListBulletedIcon, color: theme.palette.secondary.main },
    logistica: { label: 'Logística', icon: LocalShippingIcon, color: theme.palette.info.dark },
    instalacao: { label: 'Instalação', icon: SettingsApplicationsIcon, color: theme.palette.warning.dark },
    vistoria_final: { label: 'Vistoria Final', icon: VisibilityIcon, color: theme.palette.primary.dark },
    homologado: { label: 'Homologado', icon: VerifiedUserIcon, color: theme.palette.success.dark },
  };

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

  // Render skeleton se estiver carregando dados iniciais
  if (loading) {
    return <KanbanSkeleton columns={Object.keys(COLUMN_META).length} itemsPerColumn={5} />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        p: 2,
        bgcolor: theme.palette.background.default,
        overflowX: 'auto',
        width: '100%',
        '&::-webkit-scrollbar': {
          height: 6,
          width: 6,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
          borderRadius: 3,
        },
        scrollbarWidth: 'thin',
        scrollbarColor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.3) transparent' : 'rgba(255,255,255,0.3) transparent',
      }}
    >
      {Object.entries(kanbanData).map(([key, data]) => {
        const meta = COLUMN_META[key] || { icon: AssignmentIcon, color: theme.palette.primary.main };
        const IconComponent = meta.icon;
        const bgColor = meta.color;
        const textColor = theme.palette.getContrastText(bgColor);

        return (
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
                bgcolor: bgColor,
                color: textColor,
                borderRadius: '8px 8px 0 0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: theme.palette.getContrastText(bgColor), width: 32, height: 32 }}>
                  <IconComponent sx={{ color: bgColor }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, ml: 1 }}>
                  {COLUMN_META[key]?.label || key}
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
                        <Avatar sx={{ bgcolor: bgColor }}>
                          <AssignmentIcon sx={{ color: textColor }} />
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
        );
      })}

      <ProjectDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        projectId={selectedProjectId}
      />
    </Box>
  );
}