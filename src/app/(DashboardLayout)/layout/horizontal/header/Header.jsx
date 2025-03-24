import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';

import { useSelector, useDispatch } from 'react-redux';
import { toggleMobileSidebar } from '../../../../../store/customizer/CustomizerSlice';
import { IconMenu2 } from '@tabler/icons-react';
import Notifications from '../../vertical/header/Notification';

import Profile from '../../vertical/header/Profile';
import Search from '../../vertical/header/Search';
import Navigation from '../../vertical/header/Navigation';
import Logo from '../../shared/logo/Logo';

const HorizontalHeader = () => {
  const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const customizer = useSelector((state) => state.customizer);
  const dispatch = useDispatch();

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',

    [theme.breakpoints.up('lg')]: {
      minHeight: customizer.TopbarHeight,
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    margin: '0 auto',
    width: '100%',
    color: `${theme.palette.text.secondary} !important`,
  }));

  return (
    <AppBarStyled position="sticky" color="default" elevation={8}>
      <ToolbarStyled
        sx={{
          maxWidth: customizer.isLayout === 'boxed' ? 'lg' : '100%!important',
          display: "flex",
          alignItems: "center", 
          justifyContent: "center"
        }}
      >
        <Box sx={{ overflow: 'hidden', display: "flex", alignItems: "center", justifyContent: "flex-start", height: "100%", paddingTop: 1 }}>
          <Logo />
        </Box>
        {/* ------------------------------------------- */}
        {/* Toggle Button Sidebar */}
        {/* ------------------------------------------- */}
        {lgDown ? (
          <Box sx={{ overflow: 'hidden', display: "flex", alignItems: "center", justifyContent: "flex-start", height: "100%" }}>
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={() => dispatch(toggleMobileSidebar())}
            >
              <IconMenu2 />
            </IconButton>
          </Box>
        ) : (
          ''
        )}
        {/* ------------------------------------------- */}
        {/* Search Dropdown */}
        {/* ------------------------------------------- */}
        <Search />
        {lgUp ? (
          <>
            <Navigation />
          </>
        ) : null}
        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          {/* <Language /> */}
          {/* <Cart /> */}
          <Notifications />
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default HorizontalHeader;
