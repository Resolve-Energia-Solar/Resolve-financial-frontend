'use client';

import React, { useState, useEffect } from 'react';
import { List, Box, InputAdornment, TextField, CircularProgress, Typography } from '@mui/material';
import { IconSearch, IconUser } from '@tabler/icons-react';
import Scrollbar from '../../custom-scroll/Scrollbar';
import ContactListItem from './UserListItem';
import userService from '@/services/userService';

function UserList({ showrightSidebar }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getUser();
        if (data && data.results) {
          setUsers(data.results);
          setFilteredUsers(data.results);
        } else {
          throw new Error('Estrutura de dados inesperada');
        }
      } catch (err) {
        setError('Erro ao carregar os usuários');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = users.filter((user) =>
      user.first_name.toLowerCase().includes(value) || user.last_name.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando usuários...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" sx={{ p: 2 }}>
        <TextField
          id="outlined-basic"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconSearch size="16" />
              </InputAdornment>
            ),
          }}
          fullWidth
          size="small"
          value={searchTerm}
          placeholder="Pesquisar Usuário"
          variant="outlined"
          onChange={handleSearch}
        />
      </Box>

      <Scrollbar
        sx={{
          height: { lg: 'calc(100vh - 100px)', md: '100vh' },
          maxHeight: '800px',
          p: 2,
        }}
      >
        <List>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <ContactListItem
                key={user.id}
                first_name={user.first_name}
                last_name={user.last_name}
                profile_picture={user.profile_picture || '/images/default-profile.png'}
                department={user.department}
                onContactClick={() => showrightSidebar()}
              />
            ))
          ) : (
            <Box display="flex" justifyContent="center" mt={4}>
              <Typography>Nenhum usuário encontrado</Typography>
            </Box>
          )}
        </List>
      </Scrollbar>
    </>
  );
}

export default UserList;
