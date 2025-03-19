import { useRouter } from "next/router"
import React from "react";
import ProposalLayout from "../components/ProposalLayout";

const ProposalLayoutPage = () => {
    const router = useRouter();
    const { query } = router;

    const formData = {
        amount: query.amount || '',
        seller_id: query.seller_id || '',
        proposal_validity: query.proposal_validity || '',
        payment: query.payment || '',
        description: query.description || '',
    };

    return (
        <>
            <ProposalLayout formData={formData} />
        </>
    );
}