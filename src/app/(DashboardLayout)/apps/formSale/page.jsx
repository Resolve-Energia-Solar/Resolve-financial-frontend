'use client'

import React, { useState } from 'react'
import {
    Tabs,
    Tab,
    Box,
    TextField,
    Button,
    MenuItem,
} from '@mui/material'

import { TabPanel, a11yProps } from '@/app/components/apps/saleForm/TabPanel'
import ProjectTab from '@/app/components/apps/saleForm/ProjectTab'
import PaymentTab from '@/app/components/apps/saleForm/PaymentTab'
import DocumentSignTab from '@/app/components/apps/saleForm/DocumentSignTab'
import ModalProduct from '@/app/components/apps/saleForm/ModalProduct'
import Footer from '@/app/components/apps/saleForm/Footer'


export default function FormSale() {
    const [value, setValue] = useState(0)
    const [expanded, setExpanded] = useState(false)
    const [modal, setModal] = useState(false)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
    const handleAccordionChange =
        (panel) => (event, isExpanded) => {
            setExpanded(isExpanded ? panel : false)
        }
    return (
        <Box sx={{ width: '100%', maxWidth: 900, margin: 'auto', border: 1 }} id='adfsdfkjlfsdkfjh'>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Projeto" {...a11yProps(0)} />
                    <Tab label="Pagamento" {...a11yProps(1)} />
                    <Tab label="Envios de Contrato" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TextField
                select
                label="Contratante"
                name="type_id"
                value={''}


                margin="normal"
                sx={{ marginInline: 3, width: '80%' }}
            >
                <MenuItem>Max Oliveira Junior</MenuItem>
            </TextField>
            <TabPanel value={value} index={0}>
                 <ProjectTab />
                
                <Button variant="contained" onClick={() => setModal(true)}>Novo projeto</Button>
            </TabPanel>
            {/* <TabPanel value={value} index={1}>
                <PaymentTab />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <DocumentSignTab />
            </TabPanel>
            <Footer />*/}
            <ModalProduct setOpen={setModal} open={modal} /> 

        </Box>
    )
}