import { Box, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { format } from 'date-fns';

export default function InstallamentDrawer({ data }) {


    return (
        <Box>
            <TableContainer>
                <Table
                    sx={{
                        whiteSpace: 'nowrap',
                    }}
                >
                    <TableHead>
                        <TableRow >

                            <TableCell >
                                <Typography variant="subtitle1">
                                    Valor
                                </Typography>
                            </TableCell>
                            <TableCell >
                                <Typography variant="subtitle1">
                                    nº parcela
                                </Typography>
                            </TableCell>
                            <TableCell >
                                <Typography variant="subtitle1">
                                    Vencimento
                                </Typography>
                            </TableCell>
                            <TableCell >
                                <Typography variant="subtitle1">
                                    Status
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(data) && data.map((item) => (
                            <TableRow key={item.id}>

                                <TableCell>{item.installment_number}</TableCell>
                                <TableCell>{Number(item.installment_value).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                })}</TableCell>
                                <TableCell>
                                    {format(new Date(item.due_date), 'dd/MM/yyyy')}
                                </TableCell>
                                <TableCell>
                                    {
                                        item.is_paid ?
                                            <Chip label="Pago" color="success" /> :
                                            <Chip label="A vencer" color="warning" />
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}