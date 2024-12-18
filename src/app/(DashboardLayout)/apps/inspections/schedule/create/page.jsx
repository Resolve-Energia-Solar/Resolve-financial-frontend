import React from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import { InvoiceProvider } from "@/app/context/InvoiceContext/index";
import BlankCard from "@/app/components/shared/BlankCard";
import { CardContent } from "@mui/material";
import ScheduleFormCreate from "@/app/components/apps/inspections/schedule/Add-schedule";

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Criar Agendamento",
    },
];

const CreateSchedule = () => {
    return (
        <InvoiceProvider>
            <PageContainer title="Criar Agendamento" description="Criar Agendamento">
                <Breadcrumb title="Criar Agendamento" items={BCrumb} />
                <BlankCard>
                    <CardContent>
                        <ScheduleFormCreate />
                    </CardContent>
                </BlankCard>
            </PageContainer>
        </InvoiceProvider>
    );
}
export default CreateSchedule;
