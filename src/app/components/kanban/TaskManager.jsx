'use client';
import React, { useContext, useState } from 'react';
import KanbanHeader from './KanbanHeader';
import { KanbanDataContext } from '@/app/context/kanbancontext/index';
import CategoryTaskList from './CategoryTaskList';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import SimpleBar from 'simplebar-react';
import { Box } from '@mui/material';
import CategoryTaskListSkeleton from './components/CategoryTaskListSkeleton';
import { debounce } from 'lodash';

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

  const handleScroll = debounce((event) => {
    if (loading) return;

    const { scrollTop, scrollHeight, clientHeight } = event.target;
    const scrollPosition = scrollTop + clientHeight;

    const isNearTop = scrollPosition <= 0.35 * scrollHeight && page > 1;

    const isNearBottom = scrollPosition >= 0.75 * scrollHeight && hasNext;

    console.log('isNearTop:', isNearTop);
    console.log('page:', page);

    if (isNearTop && !loading) {
      setPage(1);
    }

    if (isNearBottom) {
      nextPage();
    }
  }, 700);

  return (
    <>
      <KanbanHeader />
      {/* <SimpleBar
        style={{
          maxWidth: '100%',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}
        forceVisible="x"
        autoHide={false}
      > */}
      <Box

        component={SimpleBar}
        overflow="auto"
        px={3}
        maxHeight="calc(100vh - 160px)"
        onScroll={handleScroll} // Adiciona o evento de rolagem
        forceVisible="x"
        autoHide={false}
        sx={{
          maxWidth: '100%',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          '& .simplebar-scrollbar::before': {
            backgroundColor: '#7E8388 !important',
            opacity: '1 !important',
            borderRadius: '8px',
          },
          '& .simplebar-track': {
            backgroundColor: '#D9D9D9 !important',
            borderRadius: '8px',
          },
          '& .simplebar-track.simplebar-vertical': {
            backgroundColor: '#ccc !important',
          },
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Box display="flex" gap={2} p={1}
            sx={{
              minWidth: 'max-content',
              maxHeight: '75vh',
            }}
          >
            {loadingCategories
              ? Array.from({ length: 4 }).map((_, index) => (
                <CategoryTaskListSkeleton key={index} />
              ))
              : todoCategories.map((category) => (
                <Droppable droppableId={category.id.toString()} key={category.id}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} style={{ flex: 1 }}>
                      <CategoryTaskList id={category.id} />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
          </Box>
        </DragDropContext>
      </Box>
      {/* </SimpleBar> */}
    </>
  );
}

export default TaskManager;
