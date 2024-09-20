'use client';
import React, { useState } from "react"
import {
    CardContent,
    ListItem,

} from '@mui/material';

import BlankCard from '@/app/components/shared/BlankCard';
import PageContainer from "@/app/components/container/PageContainer";
import List from '@mui/material/List';

import saleService from '@/services/saleService';

const data = [
    {
        id: 1, total_value: '20000', contract_number: 'RES000001', contract_date: '2000-09-02', signature_date: '2025-05-09', is_sale: true, status: "Finalizar", branch_id: {
            id: 1,
            name: 'Castanhal',
            is_deleted: 0,
            address_id: {
                zipcode: '66690720'
            }
        }, document_completion_date: '2000-09-02 10:22:25.100'
    },
    {
        id: 2, total_value: '20000', contract_number: 'RES000001', contract_date: '2000-09-02', signature_date: '2025-05-09', is_sale: true, status: "Finalizar", branch_id: {
            id: 1,
            name: 'Castanhal',
            is_deleted: 0,
            address_id: {
                zipcode: '66690720'
            }
        }, document_completion_date: '2000-09-02 10:22:25.100'
    }
]

const error = 'hot'
const SaleList = () => {

    const [sales, SetSale] = useState()
    const [boards, setBoards] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [leads, setLeads] = useState([]);
    const [statuses, setStatuses] = useState([]);

    async function SalePage() {

        const data = await saleService.getBoards();

        console.log(data)

    }

    return (
        <PageContainer title="Material" description="Material">
            <BlankCard>
                <CardContent>
                    <List />
                    {data.map((item) => (
                        <ListItem className="" style={{ display: "flex", gap: "5px" }}>
                            <div>{item.id}</div>
                            <div>{item.contract_number}</div>
                            <div>{item.contract_date}</div>
                            <div>{item.total_value}</div>
                            <div>{item.is_sale}</div>
                            <div>{item.signature_date}</div>
                            <div>{item.status}</div>
                            <div>{item.document_completion_date}</div>
                            <div>{item.branch_id.name}</div>
                        </ListItem>
                    ))}
                </CardContent>
            </BlankCard>
        </PageContainer>
    )
}

export default SaleList