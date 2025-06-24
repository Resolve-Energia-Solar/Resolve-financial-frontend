import React from 'react';
import { Box, Skeleton, Paper } from '@mui/material';

/**
 * Skeleton placeholder for Kanban columns and cards during initial loading,
 * styled to match the JourneyKanban layout.
 *
 * @param {object} props
 * @param {number} props.columns Number of columns to render skeletons for (default 7).
 * @param {number} props.itemsPerColumn Number of card skeletons per column (default 3).
 */
const KanbanSkeleton = ({ columns = 7, itemsPerColumn = 3 }) => {
    const columnArray = Array.from({ length: columns });
    const itemArray = Array.from({ length: itemsPerColumn });

    return (
        <Box display="flex" alignItems="flex-start" gap={2} p={2} overflow="auto">
            {columnArray.map((_, colIndex) => (
                <Paper
                    key={colIndex}
                    elevation={1}
                    sx={{
                        minWidth: 280,
                        maxWidth: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        p: 2,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        height: '100%'
                    }}
                >
                    {/* Column title skeleton */}
                    <Skeleton variant="text" width="60%" height={28} />

                    {/* Cards skeletons */}
                    <Box mt={2} flexGrow={1} display="flex" flexDirection="column">
                        {itemArray.map((__, itemIndex) => (
                            <Skeleton
                                key={itemIndex}
                                variant="rectangular"
                                height={110}
                                sx={{ mb: 2, borderRadius: 2 }}
                                animation="wave"
                            />
                        ))}
                    </Box>
                </Paper>
            ))}
        </Box>
    );
};

export default KanbanSkeleton;