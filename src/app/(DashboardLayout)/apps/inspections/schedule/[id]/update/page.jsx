import React from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import InvoiceList from "@/app/components/apps/invoice/Invoice-list/index";
import { InvoiceProvider } from "@/app/context/InvoiceContext/index";
import BlankCard from "@/app/components/shared/BlankCard";
import { CardContent } from "@mui/material";
import ScheduleFormEdit from "@/app/components/apps/inspections/schedules/Edit-schedule";

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Editar de Agendamento",
    },
];

const ScheduleEdit = () => {
    return (
        <InvoiceProvider>
            <PageContainer title="Editar de Agendamento" description="Essa é o Editor de Agendamento">
                <Breadcrumb title="Editar de Agendamento" items={BCrumb} />
                <BlankCard>
                    <CardContent>
                        <ScheduleFormEdit />
                    </CardContent>
                </BlankCard>
            </PageContainer>
        </InvoiceProvider>
    );
}
export default ScheduleEdit;
