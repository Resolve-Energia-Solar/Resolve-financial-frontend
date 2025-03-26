'use client';
import Grid from '@mui/material/Grid';
import { useCallback, useEffect, useState } from 'react';
import commentService from '@/services/commentService';
import PostItem from './PostItem';
import { PostTextBox } from './PostTextBox';
import getContentType from '@/utils/getContentType';
import PostSkeleton from './PostSkeleton';
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';

const Post = ({ user }) => {
  const loggedUser = useSelector((state) => state.user?.user);
  const userId = user.id;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const userContentType = await getContentType('accounts', 'user');
      const data = await commentService.index(userId, userContentType, {
        author: userId,
        ordering: '-created_at',
        fields: 'id,text,author.id,author.profile_picture,author.complete_name,created_at',
        expand: 'author',
      });
      setPosts(data.results);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPosts();
  }, [userId, fetchPosts]);

  return (
    <Grid container spacing={3}>
      {user.id == loggedUser.id && (
        <Grid item sm={12}>
          <PostTextBox onPostCreated={fetchPosts} />
        </Grid>
      )}
      {loading ? (
        Array.from(new Array(3)).map((_, index) => (
          <Grid item sm={12} key={index}>
            <PostSkeleton />
          </Grid>
        ))
      ) : posts.length === 0 ? (
        <Grid item sm={12}>
          <Typography variant="body1" align="center">
            Este usuário ainda não publicou.
          </Typography>
        </Grid>
      ) : (
        posts.map((post) => (
          <Grid item sm={12} key={post.id}>
            <PostItem post={post} />
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default Post;
