import React, { useState, useEffect, useContext } from 'react';
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
  DialogContent,
  DialogActions,
  Button,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { MoreVert, Visibility } from '@mui/icons-material';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';
import ProductChip from '@/app/components/apps/product/components/ProductChip';
import productService from '@/services/productsService';
import DetailProduct from '../Product-detail';
import { OnboardingSaleContext } from '@/app/context/OnboardingCreateSale';
import SearchInput from '@/app/components/forms/theme-elements/SearchInput';

const ListProductsDefault = () => {
  const theme = useTheme();
  const [productList, setProductsList] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuOpenRowId, setMenuOpenRowId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [allowMultipleSelection, setAllowMultipleSelection] = useState(false);

  const [kwpValue, setKwpValue] = useState('');
  const [kwpRange, setKwpRange] = useState([]);
  const [errorKwp, setErrorKwp] = useState('');

  const handleSearchSubmit = (value) => {
    if (value.trim() === '') {
      setErrorKwp('');
      setKwpRange([]);
      return;
    }

    const kwpNumber = parseFloat(value);

    if (!isNaN(kwpNumber)) {
      setErrorKwp('');
      const delta = 20;
      const generatedRange = [kwpNumber - delta, kwpNumber + delta];
      setKwpRange(generatedRange);
      console.log('Intervalo de Kwp:', generatedRange);
    } else {
      setErrorKwp('Por favor, insira um número válido para Kwp.');
    }
  };

  const { productIds, setProductIds, setTotalValue } = useContext(OnboardingSaleContext);

  const handleCheckboxChange = (id) => {
    setProductIds((prevProductIds) => {
      const newProductIds = prevProductIds.includes(id)
        ? prevProductIds.filter((productId) => productId !== id)
        : [...prevProductIds, id];
  
      const totalValue = newProductIds.reduce((acc, productId) => {
        const product = productList.find((p) => p.id === productId);
        return acc + (Number(product?.product_value) || 0);
      }, 0);
      setTotalValue(totalValue);
  
      return newProductIds;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const responseDefault = await productService.getProducts({
          default__in: 'S',
          kwp_in: kwpRange.join(','),
          limit: 6,
        });
        setProductsList(responseDefault.results);
        console.log('Products: ', responseDefault);
      } catch (error) {
        console.log('Error: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kwpRange]);

  const handleMenuClick = (event, id) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuOpenRowId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuOpenRowId(null);
  };

  const handleDetailClick = (id) => {
    setDetailModalOpen(true);
    setSelectedProductDetail(id);
  };

  return (
    <>
      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Selecione um ou mais produtos</Typography>
      </Alert>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Switch
                checked={allowMultipleSelection}
                onChange={(e) => setAllowMultipleSelection(e.target.checked)}
              />
            }
            label="Permitir seleção múltipla"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SearchInput
            value={kwpValue}
            onChange={setKwpValue}
            onSubmit={handleSearchSubmit}
            placeholder="Digite o valor de Kwp"
            errorMessage={errorKwp}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
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
                      disabled={
                        product.default === 'N' ||
                        (!allowMultipleSelection &&
                          productIds.length > 0 &&
                          !productIds.includes(product.id))
                      }
                      checked={productIds.includes(product.id)}
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

      <Dialog
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <DetailProduct productId={selectedProductDetail} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailModalOpen(false)} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListProductsDefault;
