import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Link, Skeleton } from '@mui/material';
import userService from '@/services/userService';

const UserCard = ({ userId, title }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await userService.find(userId, { fields: ['profile_picture', 'complete_name', 'email', 'username'] });
                setUser(data);
            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchUser();
    }, [userId]);

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

    return (
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {title}
            </Typography>
            <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
                <Avatar
                    src={user.profile_picture}
                    alt={user.complete_name}
                    sx={{ width: 40, height: 40 }}
                />
                <Box>
                    <Typography>
                        <Link sx={{ color: 'black', textDecoration: 'none' }} href={`/apps/user-profile/${user.username}`}>
                            {user.complete_name}
                        </Link>
                    </Typography>
                    <Typography>
                        <Link sx={{ color: 'black', textDecoration: 'none' }} href={`mailto:${user.email}`}>
                            {user.email}
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default UserCard;
