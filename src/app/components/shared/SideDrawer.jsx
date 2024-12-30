import { Box, CardContent, Drawer, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ParentCard from "./ParentCard";

export default function SideDrawer({ title, children, open, onClose }) {

    return (
        <Drawer anchor='right' open={open} onClose={onClose} >
            <Box
                sx={{
                    width: { xs: '100vw', sm: '100vw' },
                    maxWidth: { md: '70vw' },
                    height: '100vh',
                    position: 'relative'
                }} >
                <IconButton 
                    onClick={onClose} 
                    sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8 
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <ParentCard title={title}  >
                    <CardContent>
                        {children}
                    </CardContent>
                </ParentCard>
            </Box>
        </Drawer>
    )

}