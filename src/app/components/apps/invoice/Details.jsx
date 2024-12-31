import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import { Box, Chip, Grid, MenuItem } from "@mui/material";
import InstallamentDrawer from "./InstallmentDrawer";
import StatusChip from "@/utils/status/DocumentStatusIcon";
import CustomSelect from "../../forms/theme-elements/CustomSelect";
import StatusInspectionChip from "@/utils/status/InspecStatusChip";

export default function Details({ data, handleInputChange }) {

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="address">Venda</CustomFormLabel>
          <CustomTextField
            type="text"
            value={data.sale.customer.complete_name}
            fullWidth
            margin="normal"
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="address">Data de Contrato</CustomFormLabel>
          <CustomTextField
            type="text"
            value={data.sale?.signature_date}
            fullWidth
            margin="normal"
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="address">Status da Venda</CustomFormLabel>
          <Box p={1.4} />
          <StatusChip status={data.status} />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="address">Valor de Referência</CustomFormLabel>
          <CustomTextField
            name="interim_protocol"
            type="text"
            value={''}

            fullWidth
            margin="normal"
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="address">Valor de Projeto</CustomFormLabel>
          <CustomTextField
            name="interim_protocol"
            type="decimal"
            value={Number(data.sale.total_value).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
            fullWidth
            margin="normal"
            disabled
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="address">Status do Projeto</CustomFormLabel>
          <CustomTextField
            name="interim_protocol"
            type="text"
            value={''}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="address">Status da vistoria</CustomFormLabel>
          <Box p={1.4} />
          <StatusInspectionChip data />
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="address">Status do pagamento</CustomFormLabel>
          <Box p={1} />
          <CustomSelect fullWidth value={data.sale.payment_status} name='payment_status' onChange={(e) => handleInputChange(e, data.sale.id)} >
            <MenuItem value="P" >
              <Chip label="Pago" color="success" />
            </MenuItem>
            <MenuItem value="L">
              <Chip label="Liberado" color="primary" />
            </MenuItem>
            <MenuItem value="PE">
              <Chip label="Pendente" color="secondary" />
            </MenuItem>
          </CustomSelect>
        </Grid>
        <Grid item xs={12} sm={12} lg={4}>
          <CustomFormLabel htmlFor="address">Qtd. Parcelas</CustomFormLabel>
          <CustomTextField
            name="interim_protocol"
            type="text"
            value={data.installments.length}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled
          />
        </Grid>
      </Grid>
      <InstallamentDrawer data={data?.installments} />
    </Box>
  );
}