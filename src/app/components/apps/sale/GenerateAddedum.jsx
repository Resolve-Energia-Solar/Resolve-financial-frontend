import { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    TextField,
    Box,
    useTheme,
    CircularProgress
} from "@mui/material";
import saleService from "@/services/saleService";
import { useSystemConfig } from "@/context/SystemConfigContext";
import { useSnackbar } from "notistack";

export default function GenerateAddendum({ sale, open, onClose }) {
    const theme = useTheme();
    const { config } = useSystemConfig();

    const [form, setForm] = useState({ before_addendum: "", after_addendum: "" });
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    if (!sale) return null;

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.before || !form.after) return;

        setLoading(true);
        try {
            const res = await saleService.generateAddendum({
                sale_id: sale.id,
                before_addendum: form.before,
                after_addendum: form.after,
            });
            const blob = res.data;
            const filename = `termo_aditivo_${sale.contract_number}.pdf`;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);

            enqueueSnackbar("Anexo gerado!", { variant: "success" });
            onClose();
        } catch (err) {
            console.error(err);
            enqueueSnackbar("Falha ao gerar PDF.", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Gerar Termo Aditivo</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1" gutterBottom>
                    O termo aditivo formaliza alterações no contrato de venda, como prazos, valores, produtos ou condições. Certifique-se de revisar todas as informações antes de finalizar, pois o documento terá implicações legais e financeiras.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Após a geração, o termo estará disponível para download em PDF e na aba de anexos, pronto para revisão e assinatura pelas partes envolvidas.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        name="before"
                        label="Antes do Aditivo"
                        value={form.before}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        required
                    />
                    <TextField
                        name="after"
                        label="Depois do Aditivo"
                        value={form.after}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        required
                    />
                    <Typography variant="caption" mt={2} display="block">
                        Dúvidas? Contate o{" "}
                        <Link href={`mailto:${config?.configs?.support_email}`} passHref>
                            <Typography
                                component="a"
                                variant="caption"
                                sx={{ textDecoration: "underline", color: theme.palette.primary.main }}
                            >
                                suporte
                            </Typography>
                        </Link>
                        .
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    form={undefined}
                    variant="contained"
                    disabled={loading || !form.before || !form.after}
                    startIcon={loading && <CircularProgress size={20} />}
                    onClick={handleSubmit}
                >
                    {loading ? "Gerando..." : "Gerar PDF"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

GenerateAddendum.propTypes = {
    sale: PropTypes.shape({ id: PropTypes.number.isRequired }),
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
