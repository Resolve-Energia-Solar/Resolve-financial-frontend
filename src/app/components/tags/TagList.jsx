import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import tagService from '@/services/tagService';
import getContentType from '@/utils/getContentType';

const TagList = ({ appLabel, model, objectId }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const contentTypeId = await getContentType(appLabel, model);
        const data = await tagService.getTags({
          content_type: contentTypeId,
          object_id: objectId,
          limit: 100
        });
        setTags(data.results);
      } catch (error) {
        console.error('Erro ao buscar tags:', error);
      }
    };
    fetchTags();
  }, [appLabel, model, objectId]);

  return (
    <Grid container spacing={1} xs={12}>
      {tags.map(({ id, tag, color }) => (
        <Grid item key={id}>
          <Chip
            label={tag}
            variant="outlined"
            sx={{
              borderColor: color,
              color: color,
              backgroundColor: 'transparent',
              textTransform: 'capitalize',
              '&:hover': {
                backgroundColor: color,
                color: '#fff'
              }
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default TagList;
