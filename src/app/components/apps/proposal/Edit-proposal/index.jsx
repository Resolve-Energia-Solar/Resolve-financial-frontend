import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import useProposalForm from '@/hooks/proposal/useProposalForm';
import AutoCompleteLead from '../../comercial/sale/components/auto-complete/Auto-Input-Leads';
import FormDate from '@/app/components/forms/form-custom/FormDate';
import FormSelect from '@/app/components/forms/form-custom/FormSelect';
import CustomFieldMoney from '../../invoice/components/CustomFieldMoney';
import CustomTextArea from '@/app/components/forms/theme-elements/CustomTextArea';
import ProductService from '@/services/productsService';
import { Add } from '@mui/icons-material';
import CreateProduct from '../../product/Add-product';
import useProposal from '@/hooks/proposal/useProposal';

const ProposalEditForm = ({ onClosedModal = null, proposalId = null, onRefresh = null }) => {
  const { loading, error, proposalData } = useProposal(proposalId);

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    loading: formLoading,
    success,
  } = useProposalForm(proposalData, proposalId);


  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalValue, setTotalValue] = useState(0);

  const [dialogProductOpen, setDialogProductOpen] = useState(false);

  formData.commercial_products_ids = selectedProducts;

  useEffect(() => {
    if (proposalData?.commercial_products) {

      const products_proposal = proposalData?.commercial_products.map((item) => item.product);
      setProducts(products_proposal);

      const selected = proposalData.commercial_products.map((item) => item.product.id);
      setSelectedProducts(selected);
      formData.commercial_products_ids = selected;
    }
  }, [proposalData]);
  

  useEffect(() => {
    const total = selectedProducts.reduce((acc, productId) => {
      const product = products.find((p) => p.id === productId);
      const productValue = parseFloat(product?.product_value) || 0;
      return acc + productValue;
    }, 0);
    setTotalValue(total);
  }, [selectedProducts, products]);

  formData.value = totalValue;

  const status_options = [
    { value: 'A', label: 'Aceita' },
    { value: 'P', label: 'Pendente' },
    { value: 'R', label: 'Rejeitada' },
  ];

  const addProductToList = (product) => {
    setProducts((prevProducts) => [product, ...prevProducts]);
    setSelectedProducts((prevSelected) => [...prevSelected, product.id]);
  };

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) => {
      const isSelected = prevSelected.includes(productId);
      const updatedSelection = isSelected
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId];
      return updatedSelection;
    });
  };

  useEffect(() => {
    if (success) {
      if (onClosedModal) {
        onClosedModal();
        onRefresh();
      }
    }
  }, [success]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} lg={4}>
        <CustomFormLabel htmlFor="value">Valor</CustomFormLabel>
        <CustomFieldMoney
          name="value"
          fullWidth
          value={formData.value}
          disabled
          onChange={(value) => handleChange('value', value)}
          {...(formErrors.value && { error: true, helperText: formErrors.value })}
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={4}>
        <FormDate
          name="due_date"
          label="Data de Vencimento"
          value={formData.due_date}
          onChange={(value) => handleChange('due_date', value)}
          {...(formErrors.due_date && { error: true, helperText: formErrors.due_date })}
        />
      </Grid>
      <Grid item xs={12} sm={12} lg={4}>
        <FormSelect
          label="Status"
          options={status_options}
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          {...(formErrors.status && { error: true, helperText: formErrors.status })}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <CustomFormLabel htmlFor="observation">Observação</CustomFormLabel>
        <CustomTextArea
          name="observation"
          multiline
          rows={4}
          minRows={4}
          value={formData.observation}
          onChange={(e) => handleChange('observation', e.target.value)}
          {...(formErrors.observation && { error: true, helperText: formErrors.observation })}
        />
      </Grid>

      <Grid item xs={12}>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogProductOpen(true)}
          >
            Adicionar Produto
          </Button>
        </Stack>

        {products && products.map((product) => (
          <Accordion key={product.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${product.id}-content`}
              id={`panel-${product.id}-header`}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Checkbox
                  checked={selectedProducts.includes(product.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => handleCheckboxChange(product.id)}
                />
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {(product.default === "S" && 'Padrão') || 'Personalizado'}
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <strong>Tipo de telhado:</strong> {product.roof_type.name}
              </Typography>
              <Typography>
                <strong>Valor do produto:</strong>{' '}
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  product.product_value,
                )}
              </Typography>
              <Typography>
                <strong>Materiais:</strong>
              </Typography>
              <ul>
                {product.materials.map((material) => (
                  <li key={material.id}>
                    {material.material.name} - {material.material.price}
                    <ul>
                      {material.material.attributes.map((attribute, idx) => (
                        <li key={idx}>
                          {attribute.key}: {attribute.value}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </AccordionDetails>
          </Accordion>
        ))}
      </Grid>

      <Grid item xs={12}>
        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={formLoading}
            endIcon={formLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {formLoading || success ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </Stack>
      </Grid>

      <Dialog
        open={dialogProductOpen}
        onClose={() => setDialogProductOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <CreateProduct onAddProduct={addProductToList} onClosedModal={() => setDialogProductOpen(false)} />
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default ProposalEditForm;
