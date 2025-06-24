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
  fullName = false,
  backgroundColor = 'transparent',
  orientation = 'horizontal',
}) {
  const { loading, error, userData: fetched } = useUser(userId);
  const user = fetched || initialData;
  const isLoading = loading && !initialData;
  const hasError = !!error && !initialData;
  const theme = useTheme();

  const textColor = useMemo(() => {
    return backgroundColor === 'transparent'
      ? theme.palette.getContrastText(theme.palette.background.default)
      : theme.palette.getContrastText(backgroundColor);
  }, [backgroundColor, theme]);

  const mainPhone = useMemo(() => {
    if (!showPhone || !user?.phone_numbers) return null;
    return user.phone_numbers.find(p => p.is_main) || user.phone_numbers[0];
  }, [showPhone, user]);

  const nameParts = useMemo(() => {
    if (!user?.complete_name) return ['', ''];
    if (fullName) return [user.complete_name, ''];
    const parts = user.complete_name.trim().split(' ');
    return parts.length > 1
      ? [parts[0], parts[parts.length - 1]]
      : [parts[0], ''];
  }, [user]);

  const isVertical = orientation === 'vertical';
  const containerDirection = isVertical ? 'column' : 'row';
  const contentSpacing = isVertical ? { mt: 2 } : { ml: 2 };
  const containerSx = isVertical
    ? { textAlign: 'center', width: 150, aspectRatio: '3/4', overflow: 'hidden' }
    : { minWidth: 250 };

  const textSx = {
    fontSize: '0.8rem',
    color: textColor,
    mt: isVertical ? 1 : 0.5,
    width: isVertical ? '100%' : 'auto',
    whiteSpace: 'normal',
    overflowWrap: 'break-word',
    wordBreak: isVertical ? 'break-all' : 'normal',
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection={containerDirection}
        alignItems="center"
        p={2}
        bgcolor={backgroundColor}
        sx={containerSx}
      >
        <Skeleton variant="circular" width={64} height={64} />
        <Box
          {...contentSpacing}
          display="flex"
          flexDirection="column"
          alignItems={isVertical ? 'center' : 'flex-start'}
          sx={{ width: isVertical ? '100%' : 'auto' }}
        >
          <Skeleton width={isVertical ? 120 : 100} height={20} />
          <Skeleton width={isVertical ? 100 : 80} height={18} sx={{ mt: 0.5 }} />
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
      flexDirection={containerDirection}
      alignItems="center"
      p={2}
      borderRadius={2}
      bgcolor={backgroundColor}
      sx={containerSx}
    >
      <MuiLink
        component={Link}
        href={`/apps/user-profile/${user.username}`}
        underline="none"
        aria-label={`Perfil de ${user.complete_name}`}
      >
        <Avatar sx={{ width: 64, height: 64, bgcolor: textColor + '33' }} alt={user.complete_name}>
          {user.profile_picture ? (
            <Image src={user.profile_picture} alt={user.complete_name} width={64} height={64} />
          ) : (
            user.complete_name.charAt(0).toUpperCase()
          )}
        </Avatar>
      </MuiLink>

      <Box
        {...contentSpacing}
        display="flex"
        flexDirection="column"
        alignItems={isVertical ? 'center' : 'flex-start'}
        sx={{ width: isVertical ? '100%' : 'auto' }}
      >
        {isVertical ? (
          <>
            <Typography sx={{ fontWeight: 'bold', color: textColor, fontSize: '0.9rem' }}>
              {nameParts[0]}
            </Typography>
            {nameParts[1] && (
              <Typography sx={{ fontWeight: 'bold', color: textColor, fontSize: '0.9rem', mt: 0.5 }}>
                {nameParts[1]}
              </Typography>
            )}
          </>
        ) : (
          <Typography sx={{ fontWeight: 'bold', color: textColor, fontSize: '0.9rem', width: '100%' }}>
            {`${nameParts[0]} ${nameParts[1]}`.trim()}
          </Typography>
        )}

        {showEmail && (
          <MuiLink href={user.email ? `mailto:${user.email}` : '#'} underline="none">
            <Typography sx={textSx}>
              {user.email || 'Sem e-mail'}
            </Typography>
          </MuiLink>
        )}

        {showPhone && (
          <MuiLink href={mainPhone ? `tel:${mainPhone.phone_number}` : '#'} underline="none">
            <Typography sx={textSx}>
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
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
};

export default UserCard;