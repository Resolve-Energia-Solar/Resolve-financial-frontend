import { Box, CardContent, Drawer } from "@mui/material";
import ParentCard from "./ParentCard";

export default function SideDrawer({ title, children, open, onClose }) {

    return (
        <Drawer anchor='right' open={open} onClose={onClose}>
            <Box maxWidth='50vw' minWidth='50vw'>
                <ParentCard title={title} onEdit={'oxi'} footer='odi' >
                    <CardContent>
                        {children}
                    </CardContent>
                </ParentCard>
            </Box>
        </Drawer>
    )

}