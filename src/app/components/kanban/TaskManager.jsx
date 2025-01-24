'use client';
import React, { useContext } from 'react';
import KanbanHeader from './KanbanHeader';
import { KanbanDataContext } from '@/app/context/kanbancontext/index';
import CategoryTaskList from './CategoryTaskList';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import SimpleBar from 'simplebar-react';
import { Box } from '@mui/material';
import CategoryTaskListSkeleton from './components/CategoryTaskListSkeleton';

function TaskManager() {
  const { todoCategories, loadingCategories, moveTask } = useContext(KanbanDataContext);

  const onDragEnd = (result) => {
    console.log(result);
    const { source, destination, draggableId } = result;

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    const sourceCategoryId = source.droppableId;
    const destinationCategoryId = destination.droppableId;
    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    moveTask(draggableId, sourceCategoryId, destinationCategoryId, sourceIndex, destinationIndex);
  };

  return (
    <>
      <KanbanHeader />
      <SimpleBar>
        <DragDropContext onDragEnd={onDragEnd}>
          <Box display="flex" gap={2} p={2}>
            {loadingCategories
              ? Array.from({ length: 4 }).map((_, index) => (
                  <CategoryTaskListSkeleton key={index} />
                ))
              : todoCategories.map((category) => (
                  <Droppable droppableId={category.id.toString()} key={category.id}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        <CategoryTaskList id={category.id} />
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
          </Box>
        </DragDropContext>
      </SimpleBar>
    </>
  );
}

export default TaskManager;
