'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import PageContainer from '@/app/components/container/PageContainer';
import ProfileBanner from '@/app/components/apps/userprofile/profile/ProfileBanner';
import IntroCard from '@/app/components/apps/userprofile/profile/IntroCard';
// import PhotosCard from '@/app/components/apps/userprofile/profile/PhotosCard';
import Post from '@/app/components/apps/userprofile/profile/Post';
import { capitalizeWords } from '@/utils/capitalizeWords';
import userService from '@/services/userService';

const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      if (username) {
        const data = await userService.getUser({ filters: { username__in: username, expand: 'addresses,user_types', fields: 'id,employee_data.contract_type,employee_data.branch,employee_data.department,employee_data.role,employee_data.user_manager,employee_data.hire_date,employee_data.resignation_date,employee_data.related_branches,is_superuser,is_active,date_joined,complete_name,birth_date,gender,profile_picture,username,email,person_type,addresses.id,addresses.str,user_types.name,str' } });
        if (data && data.results && data.results.length > 0) {
          setUser(data.results[0]);
        }
      }
    }
    fetchUser();
  }, [username]);

  console.log('user', user);

  if (!user) return <div>Carregando...</div>;

  return (
    <PageContainer
      title={capitalizeWords(user.first_name) + ' ' + capitalizeWords(user.last_name)}
      description="Perfil do usuário"
    >
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <ProfileBanner user={user} />
        </Grid>
        <Grid item sm={12} lg={5} xs={12}>
          <Grid container spacing={3}>
            <Grid item sm={12}>
              <IntroCard user={user} />
            </Grid>
            {/* <Grid item sm={12}>
              <PhotosCard user={user} />
            </Grid> */}
          </Grid>
        </Grid>
        <Grid item sm={12} lg={7} xs={12}>
          <Post user={user} />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default UserProfile;
