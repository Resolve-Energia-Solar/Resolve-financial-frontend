import { Box, CardContent, Drawer } from "@mui/material";
import ParentCard from "./ParentCard";

export default function SideDrawer({ title, children, open, onClose }) {

    return (
        <Drawer anchor='right' open={open} onClose={onClose}>
            <Box maxWidth='70vw' minWidth='70vw'>
                <ParentCard title={title}  >
                    <CardContent>
                        {children}
                    </CardContent>
                </ParentCard>
            </Box>
        </Drawer>
    )

}