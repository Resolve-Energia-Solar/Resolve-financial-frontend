import { Box, CardContent, Drawer, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ParentCard from "@/app/components/shared/ParentCard";


export default function SideDrawer({ title, children, open, onClose }) {

    return (
        <Drawer anchor='right' open={open} onClose={onClose} sx={{ zIndex: 9999 }} >
            <Box maxWidth='50vw' minWidth='50vw'>
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