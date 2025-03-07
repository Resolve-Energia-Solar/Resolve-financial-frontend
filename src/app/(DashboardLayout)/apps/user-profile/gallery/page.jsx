'use client';
import Grid from '@mui/material/Grid'
import PageContainer from '@/app/components/container/PageContainer';
import ProfileBanner from '@/app/components/apps/userprofile/profile/ProfileBanner';
import GalleryCard from '@/app/components/apps/userprofile/gallery/GalleryCard';
import { useSelector } from 'react-redux';

const Gallery = () => {
  const user = useSelector((state) => state.user?.user);
  return (
    <PageContainer title="Gallery" description="this is Gallery">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <ProfileBanner user={user} />
        </Grid>
        <Grid item sm={12}>
          <GalleryCard user={user} />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Gallery;
