'use client';

import KanbanBoard from '@/app/components/apps/kanban/erp/KanbanBoard';
import PageContainer from '@/app/components/container/PageContainer';
import BlankCard from '@/app/components/shared/BlankCard';
import { CardContent, Divider } from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import boardOperation from '@/hooks/boards/useBoardOperation';
import ModalCardDetail from '@/app/components/apps/kanban/erp/ModalCardDetail';
import BasicModal from '@/app/components/apps/modal/modal';
import Header from '@/app/components/apps/kanban/erp/Header';
import TasksList from '@/app/components/apps/kanban/erp/TasksList';
import DynamicComponent from '@/app/components/apps/kanban/erp/GeneralDetails/DynamicComponent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import NewTask from '@/app/components/apps/kanban/erp/NewTask';
import tasksTemplates from '@/hooks/taskTemplates/useTasksTemplates';
import SideDrawer from '@/app/components/apps/kanban/erp/SideDrawer';
import Footer from '@/app/components/apps/kanban/erp/GeneralDetails/Footer';
import EditProject from '@/app/components/apps/project/Edit-project';
import useProject from '@/hooks/projects/useProject';
export default function Kanban() {
  const {
    board,
    boards,
    isModalOpen,
    cardSelected,
    handleSearch,
    handleCardClick,
    handleChangeBoard,
    handleModalClosed,
    isDrawerOpen,
    handleDrawerClose,
    handleDrawerOpen,
    setText,
    handleText,
    text,
    comments,
    setOpenModalMessage,
    openModalMessage,
    message,
    onClickViewMode,
    viewMode,
    searchTerm,
    tasks,
    optionsFooter,
    onClickFooter,
    tasksTemplate,
    openNewTask,
    setOpenNewTask,
    saveNewTask,
  } = boardOperation();

  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: 'Kanban Operacional',
    },
  ];

  return (
    <PageContainer title="Kanban" description="Kanban Operacional">
      <Breadcrumb items={BCrumb} />
      <BlankCard>
        <CardContent>
          {/* Header do Kanban */}
          <Header
            boardSelected={board?.id}
            boards={boards}
            onBoardChange={handleChangeBoard}
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            viewMode={viewMode}
            onClickViewMode={onClickViewMode}
          />

          <Divider sx={{ my: 3 }} />

          {viewMode === 'kanban' ? (
            <KanbanBoard
              columns={board?.columns}
              onClickCard={handleCardClick}
              viewMode={viewMode}
            />
          ) : (
            <TasksList data={tasks} onClickRow={handleCardClick} />
          )}
          {/* Detalhamento do Card */}
          <ModalCardDetail
            open={isModalOpen}
            onClose={handleModalClosed}
            data={cardSelected}
            onClickActionActivity={handleDrawerOpen}
            comments={comments}
            setText={setText}
            handleText={handleText}
            text={text}
          />
          {/* Detalhamento Lateral Condicional */}

          <SideDrawer
            open={isDrawerOpen}
            onClose={handleDrawerClose}
            title={'Detalhamento'}
            footer={
              cardSelected?.column?.name != 'Feito' && (
                <Footer options={optionsFooter} onClick={onClickFooter} />
              )
            }
          >
            {isDrawerOpen && (
              <EditProject projectId={cardSelected?.project?.id} data={cardSelected?.project} />
            )}
          </SideDrawer>

          <BasicModal
            open={openModalMessage}
            onClose={() => setOpenModalMessage(false)}
            {...message}
            IconComponent={message.type ? <CheckCircleIcon /> : <CancelIcon />}
          />
          <NewTask
            tasksTemplate={tasksTemplate}
            open={openNewTask}
            onClose={() => setOpenNewTask(false)}
            saveTask={saveNewTask}
          />
        </CardContent>
      </BlankCard>
    </PageContainer>
  );
}
