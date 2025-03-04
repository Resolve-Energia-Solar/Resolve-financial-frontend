import * as React from 'react';
import { PendingActionsOutlined, PictureAsPdf } from '@mui/icons-material';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { Box, Card, Typography, IconButton } from '@mui/material';

export default function AttachmentCard({ filename, filesize, onEdit, onDelete, pending = false, onClick }) {
    return (
        <>
            <Typography variant="body1" sx={{ color: '#000000', fontSize: '14px', fontWeight: 'bold', mb: 1.5 }}>
                {filename}
            </Typography>
            <Card
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1.5,
                    border: `1px ${pending ? 'dashed' : 'solid'} #E7E7E7`,
                    borderRadius: '10px',
                    boxShadow: 'none',
                    cursor: 'pointer',
                }}
                onClick={onClick}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PictureAsPdf sx={{ color: '#EA3209', fontSize: 22 }} />
                    <Box>
                        <Typography variant="body1" sx={{ color: '#000000', fontSize: '14px', fontWeight: 'bold' }}>
                            {filename}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#6D6D6D', fontSize: '12px', fontWeight: '400' }}>
                            {filesize}
                        </Typography>
                    </Box>
                </Box>
                {!pending && (
                    <Box>
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                        >
                            <IconTrash size={20} />
                        </IconButton>

                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                        >
                            <IconPencil size={20} />
                        </IconButton>
                    </Box>
                )}

                {pending && (
                    <Box>
                        <IconButton
                        >
                            <PendingActionsOutlined size={20} />
                        </IconButton>
                    </Box>
                )}
            </Card>
        </>
    );
}
