import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { format } from "date-fns";

export default function TasksList({ data, onClickRow }) {

    console.log('TaskList', data);

    return (

        <TableContainer Container>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Tarefa</TableCell>
                        <TableCell>Nome Homologador</TableCell>
                        <TableCell>Data Contrato</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Data Vencimento</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.map((item) => (
                        <TableRow key={item.id} onClick={() => onClickRow(item)}>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>{item?.project?.homologator?.complete_name}</TableCell>
                            <TableCell>{item?.project?.sale?.signature_date}</TableCell>
                            <TableCell>{item?.column.name}</TableCell>
                            <TableCell>{format(new Date(item.due_date), 'dd/MM/yyyy')}</TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}