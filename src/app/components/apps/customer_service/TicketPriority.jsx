import { ArrowDropUp, ArrowRightOutlined, ArrowDropDown } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

const TicketPriority = ({ priority }) => {
    if (!priority) return '-';

    const icons = {
        3: <ArrowDropUp color='error' />,
        2: <ArrowRightOutlined color='warning' />,
        1: <ArrowDropDown color='success' />
    };

    const labels = {
        3: 'Alta (3)',
        2: 'Média (2)',
        1: 'Baixa (1)'
    };

    const colors = {
        3: 'error.main',
        2: 'warning.main',
        1: 'success.main'
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {icons[priority]}
            <Typography variant="body2" color={colors[priority]}>
                {labels[priority]}
            </Typography>
        </Box>
    );
};

export default TicketPriority;