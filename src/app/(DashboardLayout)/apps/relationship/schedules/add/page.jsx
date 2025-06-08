import RelationshipScheduleForm from "@/app/components/apps/relationship/schedules/RelationshipScheduleForm";

export default function AddSchedulePage() {
    const breadcrumbItems = [
        { to: '/', title: 'Início' },
        { to: '/apps/relationship/schedules', title: 'Agendamentos do Relacionamento com Cliente' },
        { title: 'Criar Agendamento' },
    ];
    return (
        <RelationshipScheduleForm breadcrumbItems={breadcrumbItems} />
    );
}