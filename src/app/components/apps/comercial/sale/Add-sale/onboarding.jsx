'use client';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CreateCustomerSale from '../../../users/Add-user/customerSale';
import {
  OnboardingSaleContextProvider,
  OnboardingSaleContext,
} from '@/app/context/OnboardingCreateSale';
import ListProductsDefault from '../../../product/Product-list/ListProductsDefault';
import PaymentCardOnboardingSale from '../../../invoice/components/paymentList/cardSaleOnboarding';

const steps = ['Dados do Cliente', 'Produtos', 'Financeiro', 'Checklist'];

export default function OnboardingCreateSale() {
  return (
    <OnboardingSaleContextProvider>
      <OnboardingCreateSaleContent />
    </OnboardingSaleContextProvider>
  );
}

function OnboardingCreateSaleContent() {
  const [activeStep, setActiveStep] = useState(0);

  const { customerId, productIds} = useContext(OnboardingSaleContext);

  const [isDisabledNext, setIsDisabledNext] = useState(false);

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

  const handleNext = () => {
    if (activeStep === 0 && !customerId) {
      alert('Por favor, selecione ou crie um cliente antes de continuar.');
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <CreateCustomerSale />;
      case 1:
        return <ListProductsDefault />;
      case 2:
        return <PaymentCardOnboardingSale />;
      case 3:
        return <div>Finalize your ad creation process.</div>;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        padding: 3,
        height: { xs: '80vh', md: '50vh' },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ flexGrow: 1, mt: 2, mb: 1 }}>{renderStepContent(activeStep)}</Box>

      {activeStep === steps.length ? (
        <Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </Fragment>
      ) : (
        <Fragment>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Voltar
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext} disabled={isDisabledNext}>
              Próximo
            </Button>
          </Box>
        </Fragment>
      )}
    </Box>
  );
}
