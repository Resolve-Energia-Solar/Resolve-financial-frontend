'use client'

import React, { useState } from 'react'
import {
    Tabs,
    Tab,
    Typography,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Button,
    Paper,
    Table,
    TableHead,
    TableCell,
    TableBody,
    TableRow,
    MenuItem,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import sale from './sale.json'

function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

export default function FormSale() {
    const [value, setValue] = useState(0)
    const [expanded, setExpanded] = useState(false)
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
            <TabPanel value={value} index={0}>
                <TextField
                    select
                    label="Contratante"
                    name="type_id"
                    value={''}

                    fullWidth
                    margin="normal"

                >
                    <MenuItem>Max Oliveira Junior</MenuItem>
                </TextField>
                <Box border={1} p={3}>
                    <Box display={'flex'} gap={1} flexDirection={'column'} mb={2}>
                        <Box display={'flex'} gap={1} >
                            <Typography>Inversor: Growatt</Typography>
                            <Typography>Quantidade: 1</Typography>
                        </Box>
                        <Box display={'flex'} gap={1} >
                            <Typography>Modulo: Hanersun</Typography>
                            <Typography>Quantidade: 10</Typography>
                        </Box>

                    </Box>
                    <Box mb={2}>
                        <TextField
                            select
                            label="Homologador"
                            name="type_id"
                            value={''}

                            fullWidth
                            margin="normal"

                        >
                            <MenuItem>Max Oliveira Junior</MenuItem>
                        </TextField>
                    </Box>

                    <Accordion expanded={expanded === 'additional'} onChange={handleAccordionChange('additional')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography>Adicionais</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box component="form" sx={{ '& > :not(style)': { m: 1 } }} noValidate autoComplete="off">
                                <Box>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Descrição</TableCell>
                                                <TableCell>Valor</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow key={1}>
                                                <TableCell>Poste Auxiliar</TableCell>
                                                <TableCell>R$ 900,00</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Box>
                                <Button variant="contained">Adicionar</Button>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'checklist'} onChange={handleAccordionChange('checklist')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography>Checklist de Rateio</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box component="form" sx={{ '& > :not(style)': { m: 1 } }} noValidate autoComplete="off">
                                <Box sx={{ overflowX: 'auto' }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>

                                                <TableCell>Conta</TableCell>
                                                <TableCell>Nº Contrato</TableCell>
                                                <TableCell>Classificação</TableCell>
                                                <TableCell>Nº medidor</TableCell>
                                                <TableCell>%</TableCell>
                                                <TableCell>Endereço</TableCell>
                                                <TableCell>Tipo Fornecimento</TableCell>
                                                <TableCell>Homologador</TableCell>
                                                <TableCell>Adquações</TableCell>
                                                <TableCell>Nova U.C</TableCell>
                                                <TableCell>Troca Titularidade</TableCell>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>

                                            <TableRow key={1}>

                                                <TableCell>Geradora</TableCell>
                                                <TableCell>
                                                    8454545
                                                </TableCell>
                                                <TableCell>Residencial</TableCell>
                                                <TableCell>
                                                    12312312312
                                                </TableCell>
                                                <TableCell>50%</TableCell>
                                                <TableCell>Rua manaus,52,aguas lindas, ananindeua</TableCell>
                                                <TableCell>
                                                    Bifasico
                                                </TableCell>
                                                <TableCell>Homologador</TableCell>
                                                <TableCell>Adequação</TableCell>
                                                <TableCell>
                                                    Sim
                                                </TableCell>
                                                <TableCell>Não</TableCell>
                                            </TableRow>
                                            <TableRow key={1}>

                                                <TableCell>Geradora</TableCell>
                                                <TableCell>
                                                    8454545
                                                </TableCell>
                                                <TableCell>Residencial</TableCell>
                                                <TableCell>
                                                    12312312312
                                                </TableCell>
                                                <TableCell>50%</TableCell>
                                                <TableCell>Rua manaus,52,aguas lindas, ananindeua</TableCell>
                                                <TableCell>
                                                    Bifasico
                                                </TableCell>
                                                <TableCell>Homologador</TableCell>
                                                <TableCell>Adequação</TableCell>
                                                <TableCell>
                                                    Sim
                                                </TableCell>
                                                <TableCell>Não</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Box>
                                <Button variant="contained">Adicionar Endereço</Button>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2bh-content"
                            id="panel2bh-header"
                        >
                            <Typography>Documentos</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box component="form" sx={{ '& > :not(style)': { m: 1 } }} noValidate autoComplete="off">

                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Box>
                <Box width={'100%'} display={'flex'} mt={2} justifyContent={'center'}><Button variant="contained">Novo projeto</Button></Box>

                
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        Conteúdo da Aba 2
                    </Typography>
                    <Typography>
                        Aqui você pode adicionar o conteúdo para a segunda aba.
                    </Typography>
                </Paper>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        Conteúdo da Aba 3
                    </Typography>
                    <Typography>
                        Aqui você pode adicionar o conteúdo para a terceira aba.
                    </Typography>
                </Paper>
            </TabPanel>
            <Box border={1} display={'flex'} justifyContent={'space-between'} alignItems={'center'} paddingInline={3}>
                    <Box display={'flex'} gap={2}>
                        <Button>Salvar</Button>
                        <Button>Enviar Contrato</Button>
                        <Button>Salvar e enviar Contrato</Button>
                    </Box>
                    <Box p={1}>
                        <Typography>Adicionais:</Typography>
                        <Typography>Ajuste:</Typography>
                        <Typography>Total:</Typography>
                    </Box>

                </Box>
        </Box>
    )
}