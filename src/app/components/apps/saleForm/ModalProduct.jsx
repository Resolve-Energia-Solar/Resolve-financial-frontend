'use client';
import ProductService from '@/services/productsService';
import Card from '@mui/material/Card';
import { Box, CardContent, Dialog, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const ModalProduct = ({ open, setOpen, product }) => {
  const [products, setProducts] = useState();

  const fetchProducts = async () => {
    const data = await ProductService.index();
    setProducts(data.results);
  };
  useEffect(() => {
    fetchProducts();
  });

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Box sx={{ padding: 3 }}>
        <Grid
          container
          spacing={3}
          sx={{
            justifySelf: 'center',
            alignItems: 'stretch',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          }}
        >
          {products?.map((product) => (
            <Grid key={product.id} item xs={12} sm={12} lg={4}>
              <Card onClick={product}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {product.description}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {product.product_value}
                  </Typography>
                  {product.materials.map((material) => (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {material.name}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Dialog>
  );
};

export default ModalProduct;
