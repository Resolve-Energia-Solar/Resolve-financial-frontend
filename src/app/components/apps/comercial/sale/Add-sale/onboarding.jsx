import React, { Fragment, useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CreateCustomerSale from '../../../users/Add-user/customerSale';
import {
  OnboardingSaleContextProvider,
  OnboardingSaleContext,
} from '@/app/context/OnboardingCreateSale';
import ListProductsDefault from '../../../product/Product-list/ListProductsDefault';
import PaymentCard from '../../../invoice/components/paymentList/card';
import useSaleForm from '@/hooks/sales/useSaleForm';
import { useSelector } from 'react-redux';
import saleService from '@/services/saleService';
import paymentService from '@/services/paymentService';
import ChecklistSales from '../../../checklist/Checklist-list/ChecklistSales';
import SchedulesInspections from '../../../project/components/SchedulesInspections';
import { CircularProgress, StepContent, useMediaQuery, useTheme } from '@mui/material';
import { t } from 'i18next';

const steps = ['Dados do Cliente', 'Produtos', 'Financeiro', 'Documentos', 'Agendar Vistoria'];

export default function OnboardingCreateSale({ onClose = null, onEdit = null }) {
  return (
    <OnboardingSaleContextProvider>
      <OnboardingCreateSaleContent onClose={onClose} onEdit={onEdit} />
    </OnboardingSaleContextProvider>
  );
}

function OnboardingCreateSaleContent({ onClose = null, onEdit = null }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogPaymentOpen, setIsDialogPaymentOpen] = useState(false);
  const [isDialogDocumentOpen, setIsDialogDocumentOpen] = useState(false);
  const [totalPayments, setTotalPayments] = useState(0);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);

  const { customerId, productIds, saleId, setSaleId, totalValue } =
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

  const handleNext = async () => {
    if (activeStep === 1) {
      setIsDialogOpen(true);
      return;
    }

    if (activeStep === 0 && !customerId) {
      return;
    }

    if ((activeStep === 1 && productIds.length === 0) || (activeStep === 1 && !saleId)) {
      return;
    }

    if (activeStep === 2) {
      const isFinancialComplete = await isCompleteFinancial(saleId);

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
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <CreateCustomerSale />;
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
    </Box>
  );
}
