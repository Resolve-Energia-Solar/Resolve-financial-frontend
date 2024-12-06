import { Accordion, AccordionDetails, AccordionSummary, Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useState } from "react"
const PaymentTab = () => {
    const [expanded, setExpanded] = useState(false)

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false)
    }

    return (
        <div>

            <Accordion expanded={expanded === 'solfacil'} onChange={handleAccordionChange('solfacil')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"

                >
                    <Box display="flex" justifyContent="space-evenly" width="100%">
                        <Typography>Max Oliveira</Typography>
                        <Typography>Financiamento</Typography>
                        <Typography>Solfácil</Typography>
                        <Typography>2</Typography>
                        <Typography>R$ 25.200,00</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Box component="form" sx={{ '& > :not(style)': { m: 1 } }} noValidate autoComplete="off">
                        <Box>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>nº</TableCell>
                                        <TableCell>Data vencimento</TableCell>
                                        <TableCell>Valor</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={1}>
                                        <TableCell>Poste Auxiliar</TableCell>
                                        <TableCell>25/11/2024</TableCell>
                                        <TableCell>R$ 900,00</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>

                    </Box>
                </AccordionDetails>
            </Accordion></div>
    )
}

export default PaymentTab