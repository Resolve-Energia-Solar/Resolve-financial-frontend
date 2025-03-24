import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSelector } from 'react-redux';
import { IconPower } from '@tabler/icons-react';
import CircularProgress from '@mui/material/CircularProgress'; 
import Dialog from '@mui/material/Dialog'; 
import DialogActions from '@mui/material/DialogActions'; 
import DialogContent from '@mui/material/DialogContent'; 
import DialogContentText from '@mui/material/DialogContentText'; 
import DialogTitle from '@mui/material/DialogTitle'; 
import Button from '@mui/material/Button'; 
import { useLogout } from '@/utils/logout';

export const Profile = () => {
  const customizer = useSelector((state) => state.customizer);
  const userProfile = useSelector((state) => state.user?.user);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';

  const { handleLogout, requestLogout, cancelLogout, loading, confirmLogout } = useLogout();

  return (
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: `${'secondary.light'}` }}
    >
      {!hideMenu ? (
        <>
          <Avatar 
            alt={userProfile?.first_name || 'Usuário'} 
            src={userProfile?.profile_picture || "/images/profile/user-1.jpg"} 
            sx={{ height: 40, width: 40 }} 
          />

          <Box>
            <Typography variant="h6">
              {userProfile?.first_name || 'Usuário'} 
            </Typography>
            <Typography variant="caption">
              {userProfile?.employee_data?.department || 'Desconhecido'}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton
                color="primary"
                aria-label="logout"
                size="small"
                onClick={requestLogout} 
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : <IconPower size="20" />}
              </IconButton>
            </Tooltip>
          </Box>

          <Dialog
            open={confirmLogout}
            onClose={cancelLogout}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Confirmar Logout</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Tem certeza de que deseja sair?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={cancelLogout} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleLogout} color="primary" autoFocus>
                Sair
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : null}
    </Box>
  );
};
