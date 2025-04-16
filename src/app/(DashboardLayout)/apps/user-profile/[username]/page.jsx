'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Grid, Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import PageContainer from '@/app/components/container/PageContainer';
import ProfileBanner from '@/app/components/apps/userprofile/profile/ProfileBanner';
import IntroCard from '@/app/components/apps/userprofile/profile/IntroCard';
import Post from '@/app/components/apps/userprofile/profile/Post';
import { capitalizeWords } from '@/utils/capitalizeWords';
import userService from '@/services/userService';
import EmailSignature from '@/app/components/apps/users/signature/UserEmailSignature';
import { useSelector } from 'react-redux';

const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const currentUser = useSelector((state) => state.user.user);
  const isCurrentUser = currentUser.username === username;

  useEffect(() => {
    async function fetchUser() {
      if (username) {
        const data = await userService.index({
          username__in: username,
          expand: 'employee.branch.address,employee.role,phone_numbers',
          fields: 'id,complete_name,first_name,last_name,email,employee.branch.address.complete_address,phone_numbers.area_code,phone_numbers.phone_number,phone_numbers.is_main,employee.role.name,employee_data.contract_type,employee_data.branch,employee_data.department,employee_data.role,employee_data.user_manager,employee_data.hire_date,employee_data.resignation_date,employee_data.related_branches,is_superuser,is_active,date_joined,birth_date,gender,profile_picture,username,person_type,addresses.id,addresses.str,user_types.name,str'
        });
        if (data && data.results && data.results.length > 0) {
          setUser(data.results[0]);
        }
      }
    }
    fetchUser();
  }, [username]);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
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
              {user.email.includes('@resolvenergiasolar.com') && (isCurrentUser || currentUser.is_superuser) && <Grid container justifyContent="center" mt={2}>
                <Grid item>
                  <Button variant="outlined" color="primary" onClick={handleOpenModal}>
                    Gerar Assinatura de E-mail
                  </Button>
                </Grid>
              </Grid>}
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={12} lg={7} xs={12}>
          <Post user={user} />
        </Grid>
      </Grid>
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogContent>
          <EmailSignature user={user} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default UserProfile;
