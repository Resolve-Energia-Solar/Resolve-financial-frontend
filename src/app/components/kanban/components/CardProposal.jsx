import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconEye, IconPencil } from '@tabler/icons-react';

export default function ProposalCard({
    image,
    price,
    status,
    statusColor,
    description,
    reference,
    onEdit,
    onDelete
}) {
    const theme = useTheme();

    return (
        <Card sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            py: 1,
            px: 1,
            border: '1px solid #EAEAEA', 
            borderRadius: '10px',
            boxShadow: 'none'
        }}>
            <CardMedia
                component="img"
                sx={{ width: 80, height: 80, m: 1 }}
                image={image}
                alt="proposal image"
            />

            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography component="div" sx={{ fontSize: '24px', fontWeight: "700", color: "#303030" }}>
                            {price}
                        </Typography>
                        <Chip label={status} sx={{ backgroundColor: statusColor, color: '#303030', fontSize: '10px' }} />
                    </Box>

                    <Typography component="div" sx={{ fontSize: '12px', fontWeight: "400", color: "#303030" }}>
                        {description}
                    </Typography>

                    <Typography variant="subtitle1" component="p" sx={{ color: '#ADADAD', fontSize: '12px' }}>
                        {reference}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton aria-label="editar" size="small" onClick={onEdit}>
                            <IconPencil fontSize="small" />
                        </IconButton>
                        <IconButton aria-label="deletar" size="small" onClick={onDelete}>
                            <IconEye fontSize="small" />
                        </IconButton>
                    </Box>
                </CardContent>
            </Box>
        </Card>
    );
}
