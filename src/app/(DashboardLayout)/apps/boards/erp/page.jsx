'use client'

import KanbanBoard from '@/app/components/apps/kanban/erp/KanbanBoard';
import { kanbans } from "./kanbans.json";
export default function Kanban() {

  return (
    <KanbanBoard board={kanbans.infraestrutura} sx />
  );
}