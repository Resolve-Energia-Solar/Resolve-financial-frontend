// components/UserCard.jsx
import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme, Box, Typography, Avatar, Link as MuiLink, Skeleton } from '@mui/material';
import useUser from '@/hooks/users/useUser';

const UserCard = memo(function UserCard({
  userId,
  userData: initialData,
  showEmail = true,
  showPhone = false,
  backgroundColor = 'transparent',
}) {
  const { loading, error, userData: fetched } = useUser(userId);
  const user = fetched || initialData;
  const isLoading = loading && !initialData;
  const hasError = !!error && !initialData;
  const theme = useTheme();

  const textColor = useMemo(() => {
    if (backgroundColor === 'transparent') {
      return theme.palette.getContrastText(theme.palette.background.default);
    }
    return theme.palette.getContrastText(backgroundColor);
  }, [backgroundColor, theme]);

  const mainPhone = useMemo(() => {
    if (!showPhone || !user?.phone_numbers) return null;
    return user.phone_numbers.find(p => p.is_main) || user.phone_numbers[0];
  }, [showPhone, user]);

  const displayName = useMemo(() => {
    if (!user?.complete_name) return '';
    const parts = user.complete_name.trim().split(' ');
    return parts.length > 1
      ? `${parts[0]} ${parts[parts.length - 1]}`
      : parts[0];
  }, [user]);

  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" p={2} bgcolor={backgroundColor}>
        <Skeleton variant="circular" width={64} height={64} />
        <Box ml={2} display="flex" flexDirection="column">
          <Skeleton width={100} height={20} />
          <Skeleton width={80} height={18} sx={{ mt: 0.5 }} />
        </Box>
      </Box>
    );
  }

  if (hasError || !user) {
    return (
      <Typography color="error" sx={{ textAlign: 'center', p: 2 }}>
        Erro ao carregar usuário.
      </Typography>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      p={2}
      borderRadius={2}
      bgcolor={backgroundColor}
      sx={{ minWidth: 250 }}
    >
      <MuiLink
        component={Link}
        href={`/apps/user-profile/${user.username}`}
        underline="none"
        aria-label={`Perfil de ${displayName}`}
      >
        <Avatar sx={{ width: 64, height: 64, bgcolor: textColor + '33' }} alt={displayName}>
          {user.profile_picture ? (
            <Image src={user.profile_picture} alt={displayName} width={64} height={64} />
          ) : (
            displayName.charAt(0).toUpperCase()
          )}
        </Avatar>
      </MuiLink>

      <Box ml={2}>
        <Typography sx={{ fontWeight: 'bold', color: textColor, fontSize: '0.9rem' }}>
          {displayName}
        </Typography>

        {showEmail && (
          <MuiLink href={user.email ? `mailto:${user.email}` : '#'} underline="none">
            <Typography sx={{ fontSize: '0.8rem', color: textColor }}>
              {user.email || 'Sem e-mail'}
            </Typography>
          </MuiLink>
        )}

        {showPhone && (
          <MuiLink href={mainPhone ? `tel:${mainPhone.phone_number}` : '#'} underline="none">
            <Typography sx={{ fontSize: '0.8rem', color: textColor }}>
              {mainPhone
                ? `+${mainPhone.country_code} (${mainPhone.area_code}) ${mainPhone.phone_number}`
                : 'Sem telefone'}
            </Typography>
          </MuiLink>
        )}
      </Box>
    </Box>
  );
});

UserCard.propTypes = {
  userId: PropTypes.string,
  userData: PropTypes.object,
  showEmail: PropTypes.bool,
  showPhone: PropTypes.bool,
  backgroundColor: PropTypes.string,
};

export default UserCard;