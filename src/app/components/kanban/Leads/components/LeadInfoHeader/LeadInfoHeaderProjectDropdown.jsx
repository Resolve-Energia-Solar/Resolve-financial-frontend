import { ElementType, useContext, useState } from 'react';
import { Box, Grid, MenuItem, Select, Typography, useTheme } from '@mui/material';
import { LeadModalTabContext } from '../../context/LeadModalTabContext';


export function LeadInfoHeaderProjectDropdown() {
  const { lead } = useContext(LeadModalTabContext);
  const [selectedProject, setSelectedProject] = useState('');
  const theme = useTheme();

  return (
    <Grid item sx={{ gridArea: 'project' }}>
      <Box size="auto" sx={{ minWidth: 385 }}>
        <Typography variant="caption" sx={{ color: 'gray', mb: 0.5 }}>
          Projeto
        </Typography>
        <Select
          value={selectedProject || ''}
          onChange={(e) => setSelectedProject(e.target.value)}
          fullWidth
          size="small"
          sx={{ backgroundColor: '#F4F5F7', borderRadius: '8px' }}
          displayEmpty
        >
          {/* {projects.map((project) => ( */}
          <MenuItem value="" sx={{ color: '#7E8388' }} disabled>
            Selecione um projeto
          </MenuItem>

          <MenuItem
            // key={project.id}
            // value={project.id}
            value="project-1"
            sx={{ color: '#7E8388' }}
          >
            {/* {project.name} */}
            Rua Antônio Barreto, 1198
          </MenuItem>

          <MenuItem value="project-2" sx={{ color: '#7E8388' }}>
            Rua dos Mundurucus, 2500
          </MenuItem>

          <MenuItem value="project-3" sx={{ color: '#7E8388' }}>
            Tv. Padre Eutíquio, 87
          </MenuItem>

          {/* ))} */}
        </Select>
      </Box>
    </Grid>
  );
}