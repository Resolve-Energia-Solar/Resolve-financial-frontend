import { Chip, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import InfoIcon from "@mui/icons-material/Info";
import { format, isValid } from 'date-fns';
const ListRequest = ({ data, onClick }) => {

    console.log(data,'asdjhalskdhsdj')

    function getStatusRequest(status) {

        let textStatus
        let iconColor

        switch (status) {

            case 'I':
                textStatus = 'Indeferido'
                iconColor = 'error'
                break
            case 'D':
                textStatus = 'Deferido'
                iconColor = 'success'
                break
            case 'S':
                textStatus = 'Solicitado'
                iconColor = 'warning'
                break
        }

        return { textStatus, iconColor }
    }

    return (<TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Projeto</TableCell>
                    <TableCell>Endereços</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Situação</TableCell>
                    <TableCell>Data de Solicitação</TableCell>
                    <TableCell>Data de Vencimento</TableCell>
                    <TableCell>Data de Conclusão</TableCell>
      
                    <TableCell>Status</TableCell>
                    <TableCell>Solicitante</TableCell>
                    <TableCell>Prazo</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((item) => (
                    <TableRow key={item.id} onClick={() => onClick(item)}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{`${item.project.project_number} - ${item.project.sale?.customer?.complete_name}`}</TableCell>
                        <TableCell >
                            {`${item.unit?.address?.zip_code}, ${item.unit?.address.street}, ${item.unit?.address.neighborhood}, ${item.unit?.address?.city} - ${item.unit?.address?.state},  ${item.unit?.address.number}`}
                        </TableCell>
                        <TableCell>{item.type.name}</TableCell>
                        <TableCell>
                            {item.situation.map((situation) => (
                                <Chip key={item.id} label={situation.name} color={'primary'} sx={{ margin: 0.1 }} />
                            ))}
                        </TableCell>
                        <TableCell>{format(new Date(item.request_date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{format(new Date(item.conclusion_date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>
                            {format(new Date(item.conclusion_date), 'dd/MM/yyyy')}
                        </TableCell>
                       
                        <TableCell>
                            <Chip label={getStatusRequest(item.status).textStatus} color={getStatusRequest(item.status).iconColor} />
                        </TableCell>
                        <TableCell>{item.user?.name}</TableCell>
                        <TableCell>
                            <IconButton onClick={() => handleRowClick(item)}>
                                <InfoIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>)
}


export default ListRequest