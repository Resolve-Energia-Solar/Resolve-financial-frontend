'use client'

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
import SideDrawer from '@/app/components/shared/SideDrawer';
export default function Kanban() {

  const {
    data,
    contentType,
    board,
    boards,
    isModalOpen,
    dataProject,
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
    tasks
  } = boardOperation()

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
      <Breadcrumb title="Kanban" items={BCrumb} />
      <BlankCard>
        <CardContent>
          {/* Header do Kanban */}
          <Header boardSelected={board?.id}
            boards={boards}
            onBoardChange={handleChangeBoard}
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            viewMode={viewMode}
            onClickViewMode={onClickViewMode} />

          <Divider sx={{ my: 3 }} />

          {viewMode === 'kanban' ?
            <KanbanBoard
              columns={board?.columns}
              onClickCard={handleCardClick}
              viewMode={viewMode}
            />
            : <TasksList data={tasks} onClickRow={handleCardClick} />
          }
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


          <SideDrawer open={isDrawerOpen} onClose={handleDrawerClose} title={'Detalhamento'}>
            {isDrawerOpen && <DynamicComponent componentName={contentType} data={dataProject} />}
          </SideDrawer>

          <BasicModal open={openModalMessage} onClose={setOpenModalMessage}  {...message} />
        </CardContent>
      </BlankCard>
    </PageContainer >
  );
}