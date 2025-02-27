import {
    Box,
    Typography,
    Grid,
    IconButton,
    TextField,
    InputAdornment,
    Divider,
} from '@mui/material';
import { Search, Delete, ShoppingCart } from '@mui/icons-material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const products = [
    { id: 1, name: 'HANERSUN 585W', quantity: 6 },
    { id: 2, name: 'GOODWE 3,3KW', quantity: 1 },
    { id: 3, name: 'Cabo Solar Flexível 6MM 1,8KV CC RL 25 Vermelho', quantity: 25 },
    { id: 4, name: 'Cabo Solar Flexível 6MM 1,8KV CC RL 25 Preto', quantity: 25 },
    { id: 5, name: 'Estrutura Solar Romagnole 412210 RS223 Kit Fixação 4 Painéis', quantity: 6 },
];

export function ProductList() {
    return (
        <Grid
            container
            spacing={0}
            sx={{
                borderRadius: '12px',
                border: '1px solid #E0E0E0',
                p: 3,
            }}
        >
            <Grid
                container
                alignItems={'center'}
                spacing={0}
                justifyContent={'space-between'}
                sx={{ mb: 2, minHeight: 300 }}
            >
                {/* CARD HEADER!!!!!!!!!!!!! */}
                <Grid
                    item
                    xs={12}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                        mb: 1,
                    }}
                >
                    <Grid item xs={1}>
                        <img
                            src={'/images/svgs/solar-panel-icon-with-circle.png'}
                            alt={'solar panel icon'}
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 0,
                                mr: 1,
                            }}
                        />
                    </Grid>

                    <Grid item xs={8} sx={{ fontWeight: 'bold', ml: 1 }}>
                        <Typography variant="h5">Produtos da Proposta</Typography>
                    </Grid>

                    <Grid item xs={8} sx={{ justifyContent: 'flex-end' }}>
                        <TextField
                            fullWidth
                            placeholder="Pesquisar produto"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>

                {/* TABLE HEADER */}
                <Grid container xs={12} sx={{ fontWeight: 'bold', mb: 1, mt: 2 }}>
                    <Grid item xs={9}>
                        <Typography variant="h6">Produto</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="h6">Quantidade</Typography>
                    </Grid>
                </Grid>

                {/* TABLE BODY */}
                {products.map((product, index) => (
                    <Grid
                        container
                        key={product.id}
                        alignItems="center"
                        rowSpacing={1}
                        sx={{
                            borderBottom: index !== products.length - 1 ? '1px solid #e0e0e0' : 'none',
                            paddingY: 1.5,
                        }}
                    >
                        <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2">{product.name}</Typography>
                        </Grid>
                        <Grid
                            item
                            xs={3}
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Typography variant="body2">{product.quantity}</Typography>
                        </Grid>
                        <Grid
                            item
                            xs={1}
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <IconButton size="small" color="#00000">
                                <DeleteOutlinedIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}

                {/* ADD PRODUCT!*/}
                <Typography
                    variant="body2"
                    color="action"
                    sx={{ mt: 2, cursor: 'pointer', alignItems: 'center', p: 2 }}
                >
                    <AddOutlinedIcon sx={{ fontSize: 15 }} />
                    Adicionar produto
                </Typography>
            </Grid>
        </Grid>
    );
}

export default ProductList;
