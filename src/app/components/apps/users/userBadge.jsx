import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Link, Skeleton } from '@mui/material';
import userService from '@/services/userService';

const UserBadge = ({ userId, showEmail = true, showPhone = false, backgroundColor = 'transparent' }) => {
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
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ padding: 2 }}>
                <Skeleton variant="circular" width={80} height={80} />
                <Skeleton width={150} sx={{ marginTop: 1 }} />
                <Skeleton width={120} />
            </Box>
        );
    }

    if (error) return <Typography>Erro ao carregar usuário.</Typography>;
    if (!user) return null;

    const mainPhone =
        (user.phone_numbers && user.phone_numbers.find((phone) => phone.is_main)) ||
        (user.phone_numbers && user.phone_numbers[0]);

    const nameParts = user.complete_name.split(' ');
    const displayName = `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;

    const getTextColor = (bgColor) => {
        const hexToRgb = (hex) => {
            let r = 0, g = 0, b = 0;
            if (hex.length === 4) {
                r = parseInt(hex[1] + hex[1], 16);
                g = parseInt(hex[2] + hex[2], 16);
                b = parseInt(hex[3] + hex[3], 16);
            }
            else if (hex.length === 7) {
                r = parseInt(hex[1] + hex[2], 16);
                g = parseInt(hex[3] + hex[4], 16);
                b = parseInt(hex[5] + hex[6], 16);
            }
            return { r, g, b };
        };

        const getBrightness = ({ r, g, b }) => {
            return (r * 299 + g * 587 + b * 114) / 1000;
        };

        if (bgColor === 'transparent') bgColor = '#ffffff';

        const { r, g, b } = hexToRgb(bgColor);
        const brightness = getBrightness({ r, g, b });
        return brightness > 128 ? 'black' : 'white';
    };

    const textColor = getTextColor(backgroundColor);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{
                padding: 1,
                border: '1px solid #ddd',
                borderRadius: 2,
                height: '100%',
                minWidth: '80px',
                backgroundColor: backgroundColor,
                aspectRatio: '3 / 4',
            }}
        >
            <Avatar
                src={user.profile_picture}
                alt={user.complete_name}
                sx={{
                    width: '85%',
                    height: 'auto',
                    mb: 0.5,
                }}
            />
            <Typography
                sx={{
                    marginTop: 1,
                    fontWeight: 'bold',
                    color: textColor,
                    lineHeight: 1.2,
                    textAlign: 'center',
                    px: 1,
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {displayName}
            </Typography>
            {showEmail && (
                user.email ? (
                    <Typography sx={{ color: textColor }}>
                        <Link
                            sx={{ color: textColor, textDecoration: 'none' }}
                            href={`mailto:${user.email}`}
                        >
                            {user.email}
                        </Link>
                    </Typography>
                ) : (
                    <Typography sx={{ color: textColor }}>Sem e-mail</Typography>
                )
            )}
            {showPhone && (
                mainPhone ? (
                    <Typography sx={{ color: textColor }}>
                        <Link
                            sx={{ color: textColor, textDecoration: 'none' }}
                            href={`tel:${mainPhone.phone_number}`}
                        >
                            {`+${mainPhone.country_code} (${mainPhone.area_code}) ${mainPhone.phone_number}`}
                        </Link>
                    </Typography>
                ) : (
                    <Typography sx={{ color: textColor }}>Sem telefone</Typography>
                )
            )}
        </Box>
    );
};

export default UserBadge;
