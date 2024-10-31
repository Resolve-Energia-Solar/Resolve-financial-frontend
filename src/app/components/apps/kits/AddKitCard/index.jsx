import { Card, CardContent, Typography, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useTheme } from '@mui/material/styles';

const AddKitButton = ({ onClick }) => {
  const theme = useTheme();

  return (
    <Card
      onClick={onClick}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.background.default})`,
        borderRadius: '16px',
        border: `2px dashed ${theme.palette.primary.main}`,
        position: 'relative',
        cursor: 'pointer',
        boxShadow: 4,
        minHeight: '130px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: '0.3s',
        '&:hover': {
          boxShadow: 6,
          transform: 'scale(1.05)',
          borderColor: theme.palette.primary.dark,
        },
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 1,
          textAlign: 'center',
        }}
      >
        <AddCircleOutlineIcon sx={{ fontSize: 30, color: theme.palette.primary.main }} />
        <Typography variant="h6" fontWeight="bold" color={theme.palette.primary.main}>
          Adicionar Kit Personalizado
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AddKitButton;
