import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { PictureAsPdf } from '@mui/icons-material';
import { IconPencil, IconTrash } from '@tabler/icons-react';

export default function AttachmentCard({
    onEdit,
    onDelete
}) {
    const theme = useTheme();

    return (
        <>
            <Typography variant="body1" sx={{ color: '#000000', fontSize: '14px', fontWeight: 'bold', mb: 1.5 }}>
                Conta de luz.pdf
            </Typography>
            <Card sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1.5,
                border: '1px solid #E7E7E7',
                borderRadius: '10px',
                boxShadow: 'none'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PictureAsPdf sx={{ color: '#EA3209', fontSize: 22 }} />
                    <Box>
                        <Typography variant="body1" sx={{ color: '#000000', fontSize: '14px', fontWeight: 'bold' }}>
                            Conta de luz.pdf
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#6D6D6D', fontSize: '12px', fontWeight: '400' }}>
                            500kb
                        </Typography>
                    </Box>
                </Box>
                <Box>
                    <IconButton onClick={onDelete}>
                        <IconTrash size={20} />
                    </IconButton>

                    <IconButton onClick={onEdit}>
                        <IconPencil size={20} />
                    </IconButton>
                </Box>
            </Card>
        </>
    );
}