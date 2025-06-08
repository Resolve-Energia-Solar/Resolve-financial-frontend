'use client';
import { notFound, useParams } from "next/navigation";
import RelationshipScheduleForm from "@/app/components/apps/relationship/schedules/RelationshipScheduleForm";

export default function UpdateSchedulePage() {
    const params = useParams();
    const id = params.id;
    if (!id) {
        return notFound();
    }
    const breadcrumbItems = [
        { to: '/', title: 'Início' },
        { to: '/apps/relationship/schedules', title: 'Agendamentos do Relacionamento com Cliente' },
        { title: 'Agendamento' },
        { title: 'Atualizar Agendamento' },
    ];
    return (
        <RelationshipScheduleForm scheduleId={id} breadcrumbItems={breadcrumbItems} />
    );
}