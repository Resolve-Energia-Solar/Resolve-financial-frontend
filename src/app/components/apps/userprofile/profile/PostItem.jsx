import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Box, Button, Divider, Fab, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { IconCircle, IconMessage2 } from '@tabler/icons-react';
import PostComments from './PostComments';
import BlankCard from '../../../shared/BlankCard';
import commentService from '@/services/commentService';
import getContentType from '@/utils/getContentType';

const PostItem = ({ post }) => {
  const user = useSelector(state => state.user?.user);
  const [comments, setComments] = useState([]);
  const [comText, setComText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const likes = post.likes || { like: false, value: 0 };

  // Busca os comentários via commentService.getComments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentContentType = await getContentType('core', 'comment');
        const commentsData = await commentService.getComments(post.id, commentContentType);
        setComments(commentsData.results || commentsData);
      } catch (error) {
        console.error('Erro ao buscar comentários:', error);
      }
    };
    if (post.id) fetchComments();
  }, [post.id]);

  const onSubmit = async (postId, commentText) => {
    try {
      const commentContentType = await getContentType('core', 'comment');
      const commentData = {
        object_id: postId,
        content_type_id: commentContentType,
        author_id: user.id,
        text: commentText,
      };
      await commentService.createComment(commentData);
      const updatedComments = await commentService.getComments(postId, commentContentType);
      setComments(updatedComments.results || updatedComments);
      setComText('');
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
    }
  };

  return (
    <BlankCard>
      <Box p={3}>
        <Stack direction="row" gap={2} alignItems="center">
          <Avatar alt={post?.author.complete_name} src={post?.author.profile_picture} />
          <Typography variant="h6">{post?.author.complete_name}</Typography>
          <Typography variant="caption" color="textSecondary">
            <IconCircle size="7" fillOpacity="0.1" strokeOpacity="0.1" /> {new Date(post.created_at).toLocaleString()}
          </Typography>
        </Stack>
        <Box py={2}>{post?.text}</Box>
        <Box>
          <Stack direction="row" gap={1} justifyContent="end" alignItems="center">
            <Tooltip title="Comentários" placement="top">
              <Fab
                sx={{ ml: 2 }}
                size="small"
                color="secondary"
                onClick={() => setShowComments(!showComments)}
              >
                <IconMessage2 size="16" />
              </Fab>
            </Tooltip>
            <Typography variant="body1" fontWeight={600}>
              {comments.length}
            </Typography>
          </Stack>
        </Box>
        {showComments && (
          <Box>
            {comments.length > 0 &&
              comments.map(comment => (
                <PostComments comment={comment} key={comment.id} post={post} />
              ))}
          </Box>
        )}
      </Box>
      <Divider />
      <Box p={2}>
        <Stack direction="row" gap={2} alignItems="center">
          <Avatar
            alt={post?.author.complete_name}
            src={post?.author.profile_picture}
            sx={{ width: '33px', height: '33px' }}
          />
          <TextField
            placeholder="Comentar"
            value={comText}
            onChange={e => setComText(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <Button variant="contained" onClick={() => onSubmit(post?.id, comText)}>
            Comentar
          </Button>
        </Stack>
      </Box>
    </BlankCard>
  );
};

export default PostItem;
