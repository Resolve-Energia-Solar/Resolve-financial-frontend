import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { Box, Button, Dialog, DialogContent, DialogTitle, MenuItem, Select, styled, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        width: '90%',
        maxWidth: '50vw',
        height: '60vh'
    },
}));

export default function NewTask({ saveTask, project, open, onClose, tasksTemplate }) {

    const [item, setItem] = useState();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem( value );
    }

    return (
        <StyledDialog open={open} onClose={onClose} >
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                        Nova Tarefa
                    </Typography>
                    <Box>
                        <CloseIcon onClick={onClose} />
                    </Box>
                </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} >
                <Box>
                    <Typography variant="h6">
                        {project?.project.project_number}
                    </Typography>
                    <Box>
                        <CustomFormLabel>Tarefa</CustomFormLabel>
                        <Select sx={{ width: 200 }}
                            name={'taskTemplate'}

                            onChange={handleChange}
                        >

                            {tasksTemplate?.map((item) => (
                                <MenuItem value={item} key={item.id}>
                                    {item.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                </Box>
                <Box display='flex' justifyContent='flex-end' width={'100%'} >
                    <Button onClick={() => saveTask(item)}>Salvar</Button>
                </Box>
            </DialogContent>
        </StyledDialog >
    )

}