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
                sx={{ width: 80, height: 80, m: 1 }}
                image={image}
                alt="proposal image"
            />

            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography component="div" sx={{ fontSize: '24px', fontWeight: "700", color: "#303030" }}>
                                {price}
                            </Typography>
                            
                        </Box>

                        <Typography component="div" sx={{ fontSize: '12px', fontWeight: "400", color: "#303030" }}>
                            {description}
                        </Typography>

                        <Typography component="p" sx={{ fontSize: '12px', fontWeight: "400", color: "#ADADAD" }}>
                            {reference}
                        </Typography>
                    </Grid>

                    <Grid item xs={4}>
                        <Box xs={2} sx={{ display: 'flex', justifyContent: 'flex-end'}}>
                            <Chip label={status} sx={{ backgroundColor: statusColor, color: '#303030', fontSize: '10px' }} />

                            <IconButton aria-label="editar" size="small" onClick={onEdit} sx={{ color: "#ADADAD"}}>
                                <IconPencil fontSize="small" />
                            </IconButton>
                            <IconButton aria-label="deletar" size="small" onClick={onDelete} sx={{ color: "#ADADAD"}}>
                                <IconEye fontSize="small" />
                            </IconButton>
                        </Box>
                    </Grid>
                </CardContent>
            </Box>
        </Card>
    );
}
