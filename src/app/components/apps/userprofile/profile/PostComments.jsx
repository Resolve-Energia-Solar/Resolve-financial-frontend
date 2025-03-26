import React, { useState, useEffect } from 'react';
import { Avatar, Box, Button, Fab, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { IconArrowBackUp, IconCircle, IconThumbUp } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import commentService from '@/services/commentService';
import getContentType from '@/utils/getContentType';

const PostComments = ({ comment, post }) => {
  const [replyTxt, setReplyTxt] = useState('');
  const [showReply, setShowReply] = useState(false);
  const [replies, setReplies] = useState([]);
  const [repliesCount, setRepliesCount] = useState(0);
  const user = useSelector((state) => state.user?.user);
  const [commentContentType, setCommentContentType] = useState(null);

  useEffect(() => {
    const loadContentType = async () => {
      const contentType = await getContentType('core', 'comment');
      setCommentContentType(contentType);
    };
    loadContentType();
  }, []);

  useEffect(() => {
    if (commentContentType === null) return;
    const fetchReplies = async () => {
      try {
        const response = await commentService.index(comment.id, commentContentType, {
          fields: 'id,text,author.id,author.profile_picture,author.complete_name,created_at',
          expand: 'author',
        });
        const fetchedReplies = response.results || [];
        setReplies(fetchedReplies);
        setRepliesCount(response.count);
      } catch (error) {
        console.error('Erro ao buscar respostas:', error);
      }
    };
    fetchReplies();
  }, [comment.id, commentContentType]);

  const onSubmit = async () => {
    try {
      const replyData = {
        object_id: comment.id,
        content_type_id: commentContentType,
        author_id: user.id,
        text: replyTxt,
        parent_id: comment.id,
      };

      const novoReply = await commentService.create(replyData);
      setReplies([...replies, novoReply]);
      setReplyTxt('');
      setShowReply(false);
    } catch (error) {
      console.error('Erro ao criar reply:', error);
    }
  };

  return (
    <Box>
      <Box
        mt={2}
        p={3}
        sx={{
          borderColor: (theme) => theme.palette.divider,
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      >
        <Stack direction="row" gap={2} alignItems="center">
          <Avatar
            alt={comment.author.complete_name}
            src={comment.author.profile_picture}
            sx={{ width: 33, height: 33 }}
          />
          <Typography variant="h6">{comment.author.complete_name}</Typography>
          <Typography variant="caption" color="textSecondary">
            <IconCircle size={7} fillOpacity="0.1" strokeOpacity="0.1" />{' '}
            {new Date(comment.created_at).toLocaleString()}
          </Typography>
        </Stack>
        <Box py={2}>
          <Typography color="textSecondary">{comment.text}</Typography>
        </Box>
        <Stack direction="row" gap={1} alignItems="center">
          <Tooltip title="Curtir" placement="top">
            <Fab size="small" color="inherit">
              <IconThumbUp size={16} />
            </Fab>
          </Tooltip>
          <Typography variant="body1" fontWeight={600}>
            {comment.likes ? comment.likes.value : 0}
          </Typography>
          <Tooltip title="Responder" placement="top">
            <Fab sx={{ ml: 2 }} size="small" color="info" onClick={() => setShowReply(!showReply)}>
              <IconArrowBackUp size={16} />
            </Fab>
          </Tooltip>
          <Typography variant="body1" fontWeight={600}>
            {repliesCount}
          </Typography>
        </Stack>
      </Box>

      {replies.map((reply) => (
        <Box key={reply.id} pl={4}>
          <Box
            mt={2}
            p={3}
            sx={{
              borderColor: (theme) => theme.palette.grey[100],
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          >
            <Stack direction="row" gap={2} alignItems="center">
              <Avatar
                alt={reply.author.complete_name}
                src={reply.author.profile_picture}
                sx={{ width: 33, height: 33 }}
              />
              <Typography variant="h6">{reply.author.complete_name}</Typography>
              <Typography variant="caption" color="textSecondary">
                <IconCircle size={7} fillOpacity="0.1" strokeOpacity="0.1" />{' '}
                {new Date(reply.created_at).toLocaleString()}
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
            <Avatar
              alt={user?.complete_name}
              src={user?.profile_picture}
              sx={{ width: 33, height: 33 }}
            />
            <TextField
              placeholder="Responder..."
              value={replyTxt}
              onChange={(e) => setReplyTxt(e.target.value)}
              variant="outlined"
              fullWidth
            />
            <Button variant="contained" onClick={onSubmit}>
              Responder
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default PostComments;
