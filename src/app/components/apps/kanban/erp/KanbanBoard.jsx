import { Box, Divider } from '@mui/material';
import KanbanColumn from './KanbanColumn';
import Loading from '@/app/loading';
import KanbanHeader from './Header';
import TasksList from './TasksList';

export default function KanbanBoard({ columns, onClickCard }) {

    const handleClick = () => {
        // TODO: Clear the search input
        console.log("clicked the clear icon...");
    };
    return (


        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', overflowX: 'auto', overflowY: 'hidden', boxShadow: '',paddingBottom: 2 }}>
            {
                columns?.map(
                    (column => (
                        <KanbanColumn key={column.id} title={column.name} onClickCard={onClickCard} color={column.color} tasks={column.task} />
                    ))
                )
            }
        </Box>

    );
}
