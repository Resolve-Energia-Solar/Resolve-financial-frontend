import { Box, Button } from "@mui/material"

export default function Footer({ options, text, onClick }) {

    console.log('oioioi', options)

    return (
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} >

            {/* <Box>
                {text}
            </Box>
            {!complete && <Box>
                {options?.map((option) => (

                    <Button onClick={() => onClick(option.value)} >{option.label}</Button>
                ))
                }
            </Box>} */}
            <Box>
                Status da Tarefa
            </Box>
            <Box>
                <Button onClick={() => onClick('done')} sx={{ mr: 1, bgcolor: '#6fbf73', color: 'white', fontWeight: 'bold' }} >Concluído</Button>
                <Button onClick={() => onClick('inProgress')} sx={{ mr: 1, bgcolor: '#35baf6', color: 'white', fontWeight: 'bold' }}>Fazendo</Button>
                <Button onClick={() => onClick('prevented')} sx={{ mr: 1, bgcolor: '#ffac33', color: 'white', fontWeight: 'bold' }}>Impedido</Button>
            </Box >
        </Box >
    )
}