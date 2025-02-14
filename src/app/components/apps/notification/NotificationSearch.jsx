import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { searchNotification } from '@/store/apps/notification/NotificationSlice';
import { IconMenu2, IconSearch } from '@tabler/icons-react';

const NotificationSearch = ({ onClick }) => {
  const searchTerm = useSelector((state) => state.notification.notificationSearch);
  const dispatch = useDispatch();

  return (
    <Box display="flex" sx={{ p: 2 }}>
      <Fab
        onClick={onClick}
        color="primary"
        size="small"
        sx={{ mr: 1, flexShrink: '0', display: { xs: 'block', lg: 'none' } }}
      >
        <IconMenu2 width="16" />
      </Fab>
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
        placeholder="Buscar notificações"
        variant="outlined"
        onChange={(e) => dispatch(searchNotification(e.target.value))}
      />
    </Box>
  );
};

export default NotificationSearch;
