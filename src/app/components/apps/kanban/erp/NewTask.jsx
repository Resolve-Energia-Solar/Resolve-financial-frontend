import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { Box, Button, Dialog, DialogContent, DialogTitle, MenuItem, Select, styled, Typography } from "@mui/material";


const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        width: '90%',
        maxWidth: '50vw',
        height: '60vh'
    },
}));

export default function NewTask({ saveTask, project, open, onClose, tasksTemplate }) {

     console.log(tasksTemplate);

    return (
        <StyledDialog open={open} onClose={onClose} >
            <DialogTitle>
                <Typography variant="h6">
                    Nova Tarefa
                </Typography>
            </DialogTitle>
            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} >
                <Box>
                    <Typography variant="h6">
                        {project?.project.project_number}
                    </Typography>
                    <Box>
                        <CustomFormLabel>Tarefa</CustomFormLabel>
                        <Select sx={{ width: 200 }}>
                            <MenuItem >
                                {'Escolha um opção'}
                            </MenuItem>
                            {tasksTemplate?.map((item) => (
                                <MenuItem value={item.id} key={item.id}>
                                    {item.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                </Box>
                <Box display='flex' justifyContent='flex-end' width={'100%'} >
                    <Button onClick={saveTask}>Salvar</Button>
                </Box>
            </DialogContent>
        </StyledDialog >
    )

}