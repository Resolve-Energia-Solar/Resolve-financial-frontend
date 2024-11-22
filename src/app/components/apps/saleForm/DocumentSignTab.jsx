import { Accordion, AccordionDetails, AccordionSummary, Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useState } from "react"
const DocumentSignTab = () => {
    const [expanded, setExpanded] = useState(false)

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false)
    }

    return (
        <Paper elevation={3} sx={{ p: 2 }}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Data de Envio</TableCell>
                    <TableCell>Prazo</TableCell>
                    <TableCell> Data assinatura</TableCell>
                    <TableCell>Status</TableCell>
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
                </TableRow>
            </TableBody>
        </Table>
    </Paper>
    )
}

export default DocumentSignTab