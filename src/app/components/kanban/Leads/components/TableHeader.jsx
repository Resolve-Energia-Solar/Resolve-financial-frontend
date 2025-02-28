import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const TableHeader = ({ title, totalItems, buttonLabel, onButtonClick }) => {
    const router = useRouter();

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <Typography sx={{ fontSize: '15px' }}>
                <span style={{ fontWeight: 'bold' }}>{title}:</span> {totalItems} registros
            </Typography>
            {onButtonClick && (
                <Button 
                    startIcon={<Add />} 
                    onClick={onButtonClick} 
                    sx={{
                        width: 74, 
                        height: 28, 
                        fontSize: '0.75rem', 
                        p: '4px 8px',
                        minWidth: 'unset', 
                        borderRadius: '4px', 
                        color: '#000', 
                        '&:hover': { backgroundColor: '#FFB800', color: '#000' },
                    }}
                >
                    {buttonLabel}

                </Button>
            )}

        </Box>



    );
};

export default TableHeader;