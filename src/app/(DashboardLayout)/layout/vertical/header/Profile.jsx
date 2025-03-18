import React, { useState } from 'react';
import Link from 'next/link';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import * as dropdownData from './data';
import { IconMail } from '@tabler/icons-react';
import { Stack } from '@mui/system';
import { useSelector } from 'react-redux';
import { useLogout } from '@/utils/logout';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const user = useSelector((state) => state.user?.user);
  console.log(user);
  const { handleLogout, requestLogout, cancelLogout, loading, confirmLogout } = useLogout();

  return (
    <Box>
      <IconButton
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={user?.profile_picture || '/images/profile/user-1.jpg'}
          alt={user?.first_name}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>

      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '500px',
            p: 4,
          },
        }}
      >
        <Typography variant="h5">Perfil</Typography>
        <Link href={`/apps/user-profile/${user?.username}`} passHref>
          <Stack direction="row" py={3} spacing={2} alignItems="center">
            <Avatar
              src={user?.profile_picture || '/images/profile/user-1.jpg'}
              alt={user?.first_name}
              sx={{ width: 95, height: 95 }}
            />
            <Box>
              <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
                {user?.first_name || ''} {user?.last_name || ''}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {user?.role?.name || ''}
              </Typography>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <IconMail width={15} height={15} />
                {user?.email || ''}
              </Typography>
            </Box>
          </Stack>
        </Link>
        <Divider />
        {/*  {dropdownData.profile.map((profile) => (
          <Box key={profile.title}>
            <Box sx={{ py: 2, px: 0 }} className="hover-text-primary">
              <Link href={profile.href}>
                <Stack direction="row" spacing={2}>
                  <Box
                    width="45px"
                    height="45px"
                    bgcolor="primary.light"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink="0"
                  >
                    <Avatar
                      src={profile.icon}
                      alt={profile.icon}
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 0,
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="textPrimary"
                      className="text-hover"
                      noWrap
                      sx={{
                        width: '240px',
                      }}
                    >
                      {profile.title}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                      sx={{
                        width: '240px',
                      }}
                      noWrap
                    >
                      {profile.subtitle}
                    </Typography>
                  </Box>
                </Stack>
              </Link>
            </Box>
          </Box>
        ))} */}
        <Box mt={2}>
          <Button onClick={requestLogout} variant="outlined" color="primary" fullWidth>
            {loading ? <CircularProgress size={20} /> : 'Sair'}
          </Button>
        </Box>
      </Menu>

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
    </Box>
  );
};

export default Profile;
