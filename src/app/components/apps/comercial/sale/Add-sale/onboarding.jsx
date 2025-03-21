// Arquivo: onboarding.jsx
import React, { Fragment, useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
  OnboardingSaleContextProvider,
  OnboardingSaleContext,
} from '@/app/context/OnboardingCreateSale';
import ListProductsDefault from '../../../product/Product-list/ListProductsDefault';
import PaymentCard from '../../../invoice/components/paymentList/card';
import useSaleForm from '@/hooks/sales/useSaleForm';
import { useDispatch, useSelector } from 'react-redux';
import saleService from '@/services/saleService';
import paymentService from '@/services/paymentService';
import ChecklistSales from '../../../checklist/Checklist-list/ChecklistSales';
import SchedulesInspections from '../../../project/components/SchedulesInspections';
import {
  Alert,
  CircularProgress,
  Snackbar,
  StepContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';
import { removeProductsByIds } from '@/store/products/customProducts';
import AddUser from '../../../users/Add-user/addUser';

const steps = ['Dados do Cliente', 'Produtos', 'Financeiro', 'Documentos', 'Agendar Vistoria'];

export default function OnboardingCreateSale({ onClose = null, onEdit = null }) {
  return (
    <OnboardingSaleContextProvider>
      <OnboardingCreateSaleContent onClose={onClose} onEdit={onEdit} />
    </OnboardingSaleContextProvider>
  );
}

function OnboardingCreateSaleContent({ onClose = null, onEdit = null }) {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogPaymentOpen, setIsDialogPaymentOpen] = useState(false);
  const [isDialogDocumentOpen, setIsDialogDocumentOpen] = useState(false);
  const [totalPayments, setTotalPayments] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // Nova flag para disparar o save do usuário
  const [userSubmitTrigger, setUserSubmitTrigger] = useState(false);

  const formatFieldName = (fieldName) => {
    const fieldLabels = {
      customer_id: 'Cliente',
      seller_id: 'Vendedor',
      sales_supervisor_id: 'Supervisor de Vendas',
      sales_manager_id: 'Gerente de Vendas',
      branch_id: 'Franquia',
    };
    return fieldLabels[fieldName] || fieldName;
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const user = useSelector((state) => state.user);

  const { customerId, productIds, saleId, setSaleId, totalValue, setCustomerId } =
    useContext(OnboardingSaleContext);

  const [isDisabledNext, setIsDisabledNext] = useState(false);

  const isCompleteFinancial = async (id) => {
    try {
      const response = await saleService.getSaleByIdWithPendingContract(id);
      return response?.can_generate_contract?.failed_dependencies?.payment_data === undefined;
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const isCompleteUnits = async (id) => {
    try {
      const response = await saleService.getSaleByIdWithPendingContract(id);
      return response?.can_generate_contract?.failed_dependencies?.have_units === undefined;
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const totalPaymentsCreated = async (id) => {
    try {
      const response = await paymentService.getAllPaymentsBySale(id);
      console.log(response);
      return response.results.reduce((acc, curr) => acc + Number(curr.value), 0);
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  useEffect(() => {
    if (activeStep === 0 && !customerId) {
      setIsDisabledNext(true);
    } else {
      setIsDisabledNext(false);
    }
    if (activeStep === 1 && productIds.length === 0) {
      setIsDisabledNext(true);
    } else {
      setIsDisabledNext(false);
    }
  }, [activeStep, customerId, productIds]);

  // Efeito que avança a etapa 0 para a 1 quando o usuário for salvo (customerId definido)
  useEffect(() => {
    if (activeStep === 0 && customerId) {
      setActiveStep(1);
      setUserSubmitTrigger(false);
    }
  }, [customerId, activeStep]);

  const handleNext = async () => {
    if (activeStep === 0 && !customerId) {
      setUserSubmitTrigger(true);
      return;
    }

    if (activeStep === 1) {
      setIsDialogOpen(true);
      return;
    }
    if ((activeStep === 1 && productIds.length === 0) || (activeStep === 1 && !saleId)) {
      return;
    }
    if (activeStep === 2) {
      const isFinancialComplete = true;
      if (!isFinancialComplete) {
        setIsDialogPaymentOpen(true);
        const totalPayments = await totalPaymentsCreated(saleId);
        setTotalPayments(totalPayments);
        return;
      }
    }
    if (activeStep === 3) {
      const isUnitsComplete = await isCompleteUnits(saleId);
      if (!isUnitsComplete) {
        setIsDialogDocumentOpen(true);
        return;
      }
    }
    if (activeStep === steps.length - 1) {
      setLoading(true);
      if (onEdit) {
        onEdit(saleId);
      }
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const {
    formData,
    handleChange,
    handleSave,
    formErrors,
    loading: saleLoading,
    success,
    successData,
  } = useSaleForm();

  useEffect(() => {
    if (success && successData) {
      const product_ids = successData.sale_products;
      dispatch(removeProductsByIds(product_ids));
    }
  }, [success, successData]);

  // Atualiza os dados do sale form com os dados do contexto
  customerId ? (formData.customerId = customerId) : null;
  totalValue ? (formData.totalValue = totalValue) : null;
  productIds ? (formData.productIds = productIds) : null;
  user?.user ? (formData.sellerId = user.user.id) : null;
  user?.user?.employee?.user_manager
    ? (formData.salesSupervisorId = user?.user?.employee?.user_manager)
    : null;
  user?.user?.employee?.user_manager
    ? (formData.salesManagerId = user?.user?.employee?.user_manager)
    : null;
  formData.status = 'P';
  formData.payment_status = 'P';
  user?.user?.employee?.branch ? (formData.branchId = user?.user?.employee?.branch?.id) : null;

  const handleBack = () => {
    if (activeStep > 1) {
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    if (success && successData && activeStep === 1) {
      setSaleId(successData.id);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  }, [success, successData]);

  const handleDialogContinue = async () => {
    setIsDialogOpen(false);
    await handleSave();
    setSnackbarOpen(true);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <AddUser
            label="Dados do Cliente"
            hideSaveButton={true}
            triggerSave={userSubmitTrigger}
            onUserSaved={(userData) => {
              console.log('userData:', userData);
              if (userData && userData.id) {
                setCustomerId(userData.id);
              }
            }}
          />
        );
      case 1:
        return <ListProductsDefault />;
      case 2:
        return <PaymentCard sale={saleId} />;
      case 3:
        return <ChecklistSales saleId={saleId} />;
      case 4:
        return <SchedulesInspections userId={customerId} saleId={saleId} />;
      default:
        return <div>Parabéns, você finalizou o processo de venda!</div>;
    }
  };

  const StepperButtons = ({
    activeStep,
    steps,
    onEdit,
    handleBack,
    handleNext,
    isDisabledNext,
    saleId,
  }) => {
    const renderStepperButtons = () => {
      if (activeStep === steps.length) {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={() => onEdit(saleId)}>Finalizar</Button>
          </Box>
        );
      } else {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0 || activeStep > 1}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Voltar
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext} disabled={isDisabledNext || loading || saleLoading}>
              {loading || saleLoading ? <CircularProgress size={20} /> : 'Próximo'}
            </Button>
          </Box>
        );
      }
    };

    return <Fragment>{renderStepperButtons()}</Fragment>;
  };

  return (
    <Box
      sx={{
        width: '100%',
        padding: 3,
        height: { xs: '80vh', md: '70vh' },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stepper
        activeStep={activeStep}
        orientation={useMediaQuery(useTheme().breakpoints.down('md')) ? 'vertical' : 'horizontal'}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            {useMediaQuery(useTheme().breakpoints.down('md')) && (
              <StepContent>
                <Box sx={{ flexGrow: 1, mt: 2, mb: 1 }}>{renderStepContent(activeStep)}</Box>
                <StepperButtons
                  activeStep={activeStep}
                  steps={steps}
                  onEdit={onEdit}
                  handleBack={handleBack}
                  handleNext={handleNext}
                  isDisabledNext={isDisabledNext}
                  saleId={saleId}
                />
              </StepContent>
            )}
          </Step>
        ))}
      </Stepper>

      {useMediaQuery(useTheme().breakpoints.up('md')) && (
        <>
          <Box
            sx={{
              flexGrow: 1,
              mt: 2,
              paddingBottom: 5,
              maxHeight: '70vh',
              overflow: 'auto',
            }}
          >
            {renderStepContent(activeStep)}
          </Box>
          <StepperButtons
            activeStep={activeStep}
            steps={steps}
            onEdit={onEdit}
            handleBack={handleBack}
            handleNext={handleNext}
            isDisabledNext={isDisabledNext}
            saleId={saleId}
          />
        </>
      )}

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirmar ação</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você não poderá mudar os produtos após continuar. Deseja revisar ou continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Revisar</Button>
          <Button onClick={handleDialogContinue} autoFocus>
            Continuar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDialogPaymentOpen} onClose={() => setIsDialogPaymentOpen(false)}>
        <DialogTitle>Atenção</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Para finalizar esse processo, é necessário criar pagamentos que somem o valor total da
            venda, que é de{' '}
            <b>
              {Number(totalValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </b>
            . Atualmente, o valor total dos pagamentos criados é de{' '}
            <b>
              {Number(totalPayments).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </b>
            . Por favor, crie pagamentos suficientes para atingir o valor total da venda.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogPaymentOpen(false)} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDialogDocumentOpen} onClose={() => setIsDialogDocumentOpen(false)}>
        <DialogTitle>Atenção</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Os dados do checklist de rateio não estão completos. Por favor, complete o checklist
            para continuar.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogDocumentOpen(false)} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={formErrors && Object.keys(formErrors).length > 0 ? 'error' : 'success'}
          sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
          iconMapping={{
            error: <Error style={{ verticalAlign: 'middle' }} />,
            success: <CheckCircle style={{ verticalAlign: 'middle' }} />,
          }}
        >
          {formErrors && Object.keys(formErrors).length > 0 ? (
            <ul
              style={{
                margin: '10px 0',
                paddingLeft: '20px',
                listStyleType: 'disc',
              }}
            >
              {Object.entries(formErrors).map(([field, messages]) => (
                <li
                  key={field}
                  style={{
                    marginBottom: '8px',
                  }}
                >
                  {`${formatFieldName(field)}: ${messages?.join(', ')}`}
                </li>
              ))}
            </ul>
          ) : (
            'Alterações salvas com sucesso!'
          )}
        </Alert>
      </Snackbar>
    </Box>
  );
}
