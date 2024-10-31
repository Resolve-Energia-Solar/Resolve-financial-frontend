import { Card, CardContent, Typography, Checkbox, Box, IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const KitSelectionCard = ({ kit, selected, onSelect }) => {
  const theme = useTheme();

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="body2">
            <strong>Inversor:</strong> {kit.inversors_model?.description || 'Não especificado'}
          </Typography>
          <Typography variant="body2">
            <strong>Quantidade de Inversores:</strong> {kit.inversor_amount || 'Não especificado'}
          </Typography>
          <Typography variant="body2">
            <strong>Quantidade de Módulos:</strong> {kit.modules_amount || 'Não especificado'}
          </Typography>
          <Typography variant="body2">
            <strong>Telhado:</strong> {kit.roof_type?.name || 'Não especificado'}
          </Typography>
          <Typography variant="body2">
            <strong>Descrição Técnica:</strong>{' '}
            {kit.inversors_model?.technical_description || 'Não disponível'}
          </Typography>
        </Box>
      }
      arrow
      placement="top"
    >
      <Card
        variant="outlined"
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.background.default})`,
          borderRadius: '16px',
          borderColor: selected ? theme.palette.primary.main : theme.palette.grey[300],
          borderWidth: selected ? 2 : 1,
          position: 'relative',
          cursor: 'pointer',
          boxShadow: selected ? 6 : 2,
          transition: '0.3s',
          '&:hover': {
            boxShadow: 8,
            transform: 'scale(1.03)',
            borderColor: theme.palette.primary.main,
          },
          overflow: 'hidden',
        }}
        onClick={() => onSelect(kit.id)}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
          }}
        />
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 3,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
          >{`Kit Solar ID: ${kit.id}`}</Typography>
          <Typography
            variant="subtitle1"
            color="text.primary"
            fontWeight="bold"
            textAlign="center"
            sx={{ mb: 1 }}
          >
            {`Preço: R$ ${parseFloat(kit.price).toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          </Typography>
        </CardContent>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onSelect(kit.id);
          }}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: selected ? theme.palette.primary.main : theme.palette.grey[400],
            zIndex: 1,
          }}
        >
          <Checkbox checked={selected} />
        </IconButton>
      </Card>
    </Tooltip>
  );
};

export default KitSelectionCard;
