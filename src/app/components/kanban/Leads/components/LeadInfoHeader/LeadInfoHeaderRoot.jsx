import {
    Grid,
    Box,
  } from '@mui/material';

export function LeadInfoHeaderRoot({ children, }) {

    return (  
            <Grid container xs={12} size="auto" 
                sx={{ 
                    width: '100%',
                    borderBottom: '1px solid #E0E0E0',
                    borderRadius: '0px', 
                    p: "16px", 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between' 
                }}
            >
                {children}
            </Grid>

    );
}