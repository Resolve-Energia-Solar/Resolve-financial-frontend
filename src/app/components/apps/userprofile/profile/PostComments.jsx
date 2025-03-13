import React, { useState } from 'react';
import { Avatar, Box, Button, Fab, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { IconArrowBackUp, IconCircle, IconThumbUp } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import commentService from '@/services/commentService';

const PostComments = ({ comment, post }) => {
  const [replyTxt, setReplyTxt] = useState('');
  const [showReply, setShowReply] = useState(false);
  const [replies, setReplies] = useState([]);
  const user = useSelector(state => state.user?.user);

  const onSubmit = async (postId, commentId, reply) => {
    try {
      const replyData = {
        object_id: postId,
        author_id: user.id,
        text: reply,
        parent_id: commentId, // vincula o reply ao comentário
      };
      const novoReply = await commentService.createComment(replyData);
      setReplies([...replies, novoReply]);
      setReplyTxt('');
      setShowReply(false);
    } catch (error) {
      console.error('Erro ao criar reply:', error);
    }
  };

  return (
    <>
      <Box
        mt={2}
        p={3}
        sx={{
          borderColor: theme => theme.palette.divider,
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      >
        <Stack direction="row" gap={2} alignItems="center">
          <Avatar alt={comment.author.complete_name} src={comment.author.profile_picture} sx={{ width: '33px', height: '33px' }} />
          <Typography variant="h6">{comment.author.complete_name}</Typography>
          <Typography variant="caption" color="textSecondary">
            <IconCircle size="7" fillOpacity="0.1" strokeOpacity="0.1" /> {new Date(comment.created_at).toLocaleString()}
          </Typography>
        </Stack>
        <Box py={2}>
          <Typography color="textSecondary">{comment.text}</Typography>
        </Box>
        <Stack direction="row" gap={1} alignItems="center">
          <Tooltip title="Like" placement="top">
            <Fab size="small" color="inherit">
              <IconThumbUp size="16" />
            </Fab>
          </Tooltip>
          <Typography variant="body1" fontWeight={600}>
            {comment.likes ? comment.likes.value : 0}
          </Typography>
          <Tooltip title="Reply" placement="top">
            <Fab sx={{ ml: 2 }} size="small" color="info" onClick={() => setShowReply(!showReply)}>
              <IconArrowBackUp size="16" />
            </Fab>
          </Tooltip>
          <Typography variant="body1" fontWeight={600}>{replies.length}</Typography>
        </Stack>
      </Box>
      {replies.map(reply => (
        <Box pl={4} key={reply.id}>
          <Box
            mt={2}
            p={3}
            sx={{
              borderColor: theme => theme.palette.grey[100],
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <Stack direction="row" gap={2} alignItems="center">
              <Avatar alt={reply.author.complete_name} src={reply.author.profile_picture} sx={{ width: '33px', height: '33px' }} />
              <Typography variant="h6">{reply.author.complete_name}</Typography>
              <Typography variant="caption" color="textSecondary">
                <IconCircle size="7" fillOpacity="0.1" strokeOpacity="0.1" /> {new Date(reply.created_at).toLocaleString()}
              </Typography>
            </Stack>
            <Box py={2}>
              <Typography color="textSecondary">{reply.text}</Typography>
            </Box>
          </Box>
        </Box>
      ))}
      {showReply && (
        <Box p={2}>
          <Stack direction="row" gap={2} alignItems="center">
            <Avatar alt={user?.complete_name} src={user?.profile_picture} sx={{ width: '33px', height: '33px' }} />
            <TextField
              placeholder="Reply"
              value={replyTxt}
              onChange={e => setReplyTxt(e.target.value)}
              variant="outlined"
              fullWidth
            />
            <Button variant="contained" onClick={() => onSubmit(post.id, comment.id, replyTxt)}>
              Reply
            </Button>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default PostComments;
