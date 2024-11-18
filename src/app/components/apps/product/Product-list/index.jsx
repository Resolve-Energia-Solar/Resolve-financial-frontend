import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Stack,
  Skeleton,
  useTheme,
  Chip,
  Box,
  Alert,
} from '@mui/material';
import { MoreVert, Visibility, Add, CheckCircle, Save } from '@mui/icons-material';
import CustomRadio from '@/app/components/forms/theme-elements/CustomRadio';
import { useRouter } from 'next/navigation';
import ProductChip from '@/app/components/apps/product/components/ProductChip';
import productService from '@/services/productsService';

const ProductCard = ({ sale = null }) => {
  const theme = useTheme();
  const [productList, setProductsList] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuOpenRowId, setMenuOpenRowId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await productService.getProducts(sale);
        setProductsList(response.results);
        console.log('Products: ', response.results);
      } catch (error) {
        console.log('Error: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sale]);

  const handleMenuClick = (event, id) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuOpenRowId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuOpenRowId(null);
  };

  const handleDetailClick = (id) => {
    setInvoiceToView(id);
    setDetailModalOpen(true);
  };

  const handleCreateClick = () => {
    setCreateModalOpen(true);
  };

  const handleRadioChange = (id) => {
    console.log('ID: ', id);
    console.log('Selected Product ID: ', selectedProductId);
    setSelectedProductId((prevSelectedId) => (prevSelectedId === id ? null : id));
  };

  return (
    <>
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="subtitle1">
            Selecione um produto ou adicione um novo produto.
        </Typography>   
        </Alert>
      {selectedProductId && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Chip
            label="Desselecionar"
            color="secondary"
            icon={<CheckCircle />}
            onClick={() => setSelectedProductId(null)}
          />
        </Box>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={10}
            onClick={handleCreateClick}
            sx={{
              cursor: 'pointer',
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selectedProductId ? theme.palette.primary.light : 'inherit',
            }}
          >
            <CardContent>
              {!selectedProductId ? (
                <Add fontSize="large" color="primary" />
              ) : (
                <Save fontSize="large" color="primary" />
              )}
              <Typography variant="subtitle1" color="text.secondary">
                {!selectedProductId ? 'Adicionar Produto' : 'Salvar Alteração'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {loading
          ? [...Array(3)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card elevation={10}>
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="rectangular" width="100%" height={10} sx={{ mt: 2 }} />
                  </CardContent>
                  <CardActions disableSpacing>
                    <Skeleton variant="circular" width={24} height={24} />
                  </CardActions>
                </Card>
              </Grid>
            ))
          : productList.map((product) => {
              const progressValue = product?.percentual_paid * 100 || 0;

              return (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card elevation={10}>
                    <CardContent>
                      <Stack spacing={1}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography variant="subtitle1">{product?.name}</Typography>
                          <ProductChip status={true} />
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="caption" color="text.secondary">
                            Valor do Produto
                          </Typography>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {Number(product?.product_value).toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                    <CardActions disableSpacing>
                      <CustomRadio
                        checked={selectedProductId === product.id}
                        onChange={() => handleRadioChange(product.id)}
                      />
                      <Tooltip title="Ações">
                        <IconButton
                          size="small"
                          onClick={(event) => handleMenuClick(event, product.id)}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Menu
                        anchorEl={menuAnchorEl}
                        open={menuOpenRowId === product.id}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      >
                        <MenuItem
                          onClick={() => {
                            handleDetailClick(product.id);
                            handleMenuClose();
                          }}
                        >
                          <Visibility fontSize="small" sx={{ mr: 1 }} />
                          Visualizar
                        </MenuItem>
                      </Menu>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
      </Grid>
    </>
  );
};

export default ProductCard;
