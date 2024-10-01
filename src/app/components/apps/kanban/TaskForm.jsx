import React from 'react';
import { TextField, Box, Button } from '@mui/material';

const TaskForm = ({ taskData, setTaskData }) => {
  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  return (
    <Box component="form">
      {Object.keys(taskData).map((key) => (
        <TextField
          key={key}
          label={key.charAt(0).toUpperCase() + key.slice(1)} // Capitaliza a primeira letra
          name={key}
          fullWidth
          value={taskData[key]}
          onChange={handleChange}
          margin="normal"
        />
      ))}
      <Button variant="contained" color="primary" type="submit">
        Salvar
      </Button>
    </Box>
  );
};

export default TaskForm;
