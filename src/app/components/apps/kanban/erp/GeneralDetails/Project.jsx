
'use client'
import { useState } from "react";
import Header from "./Header";
import { Box, Tab, Tabs } from "@mui/material";
import { TabPanel } from "@/app/components/shared/TabPanel";
import AttachmentDetails from "@/app/components/shared/AttachmentDetails";
const CONTEXT_TYPE_SALE_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_SALE_ID;
export default function Project({ data }) {

    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (

        <>

            <Header data={data} />

            <Box p={2} />

            <Tabs value={value} onChange={handleChange}>
                <Tab label="Atividade" />
                <Tab label="Vistoria" />
            </Tabs>
            <TabPanel value={value} index={0}>
                <AttachmentDetails objectId={data.id} contentType={CONTEXT_TYPE_SALE_ID}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                tchau
            </TabPanel>

        </>
    )
}