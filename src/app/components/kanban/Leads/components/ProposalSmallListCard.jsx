'use client';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';

import { Search } from '@mui/icons-material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CreateProduct from '@/app/components/apps/product/Add-product';
import { useState } from 'react';
import {
  addProduct,
  removeProductsByIds,
  associateProductWithLead,
  selectProductsByLead,
} from '@/store/products/customProducts';
import { useDispatch, useSelector } from 'react-redux';
import ProductService from '@/services/productsService';
import ListProducts from './ListProducts';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';



export function ProposalCard({ leadId = null }) {
  const dispatch = useDispatch();
  const [dialogProductOpen, setDialogProductOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [dialogExistingProductOpen, setDialogExistingProductOpen] = useState(false);

  const customProducts = useSelector(selectProductsByLead(leadId));

  const addCustomProduct = (product) => {
    dispatch(addProduct(product));
    dispatch(associateProductWithLead({ leadId: leadId, productId: product.id }));
  };

  const confirmDelete = async () => {
    try {
      const productToDelete = customProducts.find((product) => product.id === selectedProduct);
      if (productToDelete && productToDelete.default === 'N') {
        await ProductService.delete(selectedProduct);
      }
      dispatch(removeProductsByIds([selectedProduct]));
      setDeleteModalOpen(false);
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteModalOpen(true);
    setSelectedProduct(id);
  };

  return (
    <Grid
      container
      sx={{
        borderRadius: '12px',
        border: '1px solid #E0E0E0',
        m: 0,
        p: 4,
      }}
    >
      <Grid
        container
        alignItems={'center'}
        spacing={0}
        sx={{ minHeight: 200 }}
        // justifyContent={"space-between"}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 1,
            mb: 1,
          }}
        >
          <Grid item  sx={{ display: "flex", justifyContent: "flex-start"}}>
            <img
              src={'/images/svgs/solar-panel-icon-with-circle.png'}
              alt={'solar panel icon'}
              sx={{
                width: 36,
                height: 36,
                borderRadius: 0,
              }}
            />
          </Grid>

          <Grid item sx={{ display: "flex", justifyContent: "flex-start"}}>
            <Typography sx={{ fontWeight: '700', fontSize: "14px" }}>Proposta</Typography>
          </Grid>
        </Grid>

        <Grid container xs={12} sx={{ mb: 1, mt: 2 }}>
          <Grid item xs={10}>
            <Typography sx={{ fontWeight: '700', fontSize: "12px" }}>Produto</Typography>
          </Grid>
          <Grid
            item
            xs={2}
            sx={{ justifyContent: 'flex-end', alignItems: 'center', display: 'flex' }}
          >
            <Typography sx={{ fontWeight: '700', fontSize: '12px' }}>Quantidade</Typography>
          </Grid>
        </Grid>

        {customProducts.map((product, index) => (
          <Grid
            container
            key={product.id}
            alignItems="center"
            rowSpacing={1}
            sx={{
              paddingY: 1.5,
            }}
          >
            <Grid item xs={8} sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Typography sx={{ fontWeight: '500', fontSize: '12px' }}>{product.name}</Typography>
            </Grid>
            <Grid
              item
              xs={3}
              sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}
            >
              <Typography sx={{ fontWeight: '500', fontSize: '12px' }}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  product.product_value,
                )}
              </Typography>
            </Grid>
            <Grid
              item
              xs={1}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <IconButton size="small" color="#00000" onClick={() => handleDeleteClick(product.id)}>
                <DeleteOutlinedIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        {customProducts.length === 0 && (
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Typography sx={{ fontWeight: '200', fontSize: '12px' }}>
              Nenhum produto adicionado
            </Typography>
          </Grid>
        )}

        <Grid container xs={12} sx={{ mb: 1, mt: 2, justifyContent: 'space-between' }}>
          <Grid item xs={10}>
            <Typography sx={{ fontWeight: '700', fontSize: '14px' }}>
              Energia gerada pelo Kit
            </Typography>
          </Grid>
          <Grid
            item
            xs={2}
            sx={{ justifyContent: 'flex-end', alignItems: 'center', display: 'flex' }}
          >
            <Typography sx={{ fontWeight: '600', fontSize: '12px' }}>2500 kWh</Typography>
          </Grid>
        </Grid>


        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 2, mt: 2 }}>
          <IconButton
            sx={{
              p: 0,
              color: '#7E8388',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: "flex-start",
              gap: 0.5,
              transition: '0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor: 'rgba(0, 0, 0, 0.00)',
              },
            }}
            onClick={() => setDialogProductOpen(true)}
          >
            <AddOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontWeight: '600', fontSize: '12px' }}>Adicionar novo</Typography>
          </IconButton>

          <IconButton
            sx={{
              p: 0,
              color: '#7E8388',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: "flex-start",
              gap: 0.5,
              transition: '0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor: 'rgba(0, 0, 0, 0.00)',
              },
            }}
            onClick={() => {
              setDialogExistingProductOpen(true);
            }}
          >
            <Search sx={{ fontSize: 18 }} />
            <Typography sx={{ fontWeight: '600', fontSize: '12px' }}>
              Adicionar existente
            </Typography>
          </IconButton>
        </Grid>
      </Grid>

      <Dialog
        open={dialogExistingProductOpen}
        onClose={() => setDialogExistingProductOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent>
          <ListProducts
            onAddProduct={addCustomProduct}
            onClosedModal={() => setDialogExistingProductOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogProductOpen}
        onClose={() => setDialogProductOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <CreateProduct
            onAddProduct={addCustomProduct}
            onClosedModal={() => setDialogProductOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#FA896B',
            fontWeight: '700',
            fontSize: '18px',
          }}
        >
          <WarningAmberIcon sx={{ color: '#FA896B', fontSize: '26px' }} />
          Confirmar Exclusão
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              backgroundColor: '#FFF7F7',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #FFCDD2',
            }}
          >
            <Typography sx={{ fontSize: '14px', color: '#333' }}>
              Tem certeza de que deseja excluir este produto?{' '}
              <strong>Esta ação não pode ser desfeita em produtos personalizados.</strong>
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ padding: '16px' }}>
          <Button
            onClick={() => setDeleteModalOpen(false)}
            variant="outlined"
            sx={{
              // borderColor: 'secondary',
              color: 'secondary',
              // '&:hover': {
              //   backgroundColor: '#F0F0F0',
              //   borderColor: '#7E8388',
              // },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            // sx={{
            //   backgroundColor: '#FF5A5F',
            //   '&:hover': {
            //     backgroundColor: '#E0484C',
            //   },
            // }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default ProposalCard;
