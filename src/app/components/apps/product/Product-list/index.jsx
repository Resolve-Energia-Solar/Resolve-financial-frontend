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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import { MoreVert, Visibility, Add, CheckCircle, Save } from '@mui/icons-material';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';
import { useRouter } from 'next/navigation';
import ProductChip from '@/app/components/apps/product/components/ProductChip';
import productService from '@/services/productsService';
import saleService from '@/services/saleService';
import CreateProduct from '../Add-product';

const ProductCard = ({ sale = null }) => {
  const theme = useTheme();
  const [productList, setProductsList] = useState([]);
  const [onRefreshList, setOnRefreshList] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuOpenRowId, setMenuOpenRowId] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [initialProductIds, setInitialProductIds] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleRefreshList = () => {
    setOnRefreshList((prev) => !prev);
    setProductsList([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await saleService.getSalesProducts(sale.id);
        setSelectedProductIds(response.sale_products.map((item) => item.product.id));
        setInitialProductIds(response.sale_products.map((item) => item.product.id));
        setProductsList((prevProducts) => [
          ...prevProducts,
          ...response.sale_products.map((item) => item.product),
        ]);

        const responseDefault = await productService.getProductsDefault();
        setProductsList((prevProducts) => [
          ...prevProducts,
          ...responseDefault.results.filter(
            (product) => !prevProducts.map((item) => item.id).includes(product.id),
          ),
        ]);

        setProductsList(
          (prevProducts) =>
            prevProducts.sort((a, b) => {
              const isSelectedA = selectedProductIds.includes(a.id);
              const isSelectedB = selectedProductIds.includes(b.id);
              if (isSelectedA && !isSelectedB) return -1;
              if (!isSelectedA && isSelectedB) return 1;
              return 0;
            }),
        );
      } catch (error) {
        console.log('Error: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [onRefreshList]);

  const handleMenuClick = (event, id) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuOpenRowId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuOpenRowId(null);
  };

  const handleDetailClick = (id) => {
    router.push(`/products/${id}`);
  };

  const handleCreateClick = () => {
    setCreateModalOpen(true);
  };

  const handleApplyChanges = async () => {
    try {
      const response = await saleService.patchSaleProduct(sale.id, selectedProductIds);
      setInitialProductIds(selectedProductIds);
      handleRefreshList();
      console.log('Response: ', response);
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedProductIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((productId) => productId !== id)
        : [...prevSelectedIds, id],
    );
  };

  return (
    <>
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="subtitle1">
          Selecione um ou mais produtos ou adicione um novo produto.
        </Typography>
      </Alert>

      {sale?.sale_products && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
          {(selectedProductIds.length !== initialProductIds.length || 
            selectedProductIds.some((id) => !initialProductIds.includes(id))) && (
            <Chip
              label="Aplicar Mudanças"
              color="primary"
              icon={<Save />}
              onClick={handleApplyChanges}
              disabled={loading}
            />
          )}
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
            }}
          >
            <CardContent>
              <Add fontSize="large" color="primary" />
              <Typography variant="subtitle1" color="text.secondary">
                Adicionar Produto
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
          : productList.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card elevation={10}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle1">{product?.name}</Typography>
                        <ProductChip status={product?.default} />
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
                    <CustomCheckbox
                      disabled={product.default === 'N'}
                      checked={selectedProductIds.includes(product.id)}
                      onChange={() => handleCheckboxChange(product.id)}
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
            ))}
      </Grid>

      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <CreateProduct sale={sale} onClosedModal={() => setCreateModalOpen(false)} onRefresh={handleRefreshList} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateModalOpen(false)} color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductCard;
