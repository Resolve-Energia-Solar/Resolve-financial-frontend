'use client'
import React from "react";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import InvoiceList from "@/app/components/apps/invoice/Invoice-list/index";
import { InvoiceProvider } from "@/app/context/InvoiceContext/index";
import BlankCard from "@/app/components/shared/BlankCard";
import { CardContent } from "@mui/material";
import Details from "@/app/components/apps/invoice/Details";
import SideDrawer from "@/app/components/shared/SideDrawer";
import usePayment from "@/hooks/payments/usePayment";

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Lista de Pagamentos",
    },
];

const InvoiceListing = () => {

    const { toggleOpenDrawerClosed, openDrawer, rowSelected, handleRowClick, editPaymentStatus } = usePayment()

    return (
        <InvoiceProvider>
            <PageContainer title="Lista de Pagamentos" description="Essa é a Lista de Pagamentos">
                <Breadcrumb title="Lista de Pagamentos" items={BCrumb} />
                <BlankCard>
                    <CardContent>
                        <InvoiceList onClick={handleRowClick} />
                        <SideDrawer title="Detalhes do Pagamento" open={openDrawer} onClose={toggleOpenDrawerClosed} >
                            <Details data={rowSelected}  handleInputChange={editPaymentStatus}/>
                        </SideDrawer>
                    </CardContent>
                </BlankCard>
            </PageContainer>
        </InvoiceProvider>
    );
}
export default InvoiceListing;
