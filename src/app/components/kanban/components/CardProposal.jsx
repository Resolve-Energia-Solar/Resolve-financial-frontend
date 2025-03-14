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
import { Grid } from '@mui/material';

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
                sx={{ width: 60, height: 60, m: 1 }}
                image={image}
                alt="proposal image"
            />
        
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        {/* Left Column: Price and Description */}
                        <Grid item xs={8}>
                            <Typography sx={{ fontSize: '24px', fontWeight: "700", color: "#303030" }}>
                                {price}
                            </Typography>
                            <Typography sx={{ fontSize: '12px', fontWeight: "400", color: "#303030", mt: 0.5 }}>
                                {description}
                            </Typography>
                            <Typography sx={{ fontSize: '12px', fontWeight: "400", color: "#ADADAD", mt: 0.5 }}>
                                {reference}
                            </Typography>
                        </Grid>
        
                        {/* Right Column: Status and Icons */}
                        <Grid item xs={4} sx={{ display: 'flex', flexDirection: "column", alignItems: 'center', gap: 1 }}>
                            <Grid item xs={12}>
                                <Chip label={status} sx={{ backgroundColor: statusColor, color: '#303030', fontSize: '10px' }} />
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', flexDirection: "row", alignItems: 'center', gap: 1 }}>
                                <IconButton aria-label="editar" size="small" onClick={onEdit} sx={{ color: "#ADADAD" }}>
                                    <IconPencil fontSize="small" />
                                </IconButton>
                                <IconButton aria-label="deletar" size="small" onClick={onDelete} sx={{ color: "#ADADAD" }}>
                                    <IconEye fontSize="small" />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Box>
        </Card>
        
    );
}
