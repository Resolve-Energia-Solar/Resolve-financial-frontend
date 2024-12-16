'use client'

import KanbanBoard from '@/app/components/apps/kanban/erp/KanbanBoard';
import { kanbans } from "./kanbans.json";
import PageContainer from '@/app/components/container/PageContainer';
import BlankCard from '@/app/components/shared/BlankCard';
import { CardContent } from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import boardOperation from '@/hooks/boards/useBoardOperation';
export default function Kanban() {

  const { boards, board, handleChangeBoard, handleSearch } = boardOperation()

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
          <KanbanBoard boards={boards} board={board} handleChangeBoard={handleChangeBoard} handleChangeSearchBoard={handleSearch}/>
        </CardContent>
      </BlankCard>
    </PageContainer >
  );
}