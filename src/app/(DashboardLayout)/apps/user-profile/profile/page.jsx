'use client';
import Grid from '@mui/material/Grid'
import PageContainer from '@/app/components/container/PageContainer';

import ProfileBanner from '@/app/components/apps/userprofile/profile/ProfileBanner';
import IntroCard from '@/app/components/apps/userprofile/profile/IntroCard';
import PhotosCard from '@/app/components/apps/userprofile/profile/PhotosCard';
import Post from '@/app/components/apps/userprofile/profile/Post';
import { useSelector } from 'react-redux';
import { capitalizeWords } from '@/utils/capitalizeWords';


const UserProfile = () => {
  const user = useSelector((state) => state.user?.user);

  return (
    <PageContainer title={capitalizeWords(user.first_name) + ' ' +capitalizeWords(user.last_name)} description="this is Profile">

      <Grid container spacing={3}>
        <Grid item sm={12}>
          <ProfileBanner user={user} />
        </Grid>

        {/* intro and Photos Card */}
        <Grid item sm={12} lg={5} xs={12}>
          <Grid container spacing={3}>
            <Grid item sm={12}>
              <IntroCard user={user} />
            </Grid>
            <Grid item sm={12}>
              <PhotosCard user={user} />
            </Grid>
          </Grid>
        </Grid>
        {/* Posts Card */}
        <Grid item sm={12} lg={7} xs={12}>
          <Post user={user} />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default UserProfile;
