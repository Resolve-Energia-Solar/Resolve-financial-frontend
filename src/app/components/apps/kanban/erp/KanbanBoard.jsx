import { Box } from '@mui/material';
import KanbanColumn from './KanbanColumn';

export default function KanbanBoard({ board }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', p: 4, alignItems: 'flex-start', overflowX: 'auto', overflowY: 'hidden', boxShadow: '', border: 1, maxHeight: 'calc(100vh - 131px)' }}>
            {
                board.columns.map(
                    (column => (
                        <KanbanColumn title={column.name} tasks={column.tasks} />
                    ))
                )
            }
        </Box>
    );
}
