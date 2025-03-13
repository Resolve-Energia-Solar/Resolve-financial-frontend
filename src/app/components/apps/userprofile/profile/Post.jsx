'use client';
import Grid from '@mui/material/Grid';
import { useCallback, useEffect, useState } from 'react';
import commentService from '@/services/commentService';
import PostItem from './PostItem';
import { PostTextBox } from './PostTextBox';
import { useSelector } from 'react-redux';
import getContentType from '@/utils/getContentType';

const Post = () => {
  const userId = useSelector((state) => state.user?.user.id);
  const [posts, setPosts] = useState([]);

  // Função para buscar os posts
  const fetchPosts = useCallback(async () => {
    if (!userId) return;
    const userContentType = await getContentType('accounts', 'user');
    const data = await commentService.getComments(userId, userContentType, {
      author: userId,
      ordering: '-created_at',
    });
    setPosts(data.results);
  }, [userId]);

  useEffect(() => {
    fetchPosts();
  }, [userId, fetchPosts]);

  return (
    <Grid container spacing={3}>
      <Grid item sm={12}>
        <PostTextBox onPostCreated={fetchPosts} />
      </Grid>
      {posts.map((post) => (
        <Grid item sm={12} key={post.id}>
          <PostItem post={post} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Post;
