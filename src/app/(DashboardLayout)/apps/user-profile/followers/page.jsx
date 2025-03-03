'use client';
import Grid from '@mui/material/Grid'
import PageContainer from '@/app/components/container/PageContainer';
import ProfileBanner from '@/app/components/apps/userprofile/profile/ProfileBanner';
import FollowerCard from '@/app/components/apps/userprofile/followers/FollowerCard';
import { useSelector } from 'react-redux';

const Followers = () => {
  const user = useSelector((state) => state.user?.user);
  return (
    <PageContainer title="Followers" description="this is Followers">

      <Grid container spacing={3}>
        <Grid item sm={12}>
          <ProfileBanner user={user} />
        </Grid>
        <Grid item sm={12}>
          <FollowerCard />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Followers;
