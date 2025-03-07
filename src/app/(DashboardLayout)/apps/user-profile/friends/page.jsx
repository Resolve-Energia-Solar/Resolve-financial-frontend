'use client';
import Grid from '@mui/material/Grid'
import PageContainer from '@/app/components/container/PageContainer';
import ProfileBanner from '@/app/components/apps/userprofile/profile/ProfileBanner';
import FriendsCard from '@/app/components/apps/userprofile/friends/FriendsCard';
import { useSelector } from 'react-redux';

const Friends = () => {
  const user = useSelector((state) => state.user?.user);
  return (
    <PageContainer title="Colegas" description="Estas pessoas trabalham no mesmo setor que você!">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <ProfileBanner user={user} />
        </Grid>
        <Grid item sm={12}>
          <FriendsCard />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Friends;
