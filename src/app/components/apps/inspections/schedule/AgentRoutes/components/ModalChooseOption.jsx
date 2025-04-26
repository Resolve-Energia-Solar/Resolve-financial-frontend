import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Paper, Typography, Stack } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function ModalChooseOption({ open, onClose, onChoose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        O que você deseja fazer?
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} sm={6}>
            <Paper
              onClick={() => onChoose("list")}
              elevation={4}
              sx={{
                height: "100%",
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: 1,
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                  backgroundColor: "#f0f7ff",
                },
              }}
            >
              <Stack spacing={2} alignItems="center">
                <ListIcon sx={{ fontSize: 60, color: "#1976d2" }} />
                <Typography variant="h6" fontWeight="bold">
                  Listar Agendamentos
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Visualize todos os agendamentos existentes
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              onClick={() => onChoose("create")}
              elevation={4}
              sx={{
                height: "100%",
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: 1,
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                  backgroundColor: "#e8f5e9",
                },
              }}
            >
              <Stack spacing={2} alignItems="center">
                <AddCircleOutlineIcon sx={{ fontSize: 60, color: "#2e7d32" }} />
                <Typography variant="h6" fontWeight="bold">
                  Criar Novo
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Agende um novo agendamento
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "flex-end", mb: 2 }}>
        <Button onClick={onClose} color="error" variant="outlined" size="large">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
