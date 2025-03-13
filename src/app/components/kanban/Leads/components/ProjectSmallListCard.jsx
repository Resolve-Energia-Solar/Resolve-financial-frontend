'use client'
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
import { addProduct, removeProductsByIds, associateProductWithLead, selectProductsByLead } from '@/store/products/customProducts';
import { useDispatch, useSelector } from 'react-redux';
import ProductService from '@/services/productsService';
import ListProducts from './ListProducts';



export function ProjectCard({ leadId = null }) {
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
      const productToDelete = customProducts.find(product => product.id === selectedProduct);
      if (productToDelete && productToDelete.default === "N") {
        await ProductService.deleteProduct(selectedProduct);
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
      spacing={0}
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
        justifyContent={'space-between'}
        sx={{ mb: 2, minHeight: 300 }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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

          <Grid item xs={11} >
            <Typography sx={{ fontWeight: '700', fontSize: "14px" }}>Projeto 01</Typography>
          </Grid>
        </Grid>

        <Grid container xs={12} sx={{ mb: 1, mt: 2 }}>
          <Grid item xs={10}>
            <Typography sx={{ fontWeight: '700', fontSize: "12px" }}>Kit Sol Feliz</Typography>
          </Grid>
          <Grid item xs={2} sx={{ justifyContent: 'flex-end', alignItems: 'center', display: 'flex' }}>
            <Typography sx={{ fontWeight: '700', fontSize: "12px" }}>Quantidade</Typography>
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
              <Typography sx={{ fontWeight: '500', fontSize: "12px" }}>{product.name}</Typography>
            </Grid>
            <Grid
              item
              xs={3}
              sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}
            >
              <Typography sx={{ fontWeight: '500', fontSize: "12px" }}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.product_value)}
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

        { customProducts.length === 0 && (
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: '200', fontSize: "12px" }}>Nenhum produto adicionado</Typography>
          </Grid>
        )}

        <Grid container xs={12} sx={{ mb: 1, mt: 2, justifyContent: 'space-between' }}>
          <Grid item xs={10}>
            <Typography sx={{ fontWeight: '700', fontSize: "14px" }}>Energia gerada pelo Kit</Typography>
          </Grid>
          <Grid item xs={2} sx={{ justifyContent: 'flex-end', alignItems: 'center', display: 'flex' }}>
            <Typography sx={{ fontWeight: '600', fontSize: "12px" }}>2500 kWh</Typography>
          </Grid>
        </Grid>


        <Grid item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
          <IconButton
            sx={{
              mt: 2,
              color: '#7E8388',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
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
            <Typography variant="body2">Adicionar produto</Typography>
          </IconButton>

          <IconButton
            sx={{
              mt: 2,
              color: '#7E8388',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              transition: '0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor: 'rgba(0, 0, 0, 0.00)',
              },
            }}
            onClick={() => { setDialogExistingProductOpen(true) }}
          >
            <Search sx={{ fontSize: 18 }} />
            <Typography variant="body2">Adicionar existente</Typography>
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
          <ListProducts onAddProduct={addCustomProduct} onClosedModal={() => setDialogExistingProductOpen(false)} />
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
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza de que deseja excluir este produto? Esta ação não pode ser desfeita em produtos personalizados.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default ProjectCard;
