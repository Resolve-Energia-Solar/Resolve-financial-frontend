import { Accordion, AccordionDetails, AccordionSummary, Box, Button, MenuItem, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useState } from "react"

const ProjectTab = () => {

    const [expanded, setExpanded] = useState(false)

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false)
    }
    return (

        <Paper elevation={10} sx={{ border: 0 }}>
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
        </Paper>
    )


}

export default ProjectTab