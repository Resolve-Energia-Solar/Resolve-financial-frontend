import PropTypes from 'prop-types';
import { Box, Typography, Skeleton } from '@mui/material';

export function KPICard({ label, value, icon, color = '#fff', active = false, loading = false, format, onClick }) {
    const bg = loading ? 'transparent' : color;
    const border = active ? '2px solid green' : 'none';
    console.log('KPI Card', { label, value, icon, color, active, loading, format, onClick });
    return (<>
        {loading ? (
            <Skeleton
                sx={{
                    flex: '1 1 150px', p: 2,
                    borderRadius: 1, maxWidth: '200px',
                    aspectRatio: '4 / 2.5',
                    border, transform: 'scale(1.05)', transition: 'transform 0.2s',
                }}
            />
        ) : (
            <Box
                onClick={onClick}
                sx={{
                    flex: '1 1 150px', p: 2, display: 'flex',
                    flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', backgroundColor: bg,
                    borderRadius: 1, maxWidth: '200px',
                    aspectRatio: '4 / 2.5', textAlign: 'center',
                    border, cursor: onClick ? 'pointer' : 'default',
                    '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s' },
                }}
            >
                {icon}
                <Typography variant="subtitle2" sx={{ mt: 1 }}>{label}</Typography>
                <Typography variant="h6">
                    {format ? format(!!value) : value}
                </Typography>
            </Box>
        )}
    </>
    );
}

KPICard.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    icon: PropTypes.node.isRequired,
    color: PropTypes.string,
    active: PropTypes.bool,
    loading: PropTypes.bool,
    format: PropTypes.func,
    onClick: PropTypes.func,
};