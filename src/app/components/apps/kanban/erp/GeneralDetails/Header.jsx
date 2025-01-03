import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { Box, Grid } from "@mui/material";

export default function Header({data}) {

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={12} lg={4}>
                <Box>
                    <CustomFormLabel htmlFor="Nome Contrante" >Contrante</CustomFormLabel>
                    <CustomTextField disabled value={data?.sale?.customer?.complete_name}
                    />
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
                <Box>
                    <CustomFormLabel htmlFor="Nome Contrante" >Homologador</CustomFormLabel>
                    <CustomTextField disabled value={data?.homologator?.complete_name} />
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
                <Box>
                    <CustomFormLabel htmlFor="Nome Contrante" >Data do Contrato</CustomFormLabel>
                    <CustomTextField disabled value={data?.sale?.signature_date} />
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
                <Box>
                    <CustomFormLabel htmlFor="Nome Contrante" >Status Vistoria</CustomFormLabel>
                    <CustomTextField disabled value={data?.inspection ? data?.inspection.status : 'Não Vinculada'} />
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
                <Box>
                    <CustomFormLabel htmlFor="Nome Contrante" >Status Documentação</CustomFormLabel>
                    <CustomTextField disabled value={data?.is_documentation_completed ? 'Concluído' : 'Em andamento'} />
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
                <Box>
                    <CustomFormLabel htmlFor="Nome Contrante" >Status Financeiro</CustomFormLabel>
                    <CustomTextField disabled value={data?.sale?.payment_status} />
                </Box>
            </Grid>
        </Grid>
    )
}