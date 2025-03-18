'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import PageContainer from '@/app/components/container/PageContainer';
import ProfileBanner from '@/app/components/apps/userprofile/profile/ProfileBanner';
import FriendsCard from '@/app/components/apps/userprofile/friends/FriendsCard';
import userService from '@/services/userService';

const Friends = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      if (username) {
        const data = await userService.getUser({ filters: { username__in: username } });
        if (data && data.results && data.results.length > 0) {
          setUser(data.results[0]);
        }
      }
    }
    fetchUser();
  }, [username]);

  if (!user) return <div>Carregando...</div>;

  return (
    <PageContainer title="Colegas" description="Estas pessoas trabalham no mesmo setor que você!">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <ProfileBanner user={user} />
        </Grid>
        <Grid item sm={12}>
          <FriendsCard user={user} />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Friends;
