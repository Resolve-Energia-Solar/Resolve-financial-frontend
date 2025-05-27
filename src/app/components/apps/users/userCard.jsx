import React, { useState, useEffect } from 'react';
import { useTheme, Box, Typography, Avatar, Link, Skeleton } from '@mui/material';
import userService from '@/services/userService';

const UserCard = ({ userId, title, showEmail = true, showPhone = false }) => {
    const theme = useTheme();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const fieldsList = ['profile_picture', 'complete_name', 'username'];
                if (showEmail) fieldsList.push('email');
                if (showPhone) {
                    fieldsList.push(
                        'phone_numbers.is_main',
                        'phone_numbers.country_code',
                        'phone_numbers.area_code',
                        'phone_numbers.phone_number'
                    );
                }
                const params = { fields: fieldsList.join(',') };
                if (showPhone) {
                    params.expand = 'phone_numbers';
                }
                const data = await userService.find(userId, params);
                setUser(data);
            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchUser();
    }, [userId, showEmail, showPhone]);

    if (loading) {
        return (
            <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {title}
                </Typography>
                <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box>
                        <Skeleton width={120} />
                        <Skeleton width={200} />
                    </Box>
                </Box>
            </Box>
        );
    }

    if (error) return <Typography>Erro ao carregar usuário.</Typography>;
    if (!user) return null;

    const mainPhone =
        (user.phone_numbers && user.phone_numbers.find((phone) => phone.is_main)) ||
        (user.phone_numbers && user.phone_numbers[0]);

    return (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {title}
            </Typography>
            <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
                <Link
                    sx={{ color: theme.palette.getContrastText(theme.palette.background.default), textDecoration: 'none' }}
                    href={`/apps/user-profile/${user.username}`}
                >
                    <Avatar
                        src={user.profile_picture}
                        alt={user.complete_name}
                        sx={{ width: 40, height: 40 }}
                    />
                </Link>
                <Box>
                    <Typography>
                        <Link
                            sx={{ color: theme.palette.getContrastText(theme.palette.background.default), textDecoration: 'none' }}
                            href={`/apps/user-profile/${user.username}`}
                        >
                            {user.complete_name}
                        </Link>
                    </Typography>
                    {showEmail && (
                        user.email ? (
                            <Typography>
                                <Link
                                    sx={{ color: theme.palette.getContrastText(theme.palette.background.default), textDecoration: 'none' }}
                                    href={`mailto:${user.email}`}
                                >
                                    {user.email}
                                </Link>
                            </Typography>
                        ) : (
                            <Typography>Sem e-mail</Typography>
                        )
                    )}
                    {showPhone && (
                        mainPhone ? (
                            <Typography>
                                <Link
                                    sx={{ color: theme.palette.getContrastText(theme.palette.background.default), textDecoration: 'none' }}
                                    href={`tel:${mainPhone.phone_number}`}
                                >
                                    {`+${mainPhone.country_code} (${mainPhone.area_code}) ${mainPhone.phone_number}`}
                                </Link>
                            </Typography>
                        ) : (
                            <Typography>Sem telefone</Typography>
                        )
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default UserCard;
