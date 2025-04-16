import { Grid, useTheme, Typography, Rating } from "@mui/material";
import { useContext } from "react";
import { LeadModalTabContext } from "../../context/LeadModalTabContext";
import { WbSunny } from "@mui/icons-material";

export function LeadInfoHeaderInterestLevel({ leadId, tabValue }) {

    const { lead } = useContext(LeadModalTabContext);
    const theme = useTheme();

    return (
        <Grid item sx={{ gridArea: 'interest' }}>
            <Grid container size="auto" display="flex" alignItems="center" spacing={2} sx={{ ml: 0.2 }}>
                <Grid
                    item
                    xs={12}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                >
                    <Grid
                        item
                        sx={{
                            display: 'flex',
                            flexDirection: 'column ',
                            alignItems: 'flex-start',
                        
                        }}
                    >
                        <Typography variant="caption" sx={{ color: 'gray', mb: 0.5 }}>
                            Nível de interesse
                        </Typography>
                        <Rating
                            value={lead?.qualification}
                            max={5}
                            readOnly
                            size="normal"
                            sx={{ gap: 0.8 }}
                            icon={<WbSunny fontSize="inherit" sx={{ color: theme.palette.primary.main }} />}
                            emptyIcon={
                                <WbSunny fontSize="inherit" sx={{ color: theme.palette.action.disabled }} />
                            }
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}