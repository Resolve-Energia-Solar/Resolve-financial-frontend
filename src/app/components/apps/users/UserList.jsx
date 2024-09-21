// UserList.js
'use client';
import { useState, useEffect } from 'react';
import List from '@mui/material/List';
import Scrollbar from '../../custom-scroll/Scrollbar';
import ContactListItem from './UserListItem';
import userService from '@/services/userService';
import { Box, InputAdornment, TextField } from '@mui/material';
import { IconSearch } from '@tabler/icons-react';

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
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
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
        }}
      >
        <List>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <ContactListItem
                key={user.id}
                first_name={user.first_name}
                last_name={user.last_name}
                profile_picture={user.profile_picture}
                department={user.department}
                onContactClick={() => showrightSidebar()}
              />
            ))
          ) : (
            <div>Nenhum usuário encontrado</div>
          )}
        </List>
      </Scrollbar>
    </>
  );
}

export default UserList;