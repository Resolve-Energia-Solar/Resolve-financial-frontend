import React from 'react';
import { Box, Stack, Skeleton, Divider } from '@mui/material';
import BlankCard from '../../../shared/BlankCard';

const PostSkeleton = () => {
    return (
        <BlankCard>
            <Box p={3}>
                {/* Cabeçalho: Avatar e textos */}
                <Stack direction="row" gap={2} alignItems="center">
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box>
                        <Skeleton variant="text" width={100} />
                        <Skeleton variant="text" width={80} />
                    </Box>
                </Stack>

                {/* Conteúdo do post */}
                <Box py={2}>
                    <Skeleton variant="text" width="100%" />
                    <Skeleton variant="text" width="95%" />
                    <Skeleton variant="text" width="90%" />
                </Box>

                {/* Área de interação (ex.: comentários) */}
                <Skeleton variant="rectangular" width="40%" height={20} />
            </Box>

            <Divider />

            <Box p={2}>
                <Stack direction="row" gap={2} alignItems="center">
                    <Skeleton variant="circular" width={33} height={33} />
                    <Skeleton variant="rectangular" width="80%" height={40} />
                </Stack>
            </Box>
        </BlankCard>
    );
};

export default PostSkeleton;
