import { Avatar, Grid, IconButton, useTheme, Typography, } from "@mui/material"
import { useContext, useState } from "react";
import { LeadModalTabContext } from "../../context/LeadModalTabContext";
import EditIcon from '@mui/icons-material/Edit';

export function LeadInfoHeaderProfile({ leadId, tabValue }) {

    const { lead } = useContext(LeadModalTabContext);
    const theme = useTheme();

    return (
        <Grid container size="auto" alignItems="center" spacing={2}>
            <Grid item size="auto" sx={{ position: 'relative', display: 'inline-block', alignItems: 'center', justifyContent: 'center' }}>
                <Avatar
                    sx={{
                    width: 55,
                    height: 55,
                    backgroundColor: '#D9D9D9',
                    alignItems: 'center',
                    justifyContent: 'center',
                    }}
                >
                    {' '}
                    {/* {lead?.img} */}
                    {/* {placeholder?} */}
                </Avatar>
                <IconButton
                    sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.light,
                    width: 20.23,
                    height: 20.23,
                    '&:hover': { backgroundColor: theme.palette.secondary.main },
                    }}
                >
                    <EditIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </Grid>

            <Grid item size="auto" sx={{ position: 'relative', display: 'inline-block'}}>
                <Typography variant="caption" sx={{ color: 'gray' }}>
                    Cliente
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {lead?.name}
                </Typography>
            </Grid>
        </Grid>
    );
}