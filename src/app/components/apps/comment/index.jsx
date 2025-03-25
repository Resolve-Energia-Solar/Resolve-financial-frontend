'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Typography,
    Avatar,
    ListItemAvatar,
    TextField,
    Button,
    Skeleton,
    Tooltip
} from '@mui/material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

import getContentType from '@/utils/getContentType';
import CommentService from '@/services/commentService';

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Comment({ appLabel, model, objectId, label = 'Comentários' }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [contentTypeId, setContentTypeId] = useState(null);

    const user = useSelector((state) => state?.user?.user);
    const listRef = useRef(null);


  useEffect(() => {
    async function fetchContentTypeId() {
      try {
        const id = await getContentType(appLabel, model);
        console.log('Content Type ID:', id);
        setContentTypeId(id);
      } catch (error) {
        console.error("Erro ao buscar content type:", error);
      }
    }
    fetchContentTypeId();
  }, [appLabel, model]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await CommentService.getComments(objectId, contentTypeId, {
                    fields: 'author.complete_name,created_at,text',
                    expand: 'author',
                });
                setComments(data.results || []);

            } catch (err) {
                setError(err.message || 'Erro ao carregar comentários.');
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [contentTypeId, objectId]);

    const getInitials = (name) => name?.charAt(0)?.toUpperCase() || '';

    const handleSubmit = async () => {
        if (!newComment.trim()) return;
        setSubmitting(true);
        try {
            const data = await CommentService.createComment({
                author: user?.id,
                object_id: objectId,
                content_type: contentTypeId,
                text: newComment
            });
    
            const commentWithAuthor = {
                ...data,
                author: {
                    id: user?.id,
                    complete_name: user?.complete_name,
                    email: user?.email,
                    employee_data: user?.employee_data || {},
                },
            };
    
            setComments(prev => [...prev, commentWithAuthor]);
            setNewComment('');
        } catch (err) {
            setError(err.message || 'Erro ao enviar comentário.');
        } finally {
            setSubmitting(false);
        }
    };

    // Rolagem automática ao final quando as mensagens mudam
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [comments]);

    // Skeleton para placeholder de mensagens
    const SkeletonList = () => (
        <>
            {[1, 2, 3].map((_, i) => (
                <ListItem key={i} sx={{ maxWidth: '70%', mb: 1, bgcolor: 'grey.200', borderRadius: 2 }}>
                    <ListItemAvatar>
                        <Skeleton variant="circular" width={40} height={40} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={<Skeleton width="60%" />}
                        secondary={<Skeleton width="40%" />}
                    />
                </ListItem>
            ))}
        </>
    );

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                boxShadow: 0,
                bgcolor: 'background.paper',
                width: '100%',
                maxWidth: 800,
                margin: '0 auto',
                mt: 2,
                overflow: 'hidden'
            }}
        >
            <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
                {label}
            </Typography>

            {/* Área de mensagens */}
            <Box
                ref={listRef}
                sx={{
                    height: 500,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    px: 2,
                    pb: 1,
                }}
            >
                <List sx={{ display: 'flex', flexDirection: 'column' }}>
                    {loading ? (
                        <SkeletonList />
                    ) : (
                        comments.map((comment, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                style={{
                                    marginBottom: '8px',
                                    display: 'flex',
                                    justifyContent: comment.author?.id === user?.id ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <Tooltip
                                    title={
                                        <Box sx={{ p: 0, textAlign: 'left' }}>
                                            <Typography variant="body2"><strong>Nome:</strong> {comment.author?.complete_name || 'Desconhecido'}</Typography>
                                            <Typography variant="body2"><strong>Email:</strong> {comment.author?.email || 'Desconhecido'}</Typography>
                                            <Typography variant="body2"><strong>Cargo:</strong> {comment.author?.employee_data?.role || 'Desconhecido'}</Typography>
                                            <Typography variant="body2"><strong>Setor:</strong> {comment.author?.employee_data?.department || 'Desconhecido'}</Typography>
                                            <Typography variant="body2"><strong>Unidade:</strong> {comment.author?.employee_data?.branch || 'Desconhecido'}</Typography>
                                            <Typography variant="body2"><strong>Data:</strong> {new Date(comment.created_at).toLocaleString()}</Typography>
                                        </Box>
                                    }
                                    arrow
                                    placement="right"
                                    enterDelay={300}
                                    leaveDelay={50}
                                >
                                    <ListItem
                                        sx={{
                                            maxWidth: '90%',
                                            bgcolor: comment.author?.id === user?.id ? 'primary.light' : 'grey.300',
                                            borderRadius: 2,
                                            padding: 1,
                                            alignSelf: comment.author?.id === user?.id ? 'flex-end' : 'flex-start'
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
                                                {getInitials(
                                                    comment.author?.complete_name || comment.author?.email || 'D'
                                                )}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                comment.author?.complete_name
                                                    ? comment.author.complete_name.charAt(0).toUpperCase() + comment.author.complete_name.slice(1).toLowerCase()
                                                    : comment.author?.email
                                                        ? comment.author.email.charAt(0).toUpperCase() + comment.author.email.slice(1).toLowerCase()
                                                        : 'Desconhecido'
                                            }
                                            secondary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="body1">
                                                        {comment?.text}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary" sx={{ marginLeft: '10px' }}>
                                                        {new Date(comment.created_at).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                </Tooltip>
                            </motion.div>
                        ))
                    )}
                </List>
            </Box>

            {/* Área de input */}
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Escreva uma mensagem..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyUp={(e) => e.key === 'Enter' && handleSubmit()}
                    disabled={loading}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={submitting || loading}
                    sx={{ ml: 1 }}
                >
                    {submitting ? 'Enviando...' : 'Enviar'}
                </Button>
            </Box>
        </Box>
    );
}