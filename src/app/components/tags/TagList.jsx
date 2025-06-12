import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import tagService from '@/services/tagService';
import getContentType from '@/utils/getContentType';

const TagList = ({ appLabel, model, objectId }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    const fetchTags = async () => {
      try {
        const contentTypeId = await getContentType(appLabel, model);
        const data = await tagService.index({
          content_type: contentTypeId,
          object_id: objectId,
          limit: 100,
          page: 1,
        });
        setTags(data.results);
      } catch (error) {
        console.error('Erro ao buscar tags:', error);
      }
    };
    fetchTags();
    setLoading(false);
  }, [appLabel, model, objectId]);

  return (
    <Grid container spacing={1} alignItems="center" overflow="auto">
      {loading ? (
        <Grid item xs={12}>
          <Chip
            label={'Carregando...'}
            variant="outlined"
            sx={{
              backgroundColor: 'transparent',
              textTransform: 'capitalize',
              borderRadius: '16px',
              fontWeight: 600,
              fontSize: '0.875rem',
              padding: '4px 12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'grey',
                color: '#fff',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
              },
            }}
          />
        </Grid>
      ) : (
        tags?.map(({ id, tag, color }) => (
          <Grid item key={id}>
            <Chip
              label={tag}
              variant="outlined"
              sx={{
                backgroundColor: color,
                color: theme.palette.getContrastText(color),
                border: `1px solid ${color}`,
                borderRadius: '16px',
                textTransform: 'capitalize',
                fontWeight: 600,
                fontSize: '0.875rem',
                padding: '4px 12px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-4px)',
                  transition: 'all 0.5s ease',
                  cursor: 'text',
                },
              }}
            />
          </Grid>
        )))}
    </Grid>
  );
};

export default TagList;
