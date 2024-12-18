import { FC, useState } from 'react';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import { IconX, IconSettings, IconCheck } from '@tabler/icons-react';
import {
  setTheme,
  setDir,
  setDarkMode,
  toggleLayout,
  toggleSidebar,
  toggleHorizontal,
  setBorderRadius,
  setCardShadow,
} from '../../../../../store/customizer/CustomizerSlice';
import Scrollbar from "../../../../components/custom-scroll/Scrollbar";
import WbSunnyTwoToneIcon from '@mui/icons-material/WbSunnyTwoTone';
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
import SwipeLeftAltTwoToneIcon from '@mui/icons-material/SwipeLeftAltTwoTone';
import SwipeRightAltTwoToneIcon from '@mui/icons-material/SwipeRightAltTwoTone';
import AspectRatioTwoToneIcon from '@mui/icons-material/AspectRatioTwoTone';
import CallToActionTwoToneIcon from '@mui/icons-material/CallToActionTwoTone';
import ViewSidebarTwoToneIcon from '@mui/icons-material/ViewSidebarTwoTone';
import WebAssetTwoToneIcon from '@mui/icons-material/WebAssetTwoTone';
import { ViewComfyTwoTone, PaddingTwoTone, BorderOuter } from '@mui/icons-material';

const SidebarWidth = '320px';

const Customizer = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const customizer = useSelector((state) => state.customizer);

  const dispatch = useDispatch();

  const StyledBox = styled(Box)(({ theme }) => ({
    boxShadow: theme.shadows[8],
    padding: '20px',
    cursor: 'pointer',
    justifyContent: 'center',
    display: 'flex',
    transition: '0.1s ease-in',
    border: '1px solid rgba(145, 158, 171, 0.12)',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  }));

  const thColors = [
    {
      id: 1,
      bgColor: '#FFCC00',
      disp: 'RESOLVE_THEME',
      describe: 'Tema Resolve'
    },
    {
      id: 1,
      bgColor: '#5D87FF',
      disp: 'BLUE_THEME',
      describe: 'Azul'
    },
    {
      id: 2,
      bgColor: '#0074BA',
      disp: 'AQUA_THEME',
      describe: 'Aqua'
    },
    {
      id: 3,
      bgColor: '#763EBD',
      disp: 'PURPLE_THEME',
      describe: 'Roxo'
    },
    {
      id: 4,
      bgColor: '#0A7EA4',
      disp: 'GREEN_THEME',
      describe: 'Verde'
    },
    {
      id: 5,
      bgColor: '#01C0C8',
      disp: 'CYAN_THEME',
      describe: 'Ciano'
    },
    {
      id: 6,
      bgColor: '#FA896B',
      disp: 'ORANGE_THEME',
      describe: 'Laranja'
    },
  ];

  return (
    <div>
      {/* ------------------------------------------- */}
      {/* --Botão flutuante para abrir customizador -- */}
      {/* ------------------------------------------- */}
      <Tooltip title="Configurações">
        <Fab
          color="primary"
          aria-label="settings"
          sx={{ position: 'fixed', right: '25px', bottom: '15px' }}
          onClick={() => setShowDrawer(true)}
        >
          <IconSettings stroke={1.5} />
        </Fab>
      </Tooltip>
      <Drawer
        anchor="right"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        PaperProps={{
          sx: {
            width: SidebarWidth,
          },
        }}
      >
        {/* ------------------------------------------- */}
        {/* ------------ Sidebar do Customizador ------ */}
        {/* ------------------------------------------- */}
        <Scrollbar sx={{ height: 'calc(100vh - 5px)' }}>
          <Box p={2} display="flex" justifyContent={'space-between'} alignItems="center">
            <Typography variant="h4">Configurações</Typography>

            <IconButton color="inherit" onClick={() => setShowDrawer(false)}>
              <IconX size="1rem" />
            </IconButton>
          </Box>
          <Divider />
          <Box p={3}>
            {/* ------------------------------------------- */}
            {/* ------------ Configuração de Tema (Claro / Escuro) -------- */}
            {/* ------------------------------------------- */}
            <Typography variant="h6" gutterBottom>
              Opção de Tema
            </Typography>
            <Stack direction={'row'} gap={2} my={2}>
              <StyledBox onClick={() => dispatch(setDarkMode('light'))} display="flex" gap={1}>
                <WbSunnyTwoToneIcon
                  color={customizer.activeMode === 'light' ? 'primary' : 'inherit'}
                />
                Claro
              </StyledBox>
              <StyledBox onClick={() => dispatch(setDarkMode('dark'))} display="flex" gap={1}>
                <DarkModeTwoToneIcon
                  color={customizer.activeMode === 'dark' ? 'primary' : 'inherit'}
                />
                Escuro
              </StyledBox>
            </Stack>

            <Box pt={3} />
            {/* ------------------------------------------- */}
            {/* ------------ Configuração de Direção (RTL/LTR) ------------- */}
            {/* ------------------------------------------- */}
            <Typography variant="h6" gutterBottom>
              Direção do Tema
            </Typography>
            <Stack direction={'row'} gap={2} my={2}>
              <StyledBox onClick={() => dispatch(setDir('ltr'))} display="flex" gap={1}>
                <SwipeLeftAltTwoToneIcon
                  color={customizer.activeDir === 'ltr' ? 'primary' : 'inherit'}
                />{' '}
                LTR
              </StyledBox>
              <StyledBox onClick={() => dispatch(setDir('rtl'))} display="flex" gap={1}>
                <SwipeRightAltTwoToneIcon
                  color={customizer.activeDir === 'rtl' ? 'primary' : 'inherit'}
                />{' '}
                RTL
              </StyledBox>
            </Stack>

            {/* ------------------------------------------- */}
            {/* ------------ Theme Color setting ------------- */}
            {/* ------------------------------------------- */}
            <Typography variant="h6" gutterBottom>
              Tema de Cores
            </Typography>
            <Grid container spacing={2}>
              {thColors.map((thcolor) => (
                <Grid key={thcolor.id} size={4}>
                  <StyledBox onClick={() => dispatch(setTheme(thcolor.disp))}>
                    <Tooltip title={`${thcolor.describe}`} placement="top">
                      <Box
                        sx={{
                          backgroundColor: thcolor.bgColor,
                          width: "25px",
                          height: "25px",
                          borderRadius: "60px",
                          alignItems: "center",
                          justifyContent: "center",
                          display: "flex",
                          color: "white",
                        }}
                        aria-label={`${thcolor.bgColor}`}
                      >
                        {customizer.activeTheme === thcolor.disp ? (
                          <IconCheck width={13} />
                        ) : (
                          ""
                        )}
                      </Box>
                    </Tooltip>
                  </StyledBox>
                </Grid>
              ))}
            </Grid>,
            <Box pt={4} />

            {/* ------------------------------------------- */}
            {/* ------------ Layout Horizontal / Vertical ------------- */}
            {/* ------------------------------------------- */}
            <Typography variant="h6" gutterBottom>
              Tipo de Layout
            </Typography>
            <Stack direction={'row'} gap={2} my={2}>
              <StyledBox onClick={() => dispatch(toggleHorizontal(false))} display="flex" gap={1}>
                <ViewComfyTwoTone
                  color={customizer.isHorizontal === false ? 'primary' : 'inherit'}
                />
                Vertical
              </StyledBox>
              <StyledBox onClick={() => dispatch(toggleHorizontal(true))} display="flex" gap={1}>
                <PaddingTwoTone color={customizer.isHorizontal === true ? 'primary' : 'inherit'} />
                Horizontal
              </StyledBox>
            </Stack>
            <Box pt={4} />
            {/* ------------------------------------------- */}
            {/* ------------ Layout Caixa / Completo ------------- */}
            {/* ------------------------------------------- */}
            <Typography variant="h6" gutterBottom>
              Opção de Container
            </Typography>
            <Stack direction={'row'} gap={2} my={2}>
              <StyledBox onClick={() => dispatch(toggleLayout('boxed'))} display="flex" gap={1}>
                <CallToActionTwoToneIcon
                  color={customizer.isLayout === 'boxed' ? 'primary' : 'inherit'}
                />
                Caixa
              </StyledBox>
              <StyledBox onClick={() => dispatch(toggleLayout('full'))} display="flex" gap={1}>
                <AspectRatioTwoToneIcon
                  color={customizer.isLayout === 'full' ? 'primary' : 'inherit'}
                />
                Completo
              </StyledBox>
            </Stack>
            <Box pt={4} />
            <Typography variant="h6" gutterBottom>
              Largura do Cartão
            </Typography>
            <Stack direction={'row'} gap={2} my={2}>
              <StyledBox onClick={() => dispatch(setCardShadow(false))} display="flex" gap={1}>
                <BorderOuter color={!customizer.isCardShadow ? 'primary' : 'inherit'} />
                Borda
              </StyledBox>
              <StyledBox onClick={() => dispatch(setCardShadow(true))} display="flex" gap={1}>
                <CallToActionTwoToneIcon color={customizer.isCardShadow ? 'primary' : 'inherit'} />
                Sombra
              </StyledBox>
            </Stack>
            <Box pt={4} />
            {/* ------------------------------------------- */}
            {/* ------------ Configuração de Raio de Borda ------------- */}
            {/* ------------------------------------------- */}
            <Typography variant="h6" gutterBottom>
              Raio da Borda do Tema
            </Typography>

            <Slider
              size="small"
              value={customizer.borderRadius}
              aria-label="Small"
              min={4}
              max={24}
              onChange={(event) => dispatch(setBorderRadius(event.target.value))}
              valueLabelDisplay="auto"
            />
          </Box>
        </Scrollbar>
      </Drawer>
    </div>
  );
};

export default Customizer;
