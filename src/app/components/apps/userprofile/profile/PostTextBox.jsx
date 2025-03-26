import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { IconPhoto, IconNotebook } from '@tabler/icons-react';
import ChildCard from '../../../../components/shared/ChildCard';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import commentService from '@/services/commentService';
import getContentType from '@/utils/getContentType';

export const PostTextBox = ({ onPostCreated }) => {
  const [text, setText] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state.user.user);

  const handlePost = async () => {
    if (!text.trim()) {
      enqueueSnackbar('Digite algo', { variant: 'warning' });
      return;
    }
    try {
      const contentType = await getContentType('accounts', 'user');
      const commentData = {
        text,
        content_type_id: contentType,
        object_id: user.id,
        author_id: user.id,
      };
      await commentService.create(commentData);
      enqueueSnackbar('Publicado com sucesso!', { variant: 'success' });
      setText('');
      // Chama a função para atualizar a lista de posts, se fornecida
      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error('Erro ao postar comentário:', error);
      const errorMessage = error.response?.data?.detail || 'Erro ao postar comentário';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  return (
    <ChildCard>
      <TextField
        id="outlined-multiline-static"
        placeholder="Compartilhe seus pensamentos..."
        multiline
        fullWidth
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Stack direction="row" gap={1} mt={2} alignItems="center">
        {/* <Fab size="small" color="primary">
          <IconPhoto size="16" />
        </Fab>
        <Button variant="text" color="inherit" component="label">
          <input hidden accept="image/*" multiple type="file" />
          Foto / Vídeo
        </Button>
        <Button
          variant="text"
          color="inherit"
          component="label"
          startIcon={
            <Fab size="small" color="secondary">
              <IconNotebook size="16" />
            </Fab>
          }
        >
          Artigo
          <input hidden accept="image/*" multiple type="file" />
        </Button> */}
        <Button variant="contained" color="primary" sx={{ ml: 'auto' }} onClick={handlePost}>
          Postar
        </Button>
      </Stack>
    </ChildCard>
  );
};
