import { Box, CardContent, Drawer } from "@mui/material";
import ParentCard from "./ParentCard";

export default function SideDrawer({ title, children, open, onClose }) {

    return (
        <Drawer anchor='right' open={open} onClose={onClose}  sx={{ zIndex: 9999 }}>
            <Box maxWidth='50vw' minWidth='50vw'>
                <ParentCard title={title}  >
                    <CardContent>
                        {children}
                    </CardContent>
                </ParentCard>
            </Box>
        </Drawer>
    )

}