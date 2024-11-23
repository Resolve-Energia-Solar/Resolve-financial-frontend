import React from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import InvoiceList from "@/app/components/apps/invoice/Invoice-list/index";
import { InvoiceProvider } from "@/app/context/InvoiceContext/index";
import BlankCard from "@/app/components/shared/BlankCard";
import { CardContent } from "@mui/material";

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Solicitações da Concessionária de Energia",
    },
];

const InvoiceListing = () => {
    return (
        <InvoiceProvider>
            <PageContainer title="Lista de Pagamentos" description="Essa é a Lista de Pagamentos">
                <Breadcrumb title="Lista de Pagamentos" items={BCrumb} />
                <BlankCard>
                    <CardContent>
                        <InvoiceList />
                    </CardContent>
                </BlankCard>
            </PageContainer>
        </InvoiceProvider>
    );
}
export default InvoiceListing;
