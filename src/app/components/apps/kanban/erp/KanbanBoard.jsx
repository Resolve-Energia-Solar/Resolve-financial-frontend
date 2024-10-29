'use client'
// components/KanbanBoard.js
import { Box, Grid } from '@mui/material';
import KanbanColumn from './KanbanColumn';

const initialTasks = {
    todo: [
        { id: 1, title: 'Estudar infraestrutura', description: 'Concluir módulo inicial' },
        { id: 2, title: 'Configurar ambiente', description: 'Montar laboratório virtual' },
    ],
    inProgress: [
        { id: 3, title: 'Planejar evento', description: 'Organizar logística do evento' },
    ],
    done: [
        { id: 4, title: 'Contato com influenciador', description: 'Definir estratégia' },
    ],
};

export default function KanbanBoard({ board }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            {console.log(board)}
            <Grid container spacing={2}>
                {
                    board.columns.map(
                        (column => (

                            <Grid item>
                                <KanbanColumn title={column.name} tasks={column.tasks} />
                            </Grid>
                        ))
                    )
                }

            </Grid>
        </Box>
    );
}
