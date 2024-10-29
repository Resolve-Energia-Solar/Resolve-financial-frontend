import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import React from "react";
import CreateInvoiceApp from "@/app/components/apps/invoice/Add-invoice";
import BlankCard from "@/app/components/shared/BlankCard";
import { CardContent } from "@mui/material";
import { InvoiceProvider } from "@/app/context/InvoiceContext";

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Criar um novo pagamento",
    },
];

const CreateInvoice = () => {
    return (
        <InvoiceProvider>
            <PageContainer
                title="Criar um novo pagamento"
                description="Criar um novo pagamento"
            >
                <Breadcrumb title="Criar um novo pagamento" items={BCrumb} />

                <BlankCard>
                    <CardContent>
                        <CreateInvoiceApp />
                    </CardContent>
                </BlankCard>
            </PageContainer>
        </InvoiceProvider>
    );
};
export default CreateInvoice;
