import { Box, Button, Typography } from "@mui/material"

const footer = ({ additional, adjustment, total, save, send }) => {

    return (
        <Box border={1} display={'flex'} justifyContent={'space-between'} alignItems={'center'} paddingInline={3}>
            <Box display={'flex'} gap={2}>
                <Button onClick={save}>Salvar</Button>
                <Button onClick={send}>Enviar Contrato</Button>
            </Box>
            <Box p={1} textAlign={'end'}>
                <Typography>Adicionais: {additional}</Typography>
                <Typography>Ajuste:  {adjustment}</Typography>
                <Typography>Total:  {total}</Typography>
            </Box>

        </Box>
    )
}

export default footer