import { Box, CardContent, Drawer } from "@mui/material";
import ParentCard from "./ParentCard";

export default function SideDrawer({ title, children, open, onClose }) {

    return (
        <Drawer anchor='right' open={open} onClose={onClose} >
            <Box
                sx={{
                    width: { xs: '100vw', sm: '100vw' },
                    maxWidth: { md: '70vw' },
                    height: '100vh',
                }} >
                <ParentCard title={title}  >
                    <CardContent>
                        {children}
                    </CardContent>
                </ParentCard>
            </Box>
        </Drawer>
    )

}