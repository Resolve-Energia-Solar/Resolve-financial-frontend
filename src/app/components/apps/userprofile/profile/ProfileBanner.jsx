'use client';
import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';
import CardMedia from '@mui/material/CardMedia';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import {
  IconBrandDribbble,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandYoutube,
  IconFileDescription,
  IconUserCheck,
} from '@tabler/icons-react';
import ProfileTab from './ProfileTab';
import BlankCard from '../../../shared/BlankCard';
import employeeService from '@/services/employeeService';
import commentService from '@/services/commentService';
import getContentType from '@/utils/getContentType';
import { useSelector } from 'react-redux';

const ProfileBanner = ({ user }) => {
  const loggedUser = useSelector((state) => state.user?.user);
  const isOwner = user?.id === loggedUser?.id;
  const [postsCount, setPostsCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);

  const ProfileImage = styled(Box)(() => ({
    backgroundImage: 'linear-gradient(#50b2fc,#f44c66)',
    borderRadius: '50%',
    width: '110px',
    height: '110px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  }));

  useEffect(() => {
    async function fetchCount() {
      // Verifica se user.id está definido
      if (!user?.id) return;

      // Busca dados de departamento
      if (user?.employee_data?.department) {
        try {
          const data = await employeeService.index({
            department: user.employee?.department?.id,
            fields: ['id'],
          });
          setDepartmentCount(data.count || data.length || 0);
        } catch (error) {
          console.error('Erro ao buscar dados do departamento:', error);
        }
      }

      // Busca comentários (postagens)
      try {
        const contentType = await getContentType('accounts', 'user');
        console.log('contentType:', contentType);
        const commentsData = await commentService.index({
          object_id: post.id,
          content_type: user.id,
          ordering: '-created_at',
          author: user.id,
          fields: ['id'],
        });
        console.log('commentsData:', commentsData);
        setPostsCount(commentsData.count || commentsData.results?.length || 0);
      } catch (error) {
        console.error('Erro ao buscar comentários:', error);
      }
    }

    // Dependência agora é user.id para garantir que a requisição seja feita assim que o id estiver disponível
    if (user?.id) {
      fetchCount();
    }
  }, [user?.id]);

  return (
    <BlankCard>
      <CardMedia
        component="img"
        image={'/images/backgrounds/profilebg.jpg'}
        alt="profilecover"
        width="100%"
        height="330px"
      />
      <Grid container spacing={0} justifyContent="center" alignItems="center">
        {/* Post | Followers | Following */}
        <Grid item lg={4} sm={12} md={5} xs={12} sx={{ order: { xs: '2', sm: '2', lg: '1' } }}>
          <Stack direction="row" textAlign="center" justifyContent="center" gap={6} m={3}>
            <Box>
              <Typography color="text.secondary">
                <IconFileDescription width="20" />
              </Typography>
              <Typography variant="h4" fontWeight="600">
                {postsCount}
              </Typography>
              <Typography color="textSecondary" variant="h6" fontWeight={400}>
                Postagens
              </Typography>
            </Box>
            <Box>
              <Typography color="text.secondary">
                <IconUserCheck width="20" />
              </Typography>
              <Typography variant="h4" fontWeight="600">
                {departmentCount}
              </Typography>
              <Typography color="textSecondary" variant="h6" fontWeight={400}>
                Colegas
              </Typography>
            </Box>
          </Stack>
        </Grid>
        {/* about profile */}
        <Grid item lg={4} sm={12} xs={12} sx={{ order: { xs: '1', sm: '1', lg: '2' } }}>
          <Box
            display="flex"
            alignItems="center"
            textAlign="center"
            justifyContent="center"
            sx={{ mt: '-85px' }}
          >
            <Box>
              <ProfileImage>
                <Avatar
                  src={user?.profile_picture || '/images/default-avatar.png'}
                  alt={user?.complete_name || 'Usuário'}
                  sx={{
                    borderRadius: '50%',
                    width: '100px',
                    height: '100px',
                    border: '4px solid #fff',
                  }}
                />
              </ProfileImage>
              <Box mt={1}>
                <Typography fontWeight="600" variant="h5">
                  {user?.complete_name || 'Nome do Usuário'}
                </Typography>
                <Typography color="textSecondary" variant="h6" fontWeight="400">
                  {user?.employee_data?.role || 'Cargo'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        {/* friends following buttons */}
        <Grid item lg={4} sm={12} xs={12} sx={{ order: { xs: '3', sm: '3', lg: '3' } }}>
          <Stack direction="row" gap={2} alignItems="center" justifyContent="center" my={2}>
            <Fab size="small" color="primary" sx={{ backgroundColor: '#1877F2' }}>
              <IconBrandFacebook size="16" />
            </Fab>
            <Fab size="small" color="primary" sx={{ backgroundColor: '#1DA1F2' }}>
              <IconBrandTwitter size="18" />
            </Fab>
            <Fab size="small" color="success" sx={{ backgroundColor: '#EA4C89' }}>
              <IconBrandDribbble size="18" />
            </Fab>
            <Fab size="small" color="error" sx={{ backgroundColor: '#CD201F' }}>
              <IconBrandYoutube size="18" />
            </Fab>
            {(isOwner || loggedUser.is_superuser) && (
              <Link href={`/apps/users/${user.id}/update`}>
                <Button color="primary" variant="contained">
                  Alterar Cadastro
                </Button>
              </Link>
            )}
          </Stack>
        </Grid>
      </Grid>
      {user.employee?.department && <ProfileTab />}
    </BlankCard>
  );
};

export default ProfileBanner;
