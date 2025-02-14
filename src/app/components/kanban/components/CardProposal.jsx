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

export default function MediaControlCard() {
    const theme = useTheme();

    return (
        <Card sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            py: 1,
            px: 1,
            border: '1px solid #EAEAEA', 
            borderRadius: '10px',
            boxShadow: 'none' // Remove a sombra do Card
        }}>
            {/* CardMedia (imagem) */}
            <CardMedia
                component="img"
                sx={{ width: 80, height: 80, m: 1 }}
                image="https://cdn-icons-png.flaticon.com/512/5047/5047881.png"
                alt="material-ui logo"
            />

            {/* Conteúdo do card */}
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1}}>
                <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
                    {/* Chip de status alinhado com o texto */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography component="div" variant="h5">
                            R$18.450
                        </Typography>
                        <Chip label="Em avaliação" sx={{ backgroundColor: '#E9F9E6', color: '#303030', fontSize: '10px' }} />
                    </Box>

                    <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        5 placas solares
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        component="p"
                        sx={{ color: 'text.secondary', fontSize: '12px', color: '#ADADAD' }}
                    >
                        #184639
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton aria-label="editar" size="small">
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton aria-label="deletar" size="small">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </CardContent>
            </Box>
        </Card>
    );
}