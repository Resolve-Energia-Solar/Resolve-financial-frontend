'use client';
import NextLink from 'next/link';
import { Stack, Typography, Avatar, Box, AvatarGroup } from '@mui/material';
import { IconMessage2 } from '@tabler/icons-react';
import DashboardCard from '../../shared/DashboardCard';
import { useSelector } from 'react-redux';

const Social = () => {
  const user = useSelector((state) => state.user?.user); 
  return (
    <DashboardCard>
      <>
        <Stack direction="row" spacing={2}>
          <Avatar
            src={user?.profile_picture || "/images/profile/user-1.jpg"} 
            alt={'ImagemPerfil'}
            sx={{ borderRadius: '8px', width: 70, height: 70 }}
          />
          <Box>
            <Typography variant="h5">Super incrível, Resolve ZAP em breve!</Typography>
            <Typography variant="subtitle2" color="textSecondary">
              22 de Dezembro, 2024
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" justifyContent="space-between" mt={5}>
          <AvatarGroup max={4}>
            <Avatar alt="Remy Sharp" src={user?.profile_picture || "/images/profile/user-1.jpg"} />
            <Avatar alt="Travis Howard" src={"/images/profile/user-2.jpg"} />
            <Avatar alt="Cindy Baker" src={"/images/profile/user-3.jpg"} />
            <Avatar alt="Agnes Walker" src={"/images/profile/user-4.jpg"} />
          </AvatarGroup>
          <NextLink href="/">
            <Box
              width="40px"
              height="40px"
              bgcolor="primary.light"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                color="primary.main"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <IconMessage2 width={22} />
              </Typography>
            </Box>
          </NextLink>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default Social;
