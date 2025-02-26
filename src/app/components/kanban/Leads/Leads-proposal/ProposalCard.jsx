import { Box, Typography, Grid, IconButton, TextField, InputAdornment, Divider } from '@mui/material';
import { Search, Delete, ShoppingCart } from '@mui/icons-material';

const products = [
    {id: 1, name: 'HANERSUN 585W', quantity: 6,},
    {id: 2, name: 'GOODWE 3,3KW', quantity: 1,},
    {id: 3, name: 'Cabo Solar Flexível 6MM 1,8KV CC RL 25 Vermelho', quantity: 25,},
    {id: 4, name: 'Cabo Solar Flexível 6MM 1,8KV CC RL 25 Preto', quantity: 25,},
    {id: 5, name: 'Estrutura Solar Romagnole 412210 RS223 Kit Fixação 4 Painéis', quantity: 6,},
];

export function ProductList() {
    return (
        <Grid container spacing={0}>
      <Grid item xs={12}></Grid>
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <IconButton>
                    <Search />
                </IconButton>

                <Typography variant="h6">Produtos da Proposta</Typography>
            
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
            </Box>
            <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                    {products.map((product) => (
                        <Grid item xs={12} key={product.id}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography>{product.name}</Typography>
                                <Typography>{product.quantity}</Typography>
                            </Box>
                            <Divider />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
        </Grid>
    );
}

export default ProductList;

